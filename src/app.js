// import express from "express"
// import cors from "cors"
// import cookieParser from "cookie-parser";

// const app = express();

// // middleware are something which checks the request before requesting to the server 

// // now ab data alag alg jagah se aayega to uske liye safety feature bhi chahiye
// // uske liye middleware use krte hai app.use se jaise ki cors(cross origin resource sharing)

// app.use(cors({//yha pe aap apna origin dedo env se ye frontend ka url contain krega jaise ki vercel ki link
//     origin:process.env.CORS_ORIGIN,
//     credentials:true
// }))//middleware hai ye

// //ab data url, json, images, files se bhi aayega

// app.use(express.json({limit:"16kb"}))//for accepting json formats in our server upto 16kb size

// app.use(express.urlencoded({extended:true,limit:"16kb"}))//for accepting url data 
// //jaise space ko %20 interpret kiya jayega, extended means object ke andar bhi object accept krlunga

// app.use(express.static("public"))//for accepting files, folders, images, favicos
// //isi ke liye humne public folder banaya tha aur usme ye data store krenge

// app.use(cookieParser())//for accessing cookie of browser by our server only


// //routes import 

// import userRouter from "./routes/user.routes.js"//isme hum apne man ka naam use kr skte hai kyuki return type default hai user.routes.js file me


// //routes declaration

// // app.get() iski jagah hum app.use use krenge kyuki ye ab as a middleware use ho rha hai

// app.use("/api/v1/users",userRouter)//ab aage ka url aap user.routes.js se lelo, ye as a prefix url use hoga
// // http://localhost:8000/api/v1/users
// //now goto 

// export {app}

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)
export { app }