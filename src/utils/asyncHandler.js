
//2nd way (promise wala)
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}

//error ki bhi hum utility bna skte hai means generalized format bna lete hai we will make "ApiError.js" file for that
// ab error ke baad response ki bhi utility bna lo jo express se chlta hai jbki error core nodejs ki functionality hai 


export {asyncHandler}


// 1st way to write asyncHandler (trycatch wala)



// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


//ye ek higher order function accept krta hai means func as an argument and return a function also
// const asyncHandler = (fn) => async (req,res,next) => {
// try {
//     await fn(req,res, next);
// } catch (error) {
//     res.status(error.code || 500).json({
//         success:false,
//         message: error.message
//     })
// }
// } 

// now go to apiError