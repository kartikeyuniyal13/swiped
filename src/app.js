const express=require('express');

const app=express();

app.get("/lety",(req,res)=>{
res.send("Hello")
})

app.listen(3540,()=>{
    console.log("server is succesfuly running at port 3540")
})