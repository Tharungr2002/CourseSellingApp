require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course')
const {adminRouter } = require('./routes/admin')
const {userModel, adminModel, courseModel, purchaseModel } = require('./db')

const app = express()

app.use(express.json());

app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/admin',adminRouter)



mongoose.connect(process.env.MONGO_URL)
app.listen(3000, function(){
    console.log('server is running')    
} )