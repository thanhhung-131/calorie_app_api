// services/errorService.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleSequelizeValidationError = (err) => {
  const message = err.errors.map(el => el.message).join('. ');
  return new AppError(message, 400);
};

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict error') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  handleSequelizeValidationError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
};
