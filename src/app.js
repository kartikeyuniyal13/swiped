
//The Express app is essentially an abstraction over the Node.js HTTP module.
//Route handlers match only if the requested path exactly matches the defined route.
//import authfn from './middlewares/auth';
const {authfn}=require("./middlewares/auth")
const express=require('express');
const connectDb=require("./config/database")
const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const cookieParser=require("cookie-parser")

const app=express();

app.use(express.json()); 
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)


connectDb().then(()=>{
    console.log("Database connection established...")
    app.listen(3540,()=>{
        console.log("server is succesfuly running at port 3540")
    })
}).catch((err)=>{
    console.error("Database can't be connected!!")
})

