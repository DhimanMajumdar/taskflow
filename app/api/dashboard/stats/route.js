import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Get all tasks visible to the user (RLS handles filtering)
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, status, due_date');

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return NextResponse.json({ error: tasksError.message }, { status: 500 });
    }

    const now = new Date();
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
    const overdueTasks = tasks?.filter(t => 
      t.due_date && new Date(t.due_date) < now && t.status !== 'done'
    ).length || 0;
    const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length || 0;

    // Get project count
    const { count: projectCount, error: projectError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (projectError) {
      console.error('Error fetching project count:', projectError);
    }

    return NextResponse.json({
      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
        inProgressTasks,
        projectCount: projectCount || 0,
      },
      role: profile?.role,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
