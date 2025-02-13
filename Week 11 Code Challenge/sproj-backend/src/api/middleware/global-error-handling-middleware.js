const globalErrorHandlingMiddleware = (error, req, res, next) => {

    console.log(error);

    if (error.name === "NotFoundError") {
      return res
        .status(404)
        .json({
          message: error.message,
        })
        .send();

    } else {
        
      return res
        .status(500)
        .json({
          message: error.message,
        })
        .send();
    }
  };
  
  export default globalErrorHandlingMiddleware;