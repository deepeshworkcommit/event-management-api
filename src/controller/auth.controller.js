const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req,res){
    try{
        const {username,email,password,role} = req.body;
        const user = await userModel.findOne({
            $or:[{username},{email}]
        });
        if(user){
            return res.status(403).json({
                message:"User already present."
            });
        }
        const hashed = await bcrypt.hash(password,10);
        const newUser = await userModel.create({username,email,password:hashed,role})
        const token = jwt.sign({id:newUser._id,role:newUser.role},process.env.JWT_SECRET);
        res.cookie("token",token);
        return res.status(201).json({
            message:"registration successfull",
            user:newUser
        });
        
    }catch(err){
        return res.status(400).json({
            message:err.message
        })
    }
}

async function loginUser(req,res){
    try{
        const {username,email,password} = req.body;
        const isUser = await userModel.findOne({
            $or:[{username},{email}]
        });
        if(!isUser){
            return res.status(403).json({message:"Invalid user"});
        }

        const checkPass = await bcrypt.compare(password,isUser.password);
        if(!checkPass){
            return res.status(403).json({message:"Invalid user credentials"});
        }
        const token = jwt.sign({id:isUser._id,role:isUser.role},process.env.JWT_SECRET);
        res.cookie("token",token);
        return res.status(200).json({
            message:"Logged in successfully",
            username:isUser.username,
            role:isUser.role
        });
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}
module.exports={registerUser,loginUser}