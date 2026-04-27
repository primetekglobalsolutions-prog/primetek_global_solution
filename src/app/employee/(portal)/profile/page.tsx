import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/employee/login');
  }

  const { data: employee, error } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', session.id)
    .single();

  if (error || !employee) {
    console.error('Error fetching employee profile:', error);
    redirect('/employee/login');
  }

  return <ProfileClient employee={employee} />;
}
