import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { taskUpdateSchema } from '@/lib/validations';

export async function PATCH(request, { params }) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = taskUpdateSchema.parse(body);

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Get the task to check assignment
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('assigned_to, status')
      .eq('id', id)
      .single();

    // Members can only update status of their assigned tasks
    if (profile?.role !== 'admin') {
      if (existingTask?.assigned_to !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden: You can only update tasks assigned to you' },
          { status: 403 }
        );
      }
      
      // Members can only update status
      if (Object.keys(validatedData).length !== 1 || !validatedData.hasOwnProperty('status')) {
        return NextResponse.json(
          { error: 'Forbidden: Members can only update task status' },
          { status: 403 }
        );
      }
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(id, email),
        project:projects(id, name)
      `)
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
