'use client';

import { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, User, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    due_date: '',
    status: 'todo',
  });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const { projects } = await res.json();
        setProjects(projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const { users } = await res.json();
        setUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      };

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create task');
      }

      const { task } = await res.json();
      toast.success('Task created successfully! ✅');
      onTaskCreated(task);
      setFormData({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        due_date: '',
        status: 'todo',
      });
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-600 mt-1">Add a new task to your project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Design homepage mockup"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Project */}
              <div>
                <label htmlFor="project_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Project *
                  </div>
                </label>
                <select
                  id="project_id"
                  required
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign To */}
              <div>
                <label htmlFor="assigned_to" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assign To
                  </div>
                </label>
                <select
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </div>
                </label>
                <input
                  type="date"
                  id="due_date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Status
                  </div>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
