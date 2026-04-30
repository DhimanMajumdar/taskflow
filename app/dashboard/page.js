'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import ProjectCard from '@/components/ProjectCard';
import TaskTable from '@/components/TaskTable';
import CreateProjectModal from '@/components/CreateProjectModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const supabase = createClient();
    
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.log('Not authenticated, redirecting to login');
          router.push('/login');
          return;
        }

        setUser(user);

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          toast.error('Failed to load profile');
          setLoading(false);
          return;
        }

        setProfile(profileData);
        setLoading(false);
        
        // Load data
        fetchData(supabase);
      } catch (err) {
        console.error('Auth check error:', err);
        setLoading(false);
        router.push('/login');
      }
    }

    checkAuth();
  }, [mounted, router]);

  const fetchData = async (supabase) => {
    try {
      await Promise.all([
        fetchStats(supabase),
        fetchProjects(supabase),
        fetchTasks(supabase)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchStats = async (supabase) => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProjects = async (supabase) => {
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

  const fetchTasks = async (supabase) => {
    try {
      let url = '/api/tasks';
      const params = new URLSearchParams();
      if (filterProject) params.append('project_id', filterProject);
      if (filterStatus) params.append('status', filterStatus);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const { tasks } = await res.json();
        setTasks(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (mounted && user) {
      const supabase = createClient();
      fetchTasks(supabase);
    }
  }, [filterProject, filterStatus, mounted, user]);

  const handleProjectCreated = (project) => {
    setProjects([project, ...projects]);
    const supabase = createClient();
    fetchStats(supabase);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    const supabase = createClient();
    fetchStats(supabase);
    fetchTasks(supabase);
  };

  const handleTaskCreated = (task) => {
    setTasks([task, ...tasks]);
    const supabase = createClient();
    fetchStats(supabase);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    const supabase = createClient();
    fetchStats(supabase);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    const supabase = createClient();
    fetchStats(supabase);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={stats?.totalTasks || 0}
            icon={Clock}
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={stats?.completedTasks || 0}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="Overdue"
            value={stats?.overdueTasks || 0}
            icon={AlertCircle}
            color="red"
          />
          <StatsCard
            title="Projects"
            value={stats?.projectCount || 0}
            icon={FolderKanban}
            color="purple"
          />
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <p className="text-gray-600 text-sm mt-1">Manage your team projects</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                New Project
              </button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                {isAdmin ? 'Create your first project to get started!' : 'You haven\'t been assigned to any projects yet.'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isAdmin={isAdmin}
                  onDelete={handleProjectDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              <p className="text-gray-600 text-sm mt-1">Track and manage your tasks</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  New Task
                </button>
              )}
            </div>
          </div>

          <TaskTable
            tasks={tasks}
            isAdmin={isAdmin}
            onTaskUpdate={handleTaskUpdated}
            onTaskDelete={handleTaskDeleted}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
