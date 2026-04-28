import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import JobForm from '@/components/admin/JobForm';
import { saveJob } from '../../actions';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: job, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Edit Job</h1>
        <p className="text-text-secondary text-sm mt-1">Update the details for &ldquo;{job.title}&rdquo;.</p>
      </div>
      <JobForm
        isEditing
        jobId={job.id}
        saveAction={saveJob}
        defaultValues={{
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type as 'full-time' | 'part-time' | 'contract' | 'remote',
          description: job.description,
          requirements: job.requirements,
          salary_range: job.salary_range || undefined,
          is_active: job.is_active,
        }}
      />
    </div>
  );
}
