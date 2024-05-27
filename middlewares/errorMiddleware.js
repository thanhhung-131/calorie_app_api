// middlewares/errorMiddleware.js
const { ValidationError, UnauthorizedError, NotFoundError, ConflictError } = require('../services/errorService');

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorMiddleware;
