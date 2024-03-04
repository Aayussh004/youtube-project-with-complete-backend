import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(
    //ye multer hum apni images like avatar,coverimage ko local server me download krne ke liye kr rhe hai
    //now before registering user we will upload the data in our local server using middleware multer (upload method) humse milke jana 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]) , 
    registerUser
    )//yha hum post method call kr rhe hai

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)

// http://localhost:8000/api/v1/users/register to ab ye registerUser call krdega jo ki message "Ok registerd" de dega
//now download postman and create new workspace and give this same link

export default router;//ab default mode me export krne ka mtlb hai saamne wali file isko koi bhi naam se pukaar skti hai