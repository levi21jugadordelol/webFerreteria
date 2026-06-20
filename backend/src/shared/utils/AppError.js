class AppError extends Error {
  constructor(message, statusCode = 500, extra = {}) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // 🔥 metadata adicional
    Object.assign(this, extra);

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
