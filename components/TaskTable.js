'use client';

import { useState } from 'react';
import { Trash2, Calendar, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EditTaskModal from './EditTaskModal';

export default function TaskTable({ tasks, isAdmin, onTaskUpdate, onTaskDelete }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update task');
      }

      const { task } = await res.json();
      toast.success('Task updated successfully');
      onTaskUpdate(task);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      toast.success('Task deleted successfully');
      onTaskDelete(taskId);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No tasks found
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.project?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {task.assigned_to_profile?.email || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      disabled={updatingId === task.id}
                      className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(task.status)} border-0 cursor-pointer disabled:opacity-50`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-sm ${
                      isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : 'text-gray-900'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.due_date)}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onTaskUpdated={(updatedTask) => {
          onTaskUpdate(updatedTask);
          setEditingTask(null);
        }}
      />
    </>
  );
}
