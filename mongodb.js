// CRUD operation 
//  const mongodb = require('mongodb')
//  const MongoClient = mongodb.MongoClient // mongoclient is going to give us access to function necessary to perfrom crud operation
// const objectid = mongodb.ObjectID

//restructuring all the 3 lines to a sinlge line of code
const{MongoClient, ObjectID}= require('mongodb')

 //connection to database
  const connectionURL = "mongodb://127.0.0.1:27017"
  const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useUnifiedTopology:true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to databse')

    }
    const db = client.db(databaseName)
    
})