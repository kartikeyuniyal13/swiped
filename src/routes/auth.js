const express=require('express')
const User = require("../models/user");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config({ path: ".env.local" });
const {validateSignUpData}=require("../utils/validation")

const authRouter=express.Router();

authRouter.post("/signup",async(req,res)=>{
    try{
        const {firstName,lastName,emailId,password}=req.body
       const passwordHash=await bcrypt.hash(password,10)
        validateSignUpData(req)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        });
        await user.save();
        
        res.send("User added successfully")
    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
   
})


authRouter.post("/login",async(req,res)=>{
    const {emailId,password}=req.body;
    const user =await User.findOne({emailId:emailId})

    if(!user){
        throw new Error("Invalid credentials")
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(isPasswordValid){
        const token= await jwt.sign({_id:user._id},process.env.JWT_SECRET)
        res.cookie("token",token,{
            expires:new Date(Date.now()+8*360000),
        })
        res.send("Login successful!!!")
    }else{
        throw new Error("Invalid credentials")
    }

})

authRouter.post('/logout',async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Data.now())
    })
    res.send("Logout Successful!!")
})

module.exports=authRouter