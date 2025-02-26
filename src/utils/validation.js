const validator=require("validator")
require("dotenv").config({ path: ".env.local" });

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName||!lastName){
        throw new Error("Name is not valid.Enter full name.")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email.")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password.")
    }
}

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","age","gender"]

   const isEditAllowed= Object.keys(req.body).every((field)=>{
    return allowedEditFields.includes(field)
    })
    return isEditAllowed
}
module.exports={
    validateSignUpData,
    validateEditProfileData
}