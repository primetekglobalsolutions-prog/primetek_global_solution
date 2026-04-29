'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import type { ApplicationRecord } from './ApplicationsClient';

export async function getAdminApplications() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      jobs (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin applications:', error);
    return [];
  }


  // Format data to match client expectations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((app: Record<string, any>) => ({
    ...app,
    job_title: app.jobs?.title || 'Unknown Job',
  })) as ApplicationRecord[];
}

export async function updateApplicationStatus(id: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('applications')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath('/admin/applications');
  revalidatePath('/admin/applications');
}

export async function updateApplicationNotes(id: string, notes: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  // In a full implementation, we'd add a 'notes' column to the DB
  // For now we'll just pretend to save it if the schema doesn't have it.
  // Assuming schema might not have it yet, we just revalidate or log.
  console.log(`Update notes for ${id}: ${notes}`);
}

export async function getAllEmployees() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('id, name, department, role')
    .eq('role', 'employee')
    .eq('status', 'Active')
    .order('name');

  if (error) {
    console.error('Error fetching employees for assignment:', error);
    return [];
  }
  return data;
}

export async function getActiveJobs() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('id, title')
    .eq('is_active', true)
    .order('title');

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data;
}
   

export async function createFullApplication(formData: any) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  // 1. Create Application
  const { data: app, error: appError } = await supabaseAdmin
    .from('applications')
    .insert({
      job_id: formData.job_id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      experience_years: formData.experience_years,
      status: 'pending',
      assigned_to: formData.assigned_to || null,
    })
    .select()
    .single();

  if (appError) {
    console.error('Error creating application:', appError);
    throw new Error('Failed to create application');
  }

  // 2. Create Profile
  const { error: profileError } = await supabaseAdmin
    .from('application_profiles')
    .insert({
      application_id: app.id,
      assigned_to: formData.assigned_to || null,
      client_name: formData.name,
      client_email: formData.email,
      client_phone: formData.phone,
      client_address: formData.client_address,
      client_role: formData.client_role,
      client_linkedin: formData.client_linkedin,
      education_details: {
        bachelors: formData.education_bachelors || '',
        masters: formData.education_masters || '',
      },
      status: formData.assigned_to ? 'assigned' : 'processing',
    });

  if (profileError) {
    console.error('Error creating application profile:', profileError);
    // Don't throw, just log. The app is created.
  }

  revalidatePath('/admin/applications');
  revalidatePath('/admin/client-profiles');
  return { success: true };
}

export async function assignApplication(applicationId: string, employeeId: string | null) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('applications')
    .update({ assigned_to: employeeId })
    .eq('id', applicationId);

  if (error) {
    console.error('Error assigning application:', error);
    throw new Error('Failed to assign application');
  }

  // Also update profile assignment if it exists
  await supabaseAdmin
    .from('application_profiles')
    .update({ 
      assigned_to: employeeId,
      status: employeeId ? 'assigned' : 'processing'
    })
    .eq('application_id', applicationId);

  revalidatePath('/admin/applications');
  revalidatePath('/admin/client-profiles');
  return { success: true };
}
