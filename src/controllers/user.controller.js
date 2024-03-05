//controller ke andar hum methods likh rhe hai jo bhi execute krani hai
//suppose ek user ko register krana hai to hum register method me uska success code likh kr return krwa denge user ko

import { asyncHandler } from "../utils/asyncHandler.js";//{} ye as a object isiliye import kiye hai kyuki asyncHandler file me wo isi prakar exported tha
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

//for making refresh tokens for user
 //step 5: Generate refresh and access token (for Login)
const generateAccessAndRefreshToken = async(userId)=>{
     try {
          const user = await User.findById(userId)//ab user ki info aa gyi h mere paas
         const accessToken = user.generateAccessToken();//current user ke liye generate ho gye hai
         const refreshToken = user.generateRefreshToken();//ye databse me jayega taaki jwt se compare kr ske and user ko bhi dedo refreshtoken

         //ab user ko bhi whi refresh token dedo jo genrate kiya h
         user.refreshToken = refreshToken;
         await user.save({validateBeforSave:false})//coz pswd required tha bt hmare paas h nhi

         return {accessToken,refreshToken};
     } catch (error) {
          throw new ApiError(500,"Something went wrong: Cannot generate tokens for user")
     }
}


 
//now ab really me user ko register krwao
const registerUser = asyncHandler( async (req, res) => {
     //step 1: get user details from frontend
     //step 2: validation - not empty
     //step 3: check if user already exists: userName, email
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

//step 3: check if user already exists: userName, email

     //now ab user database me hai ya nhi, iske liye mujhe db access krna padega jo mujhe User access kra dega kyuki wo khud mongoose se bna
     // hai, yakeen na ho to User.model.js me jaake dekho

     const existedUser = await User.findOne({
          $or: [ {userName}, {email}]
     })
    
     if(existedUser){
          throw new ApiError(409,"User already exist with userName or email: Client error");//ye thoda change kr skte ho logic
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

 //Login User

const loginUser = asyncHandler(async (req,res)=>{

     //for login we have all steps
     //step 1: Take the data from frontend logging in user
     //step 2: Check required fields are filled or not
     //step 3: Validate if userName or email is matching in our db or not
     //step 4: Check if password is correct or not
     //step 5: Generate refresh and access token
     //step 6: Send cookies

//step 1: Take the data from frontend logging in user
  const {email,userName,password} = req.body

//step 2: Check required fields are filled or not
if (!userName && !email) {
     throw new ApiError(400, "userName or email is required")
 }

//step 3: Validate if userName or email is matching in our db or not
  const user = await User.findOne({
          $or:[{userName},{email}]
     })

// agar user nhi mila db me to return error
  if(!user){
     throw new ApiError(404,"User does not exist: cannot find in database!")
           }

//step 4: Check if password is correct or not
     //user -> jo frontend ka user de rha hai, User->jo backend me stored hai
     
     console.log(user.isPasswordCorrect(password))
     const isPasswordValid = await user.isPasswordCorrect(password)

     if(!isPasswordValid){throw new ApiError(401,"Invalid user credentials: wrong password entered!")}

 //step 5: Generate refresh and access token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);//_id mongoose ki id hai and destructuring 

     //ab humne ek user jo db me exist krta hai uske liye access and refresh token bna liye h now ab nya reference deke loggedin user bna lo jiske paas dono token hai

     
//step 6: Send cookies
     const loggedInUser = await User.findById(user._id).select("-password")//ye dono field nhi chahiye kyui cookie send krni hai

     //now cookies
     const options = {//so this cannot be modifiable from browser and only modified from server
       httpOnly:true,
       secure:true
     }


     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
          new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully!")
     )//ye response me tokens bhi send isiliye kr rhe hai ki jb frontend engineer ko tokens ki zarurat ho skti h native apps bnane ke liye

})

//Logout User

const logoutUser = asyncHandler (async (req,res)=>{
     
     //ab user ka access kaise laoge
     //goto middleware and create a method auth.middleware.js there 
     //wha pe jaa ke cookie se user ka accesstoken lelo aur return krwa do taaki uss user ko hum apne db me dhund ke logout kra de 

     //get that user who want to logout and erase the refresh token of tht user
        await User.findByIdAndUpdate(req.user._id,
          {$set:{refreshToken:undefined}},
         {new:true}
         )//for deleting refreshtoken from database
     
     //now ab browser se toke delete krne ke liye cookie ko clear krdo
     const options = {
          httpOnly:true,
          secure:true
     }

     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged out!"))
})


const refreshAccessToken = asyncHandler(async (req,res)=>{

     //sbse phle user se uska refresh token lelo by cookie
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken
     if(!incomingRefreshToken){
          throw new ApiError(401,"Unauthorized request: your token is not right1");
     }

     //now jwt.verify se decoded token lenge user ka kyuki user ke paas encrypted token hota hai 
     try {
          const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     
          //now ab frontend ka token mil gya h ab mongodb ke databse me ussi user ko dhund lo by the above decodedtoken
          const user = await User.findById(decodedToken?._id);
     
          if(!user){throw new ApiError(401,"Unauthorized request: your token is not right2");}
     
          //now ab incomingrefresh token aur jo apn ne decoded token nikala hai wo match krenge to phir wo apna hi user hai usko nya token dedo generate krke
          if(incomingRefreshToken !== user?.refreshToken){
               throw new ApiError(401,"Your Refresh token doesn't match with our db");
          }
     
          //now ab nya token bna ke dedo cookie ke andar apne user ko
          const options = {
               httpOnly:true,
               secure:true
          }
          
          return res.status(200)
         .cookie("refreshToken",newrefreshToken,options)
         .cookie("accessToken",accessToken,options)
         .json(
          new ApiResponse(200,{accessToken,newrefreshToken},"New refresh and accessToken generated successfully")
         )
     } catch (error) {
          throw new ApiError(401,error || "Invalid refresh token")
     }
    
})

//now goto models and make subscription model there

//now we need to update some info of user for that we will create model

//Update Password 
const changeCurrentPassword = asyncHandler(async(req,res)=>{
     const {oldPassword,newPassword} = req.body//take this from frontend

     //if user is logged in then user ko find krlo by his id
     const user = await User.findById(req.user?._id);//ye mil gya apna user db me

     const isPasswordcrct = await user.isPasswordCorrect(oldPassword);
//check if entered pswd is right or not
     if(!isPasswordcrct){throw new ApiError(400,"Invalid old password")};

     //now modify the user pswd and save the pswd 
     user.password = newPassword
     user.save({validateBeforSave:false});

     //now you have changed the pswd successfully
     return res
     .status(200)
     .json(new ApiResponse(200,{},"You have successfully changed the password!!"))

})


// Get the current user
const getCurrentUser = asyncHandler(async(req,res)=>{
     //ye req.user aaya hai apne middleware se jo auth.middleware bnaya tha user ko authenticate krne ke liye
     return res
     .status(200)
     .json(new ApiResponse(200,req.user,"User information fetched successfully from db!"))
})


//update account details
const updateAccountDetails = asyncHandler(async(req,res)=>{
     const {fullName,email} = req.body//jo bhi chij change krana hai wo lelo

     if(!fullName || !email){
          throw new ApiError(400,"All fields are required: email aur fullName both!")
     }

     //now ab update krana hai to current user ko db me find krke direct update kr skte ho $set se
     const user  = await User.findByIdAndUpdate(req.user?._id,{
          $set:{
               fullName:fullName,
               email:email
          }
     },{new:true}).select("-password");

     return res
     .status(200)
     .json(200,user,"Account details updated successfully!!")
})

//update avatar 
const updateUserAvatar = asyncHandler(async(req,res)=>{
     const {avatarLocalPath} = req.file?.path;//user se newavatar lelo jo update krwana hai
     //ye multer se aaya hai kyuki ye file local me upload ho gyi h ab


     //now if avatar ka localpath mil gya to multer ne local me upload krdi hogi
     if(!avatarLocalPath){
          throw new ApiError(400,"Avatar file is required!:avatar not found")
     }

     //now ab new avatar ko cloudinary me upload krna pdega yha mongoose kaam nhi aayega kyoki db to ab cloudinary hai na image files ke liye
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
     throw new ApiError(400,"Error while uploading new avatar to cloudinary!!")
    }

    //now ab mongodb me bhi avatar hai wha ka url change krna pdega na 
    //get the user and update the url of cloudinary in db
    const user = await User.findByIdAndUpdate(req.user?._id,{
     $set:{avatar:avatar.url}
    },{new:true}).select("-password")//password hta do

    return res
    .status(200)
    .ApiResponse(200,user,"Avatar Changed successfully!!");
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
     const {CoverLocalPath} = req.file?.path;//user se newavatar lelo jo update krwana hai
     //ye multer se aaya hai kyuki ye file local me upload ho gyi h ab


     //now if avatar ka localpath mil gya to multer ne local me upload krdi hogi
     if(!CoverLocalPath){
          throw new ApiError(400,"Avatar file is required!:avatar not found")
     }

     //now ab new avatar ko cloudinary me upload krna pdega yha mongoose kaam nhi aayega kyoki db to ab cloudinary hai na image files ke liye
    const CoverImage = await uploadOnCloudinary(avatarLocalPath)

    if(!CoverImage.url){
     throw new ApiError(400,"Error while uploading new avatar to cloudinary!!")
    }

    //now ab mongodb me bhi avatar hai wha ka url change krna pdega na 
    //get the user and update the url of cloudinary in db
    const user = await User.findByIdAndUpdate(req.user?._id,{
     $set:{coverimage:CoverImage.url}
    },{new:true}).select("-password")//password hta do

    return res
    .status(200)
    .ApiResponse(200,user,"CoverImage Changed successfully!!");
})
export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,updateAccountDetails,updateUserAvatar,updateUserCoverImage};














// const registerUser = asyncHandler( async(req,res)=>{
// //    return console.log(" this is our registerUser method")
//      res.status(200).json({message: "Ok registered!!"})
// })//ab asyncHandler ek higher order function hai jo ki method leta hai as an argument

// export {registerUser};
