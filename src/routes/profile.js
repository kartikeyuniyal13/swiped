const express=require('express')
const {userAuth}=require('../middlewares/auth')
const profileRouter=express.Router()
const {validateEditProfileData}=require('../utils/validation')
require('dotenv').config({path:".env.local"})


//userAuth middleware check user loggedin or not
profileRouter.get('/profile/view',userAuth,(req,res)=>{
    try{

       //.user object added by the userAuth to the req obj
        const user=req.user;
        res.send(user)
    }catch(err){
        res.status(401).send("Error :"+ err.message)
    }

})


////userAuth middleware check user loggedin or not
profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        console.log("called")
        if(!validateEditProfileData(req)){
            //can mention which field caused the error
            throw new Error("Invalid Edit request!!")
        }
        

        //The req.user is not just a simple object but rather a Mongoose document instance that is retrieved from the database in your userAuth middleware.
        const user=req.user;

       Object.keys(req.body).forEach((field)=>{
        user[field]=req.body[field]
       })
       
       await user.save()
       res.json({
        message:`${user.firstName},your profile is updated successfully`,
        data:user
       })

    }catch(err){
        res.status(400).send("Error"+err.message)
    }
})

module.exports=profileRouter