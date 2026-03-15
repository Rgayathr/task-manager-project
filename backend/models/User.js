// User model - stores user credentials with hashed passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // User's full name - required, trimmed of whitespace
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  // User's email - must be unique, stored in lowercase
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  // User's password - minimum 6 characters, excluded from queries by default
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Don't return password in queries by default
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook: Hash password before saving to database
// Only runs when password field is modified (not on every save)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Generate salt with 10 rounds and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Compare entered plaintext password with stored hash
// Used during login to verify credentials
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
