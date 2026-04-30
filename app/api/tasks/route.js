import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { taskSchema } from '@/lib/validations';

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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(id, email),
        project:projects(id, name),
        created_by_profile:profiles!tasks_created_by_fkey(email)
      `)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(id, email),
        project:projects(id, name)
      `)
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
