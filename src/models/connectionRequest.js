const { timeStamp } = require('console')
const mongoose=require('mongoose')

const connectionRequestSchema= new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type:String,
        //, enum is a schema type option that restricts a field to accept only specific predefined values.
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect type`

        },
        required: true,
    },

},{
    timestamps:true
})

const connectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);



module.exports = connectionRequestModel;