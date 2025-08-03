class APIError extends Error{
constrcutor(
statusCode,
message="Something went wrong",
errors = [],
statck = ""
){
  super(message)
  this.statuscode = statusCode
  this.data = null,
  this.message = message 
  this.success = false
  this.errors = errors


  if(statck){
    this.stack = statck
  }else{
    Error.captureStackTrace(this,this.constrcutor)
  }
}
}

export {APIError}