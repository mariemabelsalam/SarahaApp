export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        stack: error.stack,
        info: "server error",
        error,
      });
    }
  };
};
export const successResponse = ({
  res,
  data = {},
  status = 200,
  message = "done",
} = {}) => {
  return res.status(status).json({ message, data });
};

export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 500).json({
    message: error.message,
    stack: error.stack,
    info: error.info,
    error,
  });
};
