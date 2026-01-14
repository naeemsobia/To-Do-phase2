"use client";

interface Task {
  id: number;
  task: string;
  due_date: string;
  status: string;
}

const TaskItem = ({ task, onEdit, onDelete, onMarkAsComplete }: { task: Task, onEdit: (task: Task) => void, onDelete: (id: number) => void, onMarkAsComplete: (id: number) => void }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg flex items-center justify-between ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-4 ${getStatusClass(task.status)}`}></div>
        <div>
          <p className={`font-bold ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.task}</p>
          <p className="text-sm text-gray-400">{task.due_date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {task.status !== 'Completed' && (
          <button onClick={() => onMarkAsComplete(task.id)} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-semibold">Complete</button>
        )}
        <button onClick={() => onEdit(task)} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-semibold">Edit</button>
        <button onClick={() => onDelete(task.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-semibold">Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;
