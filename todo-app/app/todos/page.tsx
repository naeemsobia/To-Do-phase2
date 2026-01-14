"use client";
import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';

interface Task {
  id: number;
  task: string;
  due_date: string;
  status: string;
}

export default function TodosPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchTasks = () => {
    fetch('http://localhost:8000/todos/')
      .then(response => response.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const todo: Omit<Task, 'id'> = { task, due_date: dueDate, status };
    if (editing) {
      await fetch(`http://localhost:8000/todos/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      setEditing(false);
      setCurrentId(null);
    } else {
      await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
    }
    setTask('');
    setDueDate('');
    setStatus('Pending');
    fetchTasks();
  };

  const handleEdit = (todo: Task) => {
    setEditing(true);
    setCurrentId(todo.id);
    setTask(todo.task);
    setDueDate(todo.due_date);
    setStatus(todo.status);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTasks();
  };

  const handleMarkAsComplete = async (id: number) => {
    const todo = tasks.find((t: Task) => t.id === id);
    if (todo) {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, status: 'Completed' }),
      });
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">My To-Do List</h1>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Update Task' : 'Add a New Task'}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Task"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition duration-300">
                {editing ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {tasks.map((task: Task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkAsComplete={handleMarkAsComplete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

