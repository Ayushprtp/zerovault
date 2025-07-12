'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminLayout from './admin/AdminLayout';
import { Database } from '@/lib/database.types';

export default function AdminDashboard() {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile && (profile.role === 'admin' || profile.role === 'dev')) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    }

    checkAdmin();
  }, [supabase]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    // You might want to redirect to a forbidden page or show an error message
    return <p>Access Denied</p>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* Admin dashboard content goes here */}
      <p>Welcome to the Admin Dashboard. Select an option from the sidebar.</p>
    </AdminLayout>
  );
}