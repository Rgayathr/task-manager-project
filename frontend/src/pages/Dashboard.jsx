// Dashboard Page - Main task management view
// Features: Task list, create/edit/delete, search, filter by status, pagination
import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API with current filters and pagination
  const fetchTasks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const { data } = await API.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Fetch tasks when filters change
  useEffect(() => {
    const debounce = setTimeout(() => fetchTasks(1), 300);
    return () => clearTimeout(debounce);
  }, [fetchTasks]);

  // Create a new task
  const handleCreate = async (taskData) => {
    await API.post('/tasks', taskData);
    fetchTasks(1);
  };

  // Update an existing task
  const handleUpdate = async (taskData) => {
    await API.put(`/tasks/${editingTask._id}`, taskData);
    setEditingTask(null);
    fetchTasks(pagination.page);
  };

  // Delete a task with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    await API.delete(`/tasks/${id}`);
    fetchTasks(pagination.page);
  };

  // Open edit form for a task
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header with create button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">{pagination.total} total tasks</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Search and Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title..."
          className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        {/* Status filter dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-600 text-sm mt-1">Create your first task to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => fetchTasks(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchTasks(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Task create/edit modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
