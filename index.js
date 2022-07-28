import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"
import cors from "cors"


const app=express()
dotenv.config()
app.use(cors(
    
))

const connect = async()=>{
try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongoDB")
  } catch (error) {
    throw error; 
  }
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected");
})
//middlewares
app.use(express.json())

app.use(cookieParser())
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// })
app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/hotels",hotelsRoute)
app.use("/api/rooms",roomsRoute)

app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500;
    const errorMessage=err.message|| "Something went wrong";
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    })
})

app.listen(process.env.PORT || 80,()=>{
    connect()
    console.log("connected to backend"+process.env.PORT);
})