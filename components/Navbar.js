'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    
    getProfile();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{profile.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{profile.role}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  profile.role === 'admin' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}>
                  {profile.role}
                </span>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
