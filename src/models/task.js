const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    discription : {
        type: String,
        required: true,
        trim: true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    Owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
}) 
 const Task = mongoose.model('Task', taskSchema)



module.exports = Task