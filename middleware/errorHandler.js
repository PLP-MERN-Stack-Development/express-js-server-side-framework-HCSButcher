const { AppError } = require("../utils/errors");

function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { errorHandler };
