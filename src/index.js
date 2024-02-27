// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

// import express from "express";
// const app = express();

//now DB ko connect krne ke 2 tarike hai
// 1. saara code index.js me likh lo
// 2. ya phir alag se file bna ke (db) likho aur uska func export krdo

// here we follow 1st approach
// but before writing code for database connction we need to understand ki db ko connect hone me time lagta hai 
// to uske liye hum async await use krenge
// and second database me bahut error hote hai 
// to uske liye try catch use krenge

/*
// 1st Method
//ab clean code krne ke liye hum iife function use krenge

(async ()=>{
   try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
   //maan lo ab db connect ho gya hai but express me error aa rhi hai to usko handle kro
   app.on("eroor",(error)=>{
    console.log("Error: ",error)
    throw error
   })

   //ab agr baat ho rhi hai app se to listen
   app.listen(process.env.PORT,()=>{
    console.log(`App is listening on port: ${process.env.PORT}`)
   })
   } 
   catch (error) {
    console.error("ERROR: ",error);
    throw error
   }
})()

*/

//2nd method
// written in /db/index.js
import connectDB from "./db/index.js"

// DOTENV 
// dotenv is most important file so hum sbse phli file jo run hogi usme import kro
// because .env must be available to all as soon as possible

//1st method
// require('dotenv'.config({path:'./env'})) //1st method to import

// 2nd method
import dotenv from "dotenv"//2nd method but json ke dev me changes krne honge 
// nodemon -r dotenv/config --experimental-json-modules src/index.js
dotenv.config({
    path: './env'
})

connectDB();//2nd method jo import kiye the db se 