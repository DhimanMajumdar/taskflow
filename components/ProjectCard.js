'use client';

import { Trash2, Users, UserPlus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ManageMembersModal from './ManageMembersModal';

export default function ProjectCard({ project, isAdmin, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      toast.success('Project deleted successfully');
      onDelete(project.id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
            )}
          </div>
          
          {isAdmin && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setShowMembersModal(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Manage members"
              >
                <UserPlus className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-700">{project.project_members?.[0]?.count || 0} members</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-700">{project.tasks?.[0]?.count || 0} tasks</span>
          </div>
        </div>

        {project.created_by_profile && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {project.created_by_profile.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>Created by {project.created_by_profile.email}</span>
            </div>
          </div>
        )}

        <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <ManageMembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        project={project}
      />
    </>
  );
}
