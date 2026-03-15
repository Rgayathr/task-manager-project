// Task routes - all routes are protected (require authentication)
const router = require('express').Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const { taskValidation } = require('../utils/validation');

// Apply auth middleware to ALL task routes
// This ensures only logged-in users can access any task endpoint
router.use(protect);

// GET /api/tasks - List tasks with pagination/search/filter
// POST /api/tasks - Create new task
router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

// GET /api/tasks/:id - Get single task
// PUT /api/tasks/:id - Update task
// DELETE /api/tasks/:id - Delete task
router.route('/:id')
  .get(getTask)
  .put(taskValidation, updateTask)
  .delete(deleteTask);

module.exports = router;
