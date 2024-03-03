//controller ke andar hum methods likh rhe hai jo bhi execute krani hai
//suppose ek user ko register krana hai to hum register method me uska success code likh kr return krwa denge user ko

import { asyncHandler } from "../utils/asyncHandler.js";//{} ye as a object isiliye import kiye hai kyuki asyncHandler file me wo isi prakar exported tha
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//now ab really me user ko register krwao
const registerUser = asyncHandler( async (req, res) => {
     //step 1: get user details from frontend
     //step 2: validation - not empty
     //step 3: check if user already exists: username, email
     //step 4: check for images, check for avatar
     //step 5: upload them to cloudinary, avatar
     //step 6: create user object - create entry in db
     //step 7: remove password and refresh token field from response
     //step 8: check for user creation
     //step 9: return res

//step 1: ab frontend se data lao
     const {fullName,email,userName,password}= req.body//isse humko sara json aur form data mil jayega frontend se 
     console.log("email is: ",email);//ab isko frontend se lene ke liye postman me jao
     //wha body me jaakr se raw data select kro aur wha json me {"email": "ayush@gmail.com"} likho to response yha mil jayega

     //now ab images ko bhi to lena hai fontend se backend me
     //to iske liye goto user.routes.js and wha multer ka use krke avatar aur coverimage ko bhi lelo


//step 2: validation - not empty

     // if(fullName===""){
     //      throw new ApiError(400, "fullname is required!!");
     // }

     //easy way for validation
     if([fullName,userName,email,password].some((field)=>
     (field?.trim === "")
     )){
          throw new ApiError(400, "All fields are required!!: Client error");
     }

//step 3: check if user already exists: username, email

     //now ab user database me hai ya nhi, iske liye mujhe db access krna padega jo mujhe User access kra dega kyuki wo khud mongoose se bna
     // hai, yakeen na ho to User.model.js me jaake dekho

     const existedUser = await User.findOne({
          $or: [ {userName}, {email}]
     })
    
     if(existedUser){
          throw new ApiError(409,"User already exist with username or email: Client error");//ye thoda change kr skte ho logic
     }


//step 4: check for images, check for avatar

     //ab ye req.files inbuilt method hume multer ne provide kraya hai jbki req.body express deta hai
     const avatarLocalPath = req.files?.avatar?.[0]?.path;
     let coverImageLocalPath = req.files?.coverImage?.[0]?.path

     if(!avatarLocalPath){throw new ApiError(400,"Avatar file is required: multer error cannot upload to localserver")}//agr avatar nhi h to error dedo
     
     // let coverImageLocalPath;
     // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
     //     coverImageLocalPath = req.files.coverImage[0].path
     // }


//step 5: upload them to cloudinary, avatar
     const avatar = await uploadOnCloudinary(avatarLocalPath);//ab ye time lagaega to async await use krenge yha
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
     
     //agr avatar nhi hai to error dedo kyuki wo required h, double check krlo yha bhi
     if(!avatar) {throw new ApiError(400,"Avatar is required: Cloudinary upload error")}
     


//step 6: create user object - create entry in db
    const user = await User.create({
          fullName,
          userName: userName.toLowerCase(),
          avatar:avatar.url,
          coverImage: coverImage?.url || "",
          email,
          password,
     })
     // avatar:avatar.url kyuki wha cloudinary.js me wo pura response bhej rha h but hume to url chahiye cloudinary ki, db me create krne ke liye 

     //ab user create hua h to db me uska id to associate hota h joki db deta hai then usi id me password and refreshtokn ko select krke hta do

     

//step 7: remove password and refresh token field from response 
const createdUser = await User.findById(user._id).select(
     "-password -refreshToken" 
     )
     
//step 8: check for user creation
     if(!createdUser){
          throw new ApiError(500, "Something went wrong while registering user: Server Error")
     }


 //step 9: return res
     // ye response ApiResponse.js se aayega, isko direct bhi likh skte the like "return new ApiResponse()" 
     return res.status(201).json(
          new ApiResponse(200,createdUser,"User registered successfully in database:)")
     )

//now goto postman then select Post then body then select form-data and give the keys as given in this file 
//ab dikkat ye hai ki local me (./public) me images aa rhi hai and cloudinary me bhi aa rhi hai and save ho jaa rhi hai but ab wha se inko htana bhi hai
//iske liye goto cloudinary.js and unlink the files


}
)
export {registerUser};














// const registerUser = asyncHandler( async(req,res)=>{
// //    return console.log(" this is our registerUser method")
//      res.status(200).json({message: "Ok registered!!"})
// })//ab asyncHandler ek higher order function hai jo ki method leta hai as an argument

// export {registerUser};
