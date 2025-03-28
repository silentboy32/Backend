// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"


// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
import {app} from "./app.js"


dotenv.config({
    path:"/.env"
})


connectDB()
.then( () => {
    app.listen(process.env.PORT || 4444, () => {
        console.log(`Server is listening at ${process.env.PORT}`);
        // app.on( (err) => {
        //     console.log("Error ",err)
        //     throw err
        // })
    })
})
.catch( (err) => {
    console.log("MONGO db connection Feiled !!!! ", err);
})










/*
import express from "express";
const app = express()

;( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("Error:", (error) => {
            console.log("Error:",error);
            throw error
        
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log("Error :",error)
        throw error
    }
})()
*/