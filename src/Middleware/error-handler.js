export const errorHandler = (api) => (req, res, next) => {
  api(req, res, next).catch(
    (error) => {
      console.log(`💥 Oops! Something went wrong in: ${req.url}`, error);
      res.status(500).json({ message: "💥 Oops! Something went wrong!", error: error.message });
      return next();
    }
  );
};

export const globalErrorHandler = (error) => {
  console.log("💥 Global Error Handler:", error.message);
  return ({ message: "💥 Internal Server Error", error: error.message });
};