# TaskFlow - Team Task Manager

A **free, open-source** full-stack task management application built with Next.js 16 (App Router) and Supabase, featuring role-based access control, real-time updates, and a beautiful modern SaaS-style UI.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

---

## 🎉 Completely Free

- ✅ **100% Free Forever** - No hidden costs
- ✅ **No Credit Card Required** - Start immediately
- ✅ **Open Source** - Self-host anywhere
- ✅ **Unlimited Everything** - Projects, tasks, and team members

---

## ✨ Features

### 🔐 **Authentication**
- Email/password authentication via Supabase Auth
- Persistent sessions with SSR support
- Automatic profile creation on signup
- Secure session management

### 👥 **Role-Based Access Control**
**Admin:**
- Create and delete projects
- Add/remove team members
- Create, edit, and delete tasks
- Assign tasks to team members
- Full access to all data

**Member:**
- View assigned projects and tasks
- Update task status only
- Read-only access to project information

### 📊 **Dashboard**
- Real-time statistics (total tasks, completed, overdue, projects)
- Beautiful gradient cards with hover animations
- Project management with member tracking
- Task management with filtering
- Overdue task highlighting
- Responsive design (mobile-first)

### 🎨 **Modern UI/UX**
- Stunning SaaS-style landing page
- Glassmorphism effects
- Smooth animations and transitions
- Gradient backgrounds and buttons
- Professional color scheme (Blue → Purple)
- Fully responsive on all devices

### 🔒 **Security**
- Row Level Security (RLS) enforced at database level
- Server-side authentication checks
- Input validation using Zod
- Protected API routes
- Secure session management

---

## 🚀 Why Vercel for Deployment?

I chose **Vercel** as the deployment platform for several compelling reasons:

### **🎯 Perfect for Next.js**
- **Built by the Next.js Team** - Vercel created Next.js, ensuring perfect compatibility
- **Zero Configuration** - Automatically detects and optimizes Next.js apps
- **Instant Deployments** - Deploy in seconds with automatic builds
- **Edge Network** - Global CDN for lightning-fast performance worldwide

### **⚡ Performance & Speed**
- **Edge Functions** - Run code closer to users for minimal latency
- **Automatic Optimization** - Image optimization, code splitting, and caching built-in
- **99.99% Uptime** - Enterprise-grade reliability
- **Instant Cache Invalidation** - Updates propagate globally in seconds

### **💰 Generous Free Tier**
- **100GB Bandwidth/month** - More than enough for most projects
- **Unlimited Deployments** - Deploy as many times as you want
- **Automatic HTTPS** - SSL certificates included
- **Custom Domains** - Free custom domain support

### **🔄 Developer Experience**
- **Git Integration** - Auto-deploy on push to GitHub
- **Preview Deployments** - Every PR gets its own URL
- **Instant Rollbacks** - One-click rollback to previous versions
- **Real-time Logs** - Monitor your app in real-time

### **📊 Built-in Analytics**
- **Web Vitals** - Track Core Web Vitals automatically
- **Performance Insights** - Identify bottlenecks
- **Usage Metrics** - Monitor traffic and bandwidth
- **Error Tracking** - Catch issues before users do

### **🌍 Global Scale**
- **Edge Network** - 100+ locations worldwide
- **Automatic Scaling** - Handles traffic spikes automatically
- **DDoS Protection** - Built-in security
- **99.99% SLA** - Enterprise reliability on free tier

### **🎁 Additional Benefits**
- **Serverless Functions** - API routes run on-demand
- **Environment Variables** - Secure secret management
- **Team Collaboration** - Easy team management
- **Preview Comments** - Collaborate on deployments

**Bottom Line:** Vercel offers the best developer experience, performance, and reliability for Next.js applications - all with a generous free tier that's perfect for this project!

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + Auth)
- **Validation:** Zod
- **UI Components:** Lucide React icons, React Hot Toast
- **Database:** PostgreSQL with Row Level Security
- **Deployment:** Vercel (Recommended)

---

## 📦 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Vercel account ([vercel.com](https://vercel.com))

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Supabase**

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and create a new query
3. Copy the entire SQL schema from the setup section below
4. Execute the SQL to create all tables and policies

**Complete SQL Schema:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Create project_members table
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = 'admin' FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (is_admin());

-- RLS Policies for projects
CREATE POLICY "projects_select_admin" ON projects FOR SELECT USING (is_admin());
CREATE POLICY "projects_select_member" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM project_members WHERE project_members.project_id = projects.id AND project_members.user_id = auth.uid())
);
CREATE POLICY "projects_insert_admin" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "projects_update_admin" ON projects FOR UPDATE USING (is_admin());
CREATE POLICY "projects_delete_admin" ON projects FOR DELETE USING (is_admin());

-- RLS Policies for project_members
CREATE POLICY "project_members_select_admin" ON project_members FOR SELECT USING (is_admin());
CREATE POLICY "project_members_select_member" ON project_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "project_members_insert_admin" ON project_members FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "project_members_delete_admin" ON project_members FOR DELETE USING (is_admin());

-- RLS Policies for tasks
CREATE POLICY "tasks_select_admin" ON tasks FOR SELECT USING (is_admin());
CREATE POLICY "tasks_select_member" ON tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM project_members WHERE project_members.project_id = tasks.project_id AND project_members.user_id = auth.uid())
);
CREATE POLICY "tasks_insert_admin" ON tasks FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "tasks_update_admin" ON tasks FOR UPDATE USING (is_admin());
CREATE POLICY "tasks_update_member_status" ON tasks FOR UPDATE USING (
  assigned_to = auth.uid() AND EXISTS (SELECT 1 FROM project_members WHERE project_members.project_id = tasks.project_id AND project_members.user_id = auth.uid())
) WITH CHECK (assigned_to = auth.uid() AND status IN ('todo', 'in-progress', 'done'));
CREATE POLICY "tasks_delete_admin" ON tasks FOR DELETE USING (is_admin());
```

### **4. Configure Environment Variables**

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these values from: Supabase Dashboard → Settings → API

### **5. Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### **6. Create Admin User**

1. Sign up at http://localhost:3000/signup
2. Run this SQL in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```
3. Sign out and sign back in

---

## 🚀 Deploy to Vercel

### **Quick Deploy (5 minutes)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - In Vercel project settings
   - Add all 4 environment variables from `.env.local`
   - Click "Deploy"

4. **Update Supabase Auth URLs**
   - Copy your Vercel URL
   - Go to Supabase → Authentication → URL Configuration
   - Set Site URL: `https://your-app.vercel.app`
   - Add Redirect URL: `https://your-app.vercel.app/**`

5. **Done!** Your app is live! 🎉

---

## 📖 Usage

### **As Admin:**
- Create and manage projects
- Add team members to projects
- Create and assign tasks
- Edit all task details
- Delete projects and tasks
- View all data

### **As Member:**
- View assigned projects
- View tasks in assigned projects
- Update task status (To Do → In Progress → Done)
- Cannot create/delete projects or tasks

---

## 🎨 UI Features

- **Landing Page:** Modern SaaS-style with gradient backgrounds
- **Authentication:** Beautiful login/signup pages with animations
- **Dashboard:** Glassmorphism navbar, animated stats cards
- **Projects:** Gradient accent cards with hover effects
- **Tasks:** Enhanced table with status dropdowns
- **Modals:** Modern rounded modals with smooth animations
- **Responsive:** Mobile-first design, works on all devices

---

## 🔒 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Server-side authentication checks
- ✅ Input validation with Zod
- ✅ Protected API routes
- ✅ Secure session management
- ✅ HTTPS enforced in production

---

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main dashboard
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── page.js          # Landing page
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/
│   ├── supabase/       # Supabase clients
│   └── validations.js  # Zod schemas
└── middleware.js       # Auth middleware
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **Next.js** - The React Framework
- **Supabase** - Open source Firebase alternative
- **Vercel** - Deployment platform
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check Supabase logs (Database → Logs)
3. Verify environment variables
4. Ensure SQL schema was executed completely

---

**Built with ❤️ for productive teams**

🌟 **Star this repo if you find it helpful!**
