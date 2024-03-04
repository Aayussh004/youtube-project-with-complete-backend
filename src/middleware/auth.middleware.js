import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

//yha res use nhi ho rha hai to "_" bhi likh skte hai

export const verifyJWT = asyncHandler(async (req,res,next)=>{
//ye hume apni req se isiliye mil rha hai kyuki user.control.js me humne login krte time user ko ya frontend ko cookie ke roop me access and refresh token bhi provide kraye the 

//to jo chiz di hai whi to wapis maang rhe hai
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    if(!token){throw new ApiError(401,"Unothorized request: auth.middleware.js")}
 
    //for verifying the token from our db 
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    //get the user
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")//ye argument ki value generateAccessToken me generate krte time _id diye the to whi hai
 
    if(!user){throw new ApiError(401,"Invalid access token: auth.middleware.js")}
 
    req.user = user
    next()//iske baad logoutUser chalega wo jo user.routes.js ke andar logout ka route likha tha
   }
    catch (error) {
    throw new ApiError(401,"Invalid access token: auth.middleware.js"); 
   }
})

//now goto user.routes.js aur wha jaa ke "/logout" se phle iss middleware ko run krwana