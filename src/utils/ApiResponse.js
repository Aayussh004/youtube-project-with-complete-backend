class ApiResponse{
    constructor(message,statusCode,data){
        this.message = message
        this.statusCode = statusCode
        this.data = null
        this.success = statusCode<400;
        // If the statusCode is less than 400, it means the request was successful (since HTTP status codes in the range of 200 to 399 typically indicate success). So, this.success is set to true.
        // If the statusCode is 400 or higher, it implies an error, so this.success is set to false.
    }
}

export {ApiResponse}


// Types of Status Code

// 1xx Informational=>
// Range: 100-199
// Brief: Informational responses indicating that the request was received and understood.

// 2xx Success
// Range: 200-299
// Brief: Successful responses indicating that the request was received, understood, and accepted.

// 3xx Redirection
// Range: 300-399
// Brief: Responses indicating that further action needs to be taken to complete the request.

// 4xx Client Error
// Range: 400-499
// Brief: Responses indicating that the client has made an error in the request.

// 5xx Server Error
// Range: 500-599
// Brief: Responses indicating that the server failed to fulfill a valid request due to an error on the server side.


// These are the five main categories of HTTP status codes, each representing a different type of response from the server.

//now goto "models folder" and make user and video model