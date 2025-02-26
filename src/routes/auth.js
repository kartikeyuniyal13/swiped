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

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(400).json({ error: "EmailId and Password both required" });
        }

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 360000),
            httpOnly: true,
        });

        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


authRouter.post('/logout',async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("Logout Successful!!")
})

module.exports=authRouter