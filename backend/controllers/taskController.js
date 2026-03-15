// Task Controller
// Handles CRUD operations with pagination, search, and filtering
// All operations are scoped to the authenticated user (authorization)
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for authenticated user with pagination, search & filter
// @route   GET /api/tasks?page=1&limit=10&status=pending&search=keyword
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, search } = req.query;

    // Build query - always filter by authenticated user (authorization)
    // This ensures users can ONLY access their own tasks
    const query = { user: req.user._id };

    // Optional: Filter by task status
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      query.status = status;
    }

    // Optional: Search by title using case-insensitive regex
    // Note: For production, consider MongoDB text indexes for better performance
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    // skip: how many documents to skip (for pagination)
    // limit: max documents to return per page
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })  // Newest tasks first
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination metadata
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    // Find task by ID AND user - ensures user owns the task
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission'
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { title, description, status } = req.body;

    // Create task with authenticated user's ID
    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      status: status || 'pending'
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    // Find task owned by the authenticated user
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission'
      });
    }

    // Update only the fields that were sent in the request body
    const { title, description, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    // Save triggers Mongoose validation
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    // Find and delete task only if it belongs to the authenticated user
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
