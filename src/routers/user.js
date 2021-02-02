const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


//http request for User Sign

router.post('/users', async (req, res) =>{
    const user = new User(req.body)
    
    try {
       await user.save()
       const token = await user.generateAuthToken()
        res.status(201).send({user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    
})
//http request for user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token })
    } catch (e) {
        res.status(400).send()
    }
})



//logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
      res.status(500).send()  
    }
})

//Logout ALL my account at once on every phones, system i log in
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens =[]
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me',  auth, async(req, res) => {
    res.send(req.user)
    
})




//updating((patch means update) user by Authtntication

router.patch('/users/me', auth, async(req, res) => {
   //these are the fields that are allowed for user to change 
   const updates = Object.keys(req.body)
   const allowedUpdates = ['name', 'email','password','age']
   const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


   if (!isValidOperation) {
       return res.status(400).send({error: 'invalid updates!'})
   }
    try {
        
        updates.forEach((update) => req.user[update]= req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }

    
})


//Deleting user by authentication
router.delete('/users/me', auth, async(req, res) => {
    try {
       
        await req.user.remove()
       res.send(req.user)
    } catch (error) { 
    res.status(500).send()
    }


})
//setup endpoint for avatar upload
const upload = multer({
        limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a images with jpg,jpeg,png extensions'))
        }

        cb(undefined, true)
    }
})

//uploading user profile picture
router.post('/users/me/avatar',auth,upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


//deleting user profile picture
router.delete('/users/me/avatar',auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//fetching the profile picture named avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router


//upload and cropping user profile ptcture from its initial size
// router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.user.avatar = buffer
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })
// since user is changing the file extension to png ,user should also change the content type to png image/jpg