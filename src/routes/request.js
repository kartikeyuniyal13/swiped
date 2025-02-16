const express=require('express')
const { userAuth } = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const requestRouter=express.Router()

requestRouter.post('/request/review/:status/:requestId',userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accept","reject"]
        
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed"})
        }

        const connectionRequestInDb=await connectionRequestModel.findOne({
            _id:requestId,
            receiverId:loggedInUser,
            //ensures that only interested request is accepted or rejected 
            status:"interested",
        })

        if(!connectionRequestInDb){
            return res.status(404).json({
                message:"Connection Request not found!!"
            }
            )
        }
        connectionRequestInDb.status=status;
        const data= await connectionRequestInDb.save();

        res.json({
            message:"Connection request"+status,data
        })


    }catch(err){
        res.status().send("ERROR:"+err.message)
    }

})

module.exports=requestRouter