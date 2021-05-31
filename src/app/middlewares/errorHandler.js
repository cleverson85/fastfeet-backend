export default async (error, req, res, next) => {
  if (error && error.statusCode) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
  } else {
    console.log(error);
  }

  next();
};
