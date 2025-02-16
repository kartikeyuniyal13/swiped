require("dotenv").config({ path: ".env.local" });
const jwt= require("jsonwebtoken")
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
   try{
    const {token}=req.cookies

    if(!token){
        throw new Error("Invalid token!!")
    }
    const decodedInfo= await jwt.verify(token,process.env.
        JWT_SECRET)

    const user=await User.findById(decodedInfo._id)

    if(!user){
        throw new Error("User not found")
    }

    // Attach the whole user document retrieved from db to the request object so it can be accessed in subsequent handlers
    req.user=user;
    
    next()
   }catch(err){
    res.status(400).send("Error:"+err.message)
   }
}
module.exports={userAuth}