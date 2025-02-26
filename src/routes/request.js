const express = require('express')
const { userAuth } = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router()




requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const senderId = req.user._id;
            const receiverId = req.params.toUserId;
            const status = req.params.status;
            console.log(senderId,receiverId,req.user)

            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid status type: " + status });
            }

            const toUser = await User.findById(receiverId);
            if (!toUser) {
                return res.status(404).json({ message: "User not found!" });
            }

            const existingConnectionRequest = await connectionRequestModel.findOne({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            });
            if (existingConnectionRequest) {
                return res
                    .status(400)
                    .send({ message: "Connection Request Already Exists!!" });
            }

            const connectionRequest = new connectionRequestModel({
                senderId, receiverId,
                status,
            });

            const data = await connectionRequest.save();


            res.json({
                message:
                    req.user.firstName + " is " + status + " in " + toUser.firstName,
                data,
            });
        } catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
    }
);




requestRouter.patch('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        //request with "interested" status to be changed to "accepted" or "rejected"
        const allowedStatus = ["accepted", "rejected"];


        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed" })
        }

        const connectionRequestInDb = await connectionRequestModel.findOne({
            _id: requestId,
            receiverId: loggedInUser._id,
            //ensures that only interested request is accepted or rejected 
            status: "interested",
        })

        if (!connectionRequestInDb) {
            return res.status(404).json({
                message: "Connection Request not found!!"
            }
            )
        }
        connectionRequestInDb.status = status;
        const data = await connectionRequestInDb.save();

        res.json({
            message: "Connection request" + status, data
        })


    } catch (err) {
        res.status(400).send("ERROR:" + err.message)
    }

})

module.exports = requestRouter