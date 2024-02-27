import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//Moto: db is in another continent
const connectDB = async()=>{
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)//ye ek object return krta hai
      console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`)//ye pta lagane ke liye ki me konse host pe connect ho rha hu
    } catch (error) {
        console.log("MongoDB connection error:",error)
        process.exit(1)//current reference ka exit krwa rhe hai
    }
}

export default connectDB;