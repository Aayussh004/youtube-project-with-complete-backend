class ApiError extends Error{//error ko dene ki utility hai
    constructor(statusCode, message="Something went wrong!!",  errors=[], stack=""){
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.errors = errors
        this.data = null
        this.success = false
        
        if(stack){//ye ek stack of error hota hai not so much important
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)//This is a method provided by Node.js's Error object
        }
    }
}

export {ApiError}

// now goto ApiResponse.js