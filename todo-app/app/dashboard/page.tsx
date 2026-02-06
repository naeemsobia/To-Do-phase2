'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Flag, CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import Chatbot from '../components/Chatbot';

// Define types
type Priority = 'low' | 'medium' | 'high';
type Status = 'todo' | 'in-progress' | 'done';

interface Todo {
  id: number;
  task: string;
  due_date?: string;
  status: Status;
  priority: Priority;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [loading, setLoading] = useState(true);

  // Load todos from backend on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/todos/');
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match our interface
        const transformedTodos = data.map((todo: any) => ({
          id: todo.id,
          task: todo.task,
          due_date: todo.due_date,
          status: todo.status.toLowerCase() as Status,
          priority: priorityFromStatus(todo.status),
          description: todo.task, // Using task as description for now
          createdAt: new Date().toISOString()
        }));
        setTodos(transformedTodos);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine priority from status
  const priorityFromStatus = (status: string): Priority => {
    if (status.toLowerCase().includes('high')) return 'high';
    if (status.toLowerCase().includes('medium')) return 'medium';
    return 'low';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (editingId !== null) {
        // Update existing todo
        const response = await fetch(`http://localhost:8000/todos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task: title,
            due_date: dueDate || '',
            status: 'Pending', // Backend uses "Pending", "In Progress", "Completed"
            priority: priority
          }),
        });

        if (response.ok) {
          const updatedTodo = await response.json();
          setTodos(todos.map(todo =>
            todo.id === editingId
              ? {
                  ...todo,
                  task: updatedTodo.task,
                  due_date: updatedTodo.due_date,
                  priority: priorityFromStatus(updatedTodo.status)
                }
              : todo
          ));
          setEditingId(null);
        }
      } else {
        // Add new todo
        const response = await fetch('http://localhost:8000/todos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task: title,
            due_date: dueDate || '',
            status: 'Pending',
            priority: priority
          }),
        });

        if (response.ok) {
          const newTodo = await response.json();
          const transformedTodo: Todo = {
            id: newTodo.id,
            task: newTodo.task,
            due_date: newTodo.due_date,
            status: 'todo',
            priority: priority,
            description: title,
            createdAt: new Date().toISOString()
          };
          setTodos([...todos, transformedTodo]);
        }
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setTitle(todo.task);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.due_date || '');
    setEditingId(todo.id);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: Status) => {
    try {
      // Find the todo to get its current data
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      // Map our status to backend status
      let backendStatus = '';
      switch (newStatus) {
        case 'todo':
          backendStatus = 'Pending';
          break;
        case 'in-progress':
          backendStatus = 'In Progress';
          break;
        case 'done':
          backendStatus = 'Completed';
          break;
        default:
          backendStatus = 'Pending';
      }

      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: todo.task,
          due_date: todo.due_date || '',
          status: backendStatus,
          priority: todo.priority
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        ));
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(todo => todo.status === filter);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'todo': return 'bg-gray-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'done': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            MY TO-DO APP Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column - Form and Stats */}
        <div className="lg:w-1/3">
          {/* Add Todo Form */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId !== null ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task title"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium flex items-center justify-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingId !== null ? 'Update Task' : 'Add Task'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle('');
                    setDescription('');
                    setPriority('medium');
                    setDueDate('');
                  }}
                  className="w-full mt-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Stats Summary */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {loading ? '...' : todos.length}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {loading ? '...' : todos.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">
                  {loading ? '...' : todos.filter(t => t.status === 'done').length}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Todo List and Chatbot */}
        <div className="lg:w-2/3 flex flex-col lg:flex-row gap-8">
          {/* Todo List */}
          <div className="lg:w-1/2">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Tasks</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('todo')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filter === 'todo'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    To Do
                  </button>
                  <button
                    onClick={() => setFilter('in-progress')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filter === 'in-progress'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilter('done')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filter === 'done'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Loading tasks...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No tasks found. Add a new task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <button
                              onClick={() => handleStatusChange(
                                todo.id,
                                todo.status === 'done' ? 'todo' : 'done'
                              )}
                              className="mr-3 flex-shrink-0"
                            >
                              {todo.status === 'done' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                            <h3 className={`font-medium truncate ${
                              todo.status === 'done' ? 'line-through text-gray-500' : ''
                            }`}>
                              {todo.task}
                            </h3>
                          </div>

                          {todo.description && (
                            <p className="text-sm text-gray-400 ml-8 mb-2">
                              {todo.description}
                            </p>
                          )}

                          <div className="flex items-center ml-8 space-x-4 text-xs">
                            <span className={`flex items-center ${getPriorityColor(todo.priority)}`}>
                              <Flag className="h-3 w-3 mr-1" />
                              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            </span>

                            {todo.due_date && (
                              <span className="flex items-center text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(todo.due_date).toLocaleDateString()}
                              </span>
                            )}

                            <span className={`px-2 py-1 rounded-full text-xs ${
                              getStatusColor(todo.status)
                            }`}>
                              {getStatusText(todo.status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(todo)}
                            className="p-2 text-gray-400 hover:text-blue-400 rounded-md hover:bg-gray-600/50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-2 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-600/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chatbot */}
          <div className="lg:w-1/2">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">To-Do Assistant</h2>
              <div className="flex-1">
                <Chatbot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}