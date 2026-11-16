const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    attendees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
});

const eventModel = mongoose.model("event",eventSchema);
module.exports=eventModel;