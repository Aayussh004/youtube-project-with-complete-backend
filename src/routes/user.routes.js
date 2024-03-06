import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(
    //ye multer hum apni images like avatar,coverimage ko local server me download krne ke liye kr rhe hai
    //now before registering user we will upload the data in our local server using middleware multer (upload method) humse milke jana 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)//yha hum post method call kr rhe hai

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

//for creating new refreshtoken for user when they hit this endpoint
router.route("/refreshAccessToken").post(refreshAccessToken)

//for change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

//get current user
router.route("/current-user").get(verifyJWT, getCurrentUser)//get kyuki sirf info le rhe hai

//update account details
router.route("/update-account").patch(verifyJWT, updateAccountDetails)//kyuki kuch details hi update krni hai

//update avatar
//now yha multer bhi lagega kyuki avatar ko upload krna h
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

//update coverImage
router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

//get channel profile kyuki params se le rhe hai
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile)//isko postman me "{{server}}/c/one" likhna h, one is username

//get user watchHistory
router.route("/history").get(verifyJWT, getWatchHistory)


// http://localhost:8000/api/v1/users/register to ab ye registerUser call krdega jo ki message "Ok registerd" de dega
//now download postman and create new workspace and give this same link

export default router;//ab default mode me export krne ka mtlb hai saamne wali file isko koi bhi naam se pukaar skti hai