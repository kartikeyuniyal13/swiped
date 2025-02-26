const express=require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest=require('../models/connectionRequest')
const User = require('../models/user')
const connectionRequestModel = require('../models/connectionRequest')
const userRouter=express.Router()


userRouter.get('/user/requests/received',userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;

        const pendingConnectionRequests=await connectionRequest.find({
            receiverId:loggedInUser._id,
            //only the pending interested requests
            status:"interested"
        }).populate("senderId",["firstName","lastName","age","gender"])
        //or populate("senderId","firstName lastName"])


    // instead of getting names of sender in following way we can create the reference to the user model
    // 
    //   /*
      
    //   const senderList= await Promise.all(
    //         pendingConnectionRequests.map(async (request)=>{
    //           try{ return  await User.findById({
    //             _id:request.senderId
    //         })}
    //         catch(err){
    //             console.error(`Failed to fetch sender ${request.senderId}:`, err.message);
    //             return null;
    //         }       
    //        })
    //     )*/

        res.json({
            message:"Data fetched successfully",
            data:pendingConnectionRequests
                })

    }catch(err){
        req.status(400).send("Error:"+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
  try{
    const loggedInUser=req.user;
    const connections = await connectionRequestModel.find({
        $or: [
            { senderId: loggedInUser._id, status: "accepted" },
            { receiverId: loggedInUser._id, status: "accepted" }
        ]
    })
    .populate({
        path: "senderId receiverId",
        select: "firstName lastName" // Select only necessary fields
    });
    
    const otherParties = connections.map(connection => {


        //cant compare the id here using ===
        return connection.senderId.equals(loggedInUser._id) 
            ? connection.receiverId // If logged-in user is the sender, get receiver
            : connection.senderId;  // If logged-in user is the receiver, get sender
    });

    res.json({data:otherParties})
  }catch(err){
    res.status(400).send({message:Error.message})
  }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
         const page=parseInt(req.query.page)||1
        let limit=parseInt(req.query.limit)||10
        limit=(limit>30)?30:limit;
        const skip=(page-1)*limit;
        const loggedInUser=req.user;
        //feed wont contain users with which we have interacted before who now have different status in connectionRequest collection
        const interactedUsers=await connectionRequest.find({
            $or:[
                {senderId:loggedInUser._id},
                {receiverId:loggedInUser._id}
            ]
        }).select("senderId receiverId")

        const hiddenUserFromFeed = new Set();

        interactedUsers.forEach((req) => {
            hiddenUserFromFeed.add(req.senderId);
            hiddenUserFromFeed.add(req.receiverId);
        });

        const feedUsers = await User.find({
            $and:[
               {_id: { $nin: Array.from(hiddenUserFromFeed) }},
               {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName age gender").skip(skip).limit(limit);

        res.json({ data: feedUsers });

    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports=userRouter