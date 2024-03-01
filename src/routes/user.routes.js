import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUser)//yha hum post method call kr rhe hai

// http://localhost:8000/api/v1/users/register to ab ye registerUser call krdega jo ki message "Ok registerd" de dega
//now download postman and create new workspace and give this same link

export default router;//ab default mode me export krne ka mtlb hai saamne wali file isko koi bhi naam se pukaar skti hai