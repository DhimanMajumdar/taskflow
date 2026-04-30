'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Users as UsersIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageMembersModal({ isOpen, onClose, project }) {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    if (isOpen && project) {
      fetchUsers();
      fetchMembers();
    }
  }, [isOpen, project]);

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

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/project-members?project_id=${project.id}`);
      if (res.ok) {
        const { members } = await res.json();
        setMembers(members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/project-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          user_id: selectedUser,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add member');
      }

      toast.success('Member added successfully');
      setSelectedUser('');
      fetchMembers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the project?')) {
      return;
    }

    try {
      const res = await fetch(`/api/project-members?id=${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove member');
      }

      toast.success('Member removed successfully');
      fetchMembers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  const availableUsers = users.filter(
    (user) => !members.some((member) => member.user_id === user.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Manage Members</h2>
              <p className="text-sm text-gray-600 mt-1">{project?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Add Member Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add Team Member
            </label>
            <div className="flex gap-2">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select a user</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} • {user.role}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddMember}
                disabled={loading || !selectedUser}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all font-semibold flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Team Members ({members.length})
              </h3>
            </div>
            
            {members.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No members yet</p>
                <p className="text-sm text-gray-600">
                  Add team members to collaborate on this project
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.user?.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {member.user?.email}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {member.user?.role}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          {members.length > 0 && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Team Collaboration</p>
                  <p className="text-sm text-gray-600">
                    Members can view and update tasks in this project
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
