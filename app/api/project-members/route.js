import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectMemberSchema } from '@/lib/validations';

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

    let query = supabase
      .from('project_members')
      .select(`
        *,
        user:profiles!project_members_user_id_fkey(id, email, role),
        project:projects(id, name)
      `)
      .order('added_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: members, error } = await query;

    if (error) {
      console.error('Error fetching project members:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ members });
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
    const validatedData = projectMemberSchema.parse(body);

    const { data: member, error } = await supabase
      .from('project_members')
      .insert(validatedData)
      .select(`
        *,
        user:profiles!project_members_user_id_fkey(id, email, role),
        project:projects(id, name)
      `)
      .single();

    if (error) {
      console.error('Error adding project member:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Error removing project member:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
