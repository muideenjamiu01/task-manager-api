//load in express to our project
const express = require('express')

//loading mongoose 
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

 
//creating the new express application
const app = express()
//defining the port to use in deploying to heroku
const port = process.env.PORT 
 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//now listen on port 3000
app.listen(port, () => {
    console.log('server is up on port ' + port)
})
