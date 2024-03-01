//controller ke andar hum methods likh rhe hai jo bhi execute krani hai
//suppose ek user ko register krana hai to hum register method me uska success code likh kr return krwa denge user ko

import { asyncHandler } from "../utils/asyncHandler.js";//{} ye as a object isiliye import kiye hai kyuki asyncHandler file me wo isi prakar exported tha

const registerUser = asyncHandler( async(req,res)=>{
//    return console.log(" this is our registerUser method")
     res.status(200).json({message: "Ok registered!!"})
})//ab asyncHandler ek higher order function hai jo ki method leta hai as an argument

export {registerUser};