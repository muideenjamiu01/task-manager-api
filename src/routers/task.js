const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()



//creating or posting TASK request into database

router.post('/task',auth, async (req, res) =>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        Owner:req.user._id
    })
    try {
        const user = await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

    
})


// GET /tasks?completed=true{this is call filtering}
//GET /task?limit=10&skip=10 (pagination)
//// GET /tasks?sortBy=createdAt:desc
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }


    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'task',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.task)
    } catch (e) {
        res.status(500).send()
    }
})





router.get('/task/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
        
        const task = await Task.findOne({_id, Owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//updating((patch means update) TASK by id

router.patch('/task/:id',auth, async(req, res) => {
    //these are the fields that are allowed for user to change 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['discription', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
 
 //checking if it is not  valid operation
    if (!isValidOperation) {
        return res.status(400).send({error: 'invalid updates'})
    }
     try {
         const task = await Task.findOne({_id: req.params.id, Owner: req.user._id})
        

         if (!task) {
                     return res.status(404).send()
         }
         
        updates.forEach((update) => task[update]= req.body[update])
        await task.save()
          res.send(task)
     } catch (error) {
         res.status(400).send()
     }
 
     
})

//Deleting task by id
router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, Owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router