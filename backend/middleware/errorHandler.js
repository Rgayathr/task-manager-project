// Global error handling middleware
// Catches all unhandled errors and returns structured JSON response
// Must be registered after all routes in Express

const errorHandler = (err, req, res, next) => {
  // Log error stack trace for debugging (only in development)
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }

  // Handle Mongoose duplicate key errors (e.g., duplicate email)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value - this record already exists'
    });
  }

  // Handle invalid MongoDB ObjectId format
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Default: Internal Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
