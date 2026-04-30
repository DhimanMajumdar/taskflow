'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function test() {
      try {
        const supabase = createClient();
        
        // Test 1: Check auth
        setStatus('Checking authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError('Auth Error: ' + authError.message);
          return;
        }
        
        if (!user) {
          setStatus('Not logged in');
          return;
        }
        
        setUser(user);
        setStatus('User authenticated! Checking profile...');
        
        // Test 2: Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          setError('Profile Error: ' + profileError.message);
          return;
        }
        
        setProfile(profile);
        setStatus('✅ Everything working!');
        
      } catch (err) {
        setError('Unexpected error: ' + err.message);
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Diagnostic Test</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {user && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <strong>User:</strong>
              <pre className="mt-2 text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
          
          {profile && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <strong>Profile:</strong>
              <pre className="mt-2 text-sm">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          )}
          
          <div className="pt-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Go to Dashboard
            </a>
            {' | '}
            <a href="/login" className="text-blue-600 hover:underline">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
