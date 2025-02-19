const { Router} = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { adminModel, courseModel, userModel } = require('../db');
const  { JWT_ADMIN_PASSWORD } = require("../config");
const {adminMiddleware} = require('../middleware/admin')

const adminRouter = Router();

adminRouter.post('/signup',async function(req,res) {
    const { email, password, firstName, lastName } = req.body;

    const hashedpassword =await bcrypt.hash(password,10)

    await adminModel.create({
        email:email,
        password:hashedpassword,
        firstName : firstName,
        lastName : lastName
    })
    res.json({
        message : "admin signed up"
    })
})

adminRouter.post('/signin', async function(req,res) {
    const {email, password} = req.body;

    const response = await adminModel.findOne({
        email
    })

    const dehash = await bcrypt.compare(password,response.password)

    if(dehash) {
        const token = jwt.sign({
            id : dehash._id
        },JWT_ADMIN_PASSWORD )
        console.log(token)

        res.json({
            message : "admin signed in",
            token: token
        })
    }
    else{
        res.json({
            message: "admin not  found"
        })
    }

})

adminRouter.post('/course',adminMiddleware,async function(req,res) {
    const adminId = req.userId;
    const {title,description,price,imageUrl } = req.body;

    const course = await courseModel.create({
        title: title,
        description:description,
        price: price,
        imageUrl: imageUrl,
        creatorId : adminId
    })

    res.json({
        message: "course created",
        courseId: course._id
    })
})

adminRouter.put('/course',adminMiddleware,async function(req,res) {
    const adminId = req.userId;
    const {title,description,price,imageUrl,courseId } = req.body;

    const course = await courseModel.findOneAndUpdate({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title,
        description:description,
        price: price,
        imageUrl: imageUrl
    },{ new: true })
    
    res.json({
        message: "course updated",
        courseId: course
    })
})

adminRouter.get('/course/bulk',adminMiddleware,async function(req,res) {
    const adminId = req.userId;
    const course = await courseModel.find({
        creatorId : adminId
    })
    res.json({
        message: "All courses",
        course,
    })
})

module.exports = {
    adminRouter : adminRouter
}



