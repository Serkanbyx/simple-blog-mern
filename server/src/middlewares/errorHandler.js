const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Mongoose ValidationError — field-specific messages
  if (err.name === 'ValidationError') {
    const fields = Object.entries(err.errors).reduce((acc, [field, error]) => {
      acc[field] = error.message;
      return acc;
    }, {});

    return res.status(400).json({ message: 'Validation failed.', fields });
  }

  // Mongoose CastError — invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // Mongoose duplicate key (unique constraint)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern)[0];
    return res
      .status(409)
      .json({ message: `${duplicateField} already exists.` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired.' });
  }

  // Multer errors (file upload)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large.' });
    }
    return res.status(400).json({ message: err.message });
  }

  // Custom multer file-type rejection (from fileFilter)
  if (err.message && err.message.includes('Only')) {
    return res.status(400).json({ message: err.message });
  }

  // Default — 500 Internal Server Error
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error('[ERROR]', err.message, err.stack);
  }

  const response = {
    message: statusCode === 500 ? 'Internal server error.' : err.message,
  };

  if (isDev) {
    response.stack = err.stack;
    response.error = err.message;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
