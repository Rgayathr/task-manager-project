// Task Card Component
// Displays a single task with title, description, status badge, and action buttons
// Supports edit and delete operations

const statusColors = {
  'pending': 'bg-yellow-500/20 text-yellow-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  'completed': 'bg-green-500/20 text-green-400',
};

const statusLabels = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all">
      {/* Header: Title + Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-semibold text-lg leading-tight">{task.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{task.description}</p>
      )}

      {/* Footer: Date + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <span className="text-gray-500 text-xs">
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
