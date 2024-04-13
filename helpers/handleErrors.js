function handleErrors(error, req, res, next) {
  if(error.name === 'UnauthorizedError') {
    //authorization error
    return res.status(401).json({message: "unauthorized user"})
  }
  //validation error
  if(error.name === 'ValidationError') {
    return res.status(401).json({message: error})
  }
  //server error
  return res.status(500).json({message: error});
}

module.exports = handleErrors;