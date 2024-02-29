import mongoose from "mongoose";


import jwt from "jsonwebtoken"
// JWTs are widely used for authentication and authorization in web applications. Instead of repeatedly sending usernames and passwords with each request, users receive a JWT upon logging in, which they can then present with subsequent requests. Servers can quickly validate the JWT by checking its signature and reading the information in the payload to determine the user's identity and permissions.

import bcrypt from "bcrypt"
// In Mongoose, bcrypt is often used for hashing and salting passwords before storing them in the database. Here's how bcrypt is typically integrated into a Mongoose schema to hash passwords

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,// cloudinary url kyuki wo image store krke provide kra dega
        required:true,
    },
    coverimage:{
        type:String,// cloudinary url kyuki wo image store krke provide kra dega
    },
    watchHisttory:[
        {//video id provide kra do
            type:mongoose.Schema.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    refreshToken:{
        type:String//long string hai aur kuch nhi
    }

},{timestamps:true})

//now install jwt token and bcrypt "npm i jsonwebtoken bcrypt"
//import jwt and bcrypt

//now ab password encrypt krne ke liye pre hook use krenge its a middleware 
//password save hone se phle mujhe kuch fun. krwana hai means encrypt krwana hai

// Middleware (hooks)

// Encrypting password at first signup
userSchema.pre("save", async function(next){//ab middleware hai to next bhi aayega aur arrow fun. ko avoid krenge kyuki "this" keyword available nhi hota usme, "save" first argument hai kyuki pwd save krne se phle middlware lgana hai
    
    if(!this.isModified("password")) return next();//if password modified hua hi nhi hai to return krdo

    this.password = bcrypt.hash(this.password, 10)//password ko encrypt krdo bcrypt se 10 means 10 times salting hui h (kuch bda hua h!!)
    next();//next middleware me pass krdo
})

//ab password check krna hai shi hai ki nhi, dobara login krne pe
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);//user ka entered pswd mere db ke pswd se match hora ya nhi and ye return true ya false krega
}

//ab jwt use krne ke liye .env file me secret token add kro, kuch bhi likh skte ho apne man ka(type of a secret key jo sirf admin ko pta ho)

//JWT tokens configurations
userSchema.methods.generateAccessToken= function(){
    jwt.sign({
        _id: this._id, //_id mongodb ki id hai
        email:this.email,
        username:this.username,
        fullName:this.fullName
    
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })//ye jwt token generate krega,
}
userSchema.methods.generateRefreshToken= function(){
    jwt.sign({//payload 
        _id: this._id, //_id mongodb ki id hai
        email:this.email,
        username:this.username,
        fullName:this.fullName
    }, process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model("User",userSchema);


//jwt (jsonwebtokens)
//  Imagine JWTs like special stamps you get after logging into a website. These stamps prove you're allowed to access certain parts of the site without needing to enter your username and password over and over again.

// -> Getting the Stamp: When you log in, the website gives you a stamp (JWT) that says who you are and what you're allowed to do.

// -> Using the Stamp: Instead of telling the website your username and password every time you want to do something, you just show your stamp (JWT). The website checks the stamp to make sure it's real and sees what you're allowed to do.

// -> Quick Checks: Because the stamp contains all the important information, like your name and permissions, the website can quickly check it and decide if you're allowed to do what you're asking.

//jwt is a "bearer token" means jiske paas token h wo allowed h

//now we will see how to upload files 
//2 types hote hai ek express-fileupload se aur dusra multer se, hum multer use krenge
//now go to cloudinary a great plateform to use our uploaded image in websites, free hai
//now do "npm i cloudinary"
// "npm i multer"

//now go to "./util/cloudinary" 