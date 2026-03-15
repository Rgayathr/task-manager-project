// JWT Authentication Middleware
// Extracts JWT from HTTP-only cookie and verifies it
// Attaches authenticated user object to request for downstream use
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Step 1: Extract token from HTTP-only cookie (not from header/localStorage)
    // This is more secure than localStorage as it prevents XSS token theft
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token provided'
      });
    }

    // Step 2: Verify token signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Fetch user from DB and attach to request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - user not found'
      });
    }

    // User authenticated successfully - proceed to next middleware/route
    next();
  } catch (error) {
    // Token expired or tampered with
    res.status(401).json({
      success: false,
      message: 'Not authorized - token invalid or expired'
    });
  }
};

module.exports = protect;
