import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  assigned_to: z.string().uuid('Invalid user ID').nullable().optional(),
  project_id: z.string().uuid('Invalid project ID'),
  due_date: z.string().datetime().nullable().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
});

export const projectMemberSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  user_id: z.string().uuid('Invalid user ID'),
});

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
