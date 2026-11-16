const eventModel = require("../models/events.model");
const jwt = require('jsonwebtoken');

async function createEvent(req,res){
    try{
        const {title,description,date,venue} = req.body
        const event = await eventModel.create({
            title,description,date,venue,createdBy:req.user.id
        });
        return res.status(201).json({
            message:"Event created",
            event
        })
        
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}

async function eventRegister(req,res){
    try{
        const eventId = req.params.id;
        const checkEvent = await eventModel.findById(eventId);
        if(!checkEvent){
            return res.status(400).json({message:"No Such Events."});
        }
        if(checkEvent.attendees.includes(req.user.id)){
            return res.status(403).json({message:"Already registered"});
        }
        const updateRegistry = await eventModel.findByIdAndUpdate(eventId,{
            $addToSet:{
                attendees:req.user.id
            }
        })
        const allAttendees = await eventModel.findById(eventId).populate('attendees');
        return res.status(201).json({message:"Registered for the event.",updateRegistry,attendees:allAttendees.attendees})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}

async function getAllEvents(req,res){
    try{
        const events = await eventModel.find();
        if(events.length===0){
            return res.status(403).json({message:"No events available"})
        }
        return res.status(200).json({
            events
        })
    }catch(err){
        return res.status(400).json({message:err.message});
    }
}

async function getEventById(req,res){
    try{
        const eventId = req.params.id;
        const events = await eventModel.findById(eventId);
        if(events.length===0){
            return res.status(403).json({message:"No events available"})
        }
        return res.status(200).json({
            events
        })
    }catch(err){
        return res.status(400).json({message:err.message});
    }
}

async function deleteEvent(req,res){
    try{
        const eventId = req.params.id;
        const event = await eventModel.findByIdAndDelete(eventId);
        if(!event){
            return res.status(403).json({message:"No Such Events"});
        }
        if(event.createdBy.toString() !== req.user.id){
            return res.status(403).json({message:"Not Your Event"});
        }
        return res.status(200).json({
            message:"Event deleted successfully",
            event
        })
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
module.exports={createEvent,eventRegister,getAllEvents,getEventById,deleteEvent}