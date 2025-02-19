const { Router } = require('express')
const jwt = require('jsonwebtoken')
const  { JWT_USER_PASSWORD } = require("../config");
const { userModel, courseModel,purchaseModel } = require('../db');
const { userMiddleware } = require("../middleware/user");
const userRouter = Router()


userRouter.post('/signup', function(req,res) {
     const { email, password, firstName, lastName } = req.body;

    userModel.create({
        email:email,
        password:password,
        firstName : firstName,
        lastName : lastName
    })
    res.json({
        message : "user signed up"
    })
})

userRouter.post('/signin',async function(req,res) {
     const {email, password} = req.body;

     const user = await userModel.findOne({
         email:email,
         password:password
     })
 
     if(user) {
         const token = jwt.sign({
             id : user._id
         },JWT_USER_PASSWORD)
         console.log(token)
 
         res.json({
             message : "user signed in",
             token: token
         })
     }
     else{
         res.json({
             message: "user not  found"
         })
     }
})

userRouter.get('/purchases',userMiddleware,async function(req,res) {
     const userId = req.userId;

     const purchases = await purchaseModel.find({
          userId
     })
     let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
     purchases,
     coursesData
    })
})



module.exports={
     userRouter : userRouter
}