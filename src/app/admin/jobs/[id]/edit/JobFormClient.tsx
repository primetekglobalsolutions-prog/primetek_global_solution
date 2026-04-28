'use client';

import JobForm from '@/components/admin/JobForm';
import { useRouter } from 'next/navigation';

export default function JobFormClient({ job, saveAction }: { job: any, saveAction: any }) {
  const router = useRouter();

  return (
    <JobForm
      isEditing
      jobId={job.id}
      saveAction={saveAction}
      onSuccess={() => router.push('/admin/jobs')}
      defaultValues={{
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type as any,
        description: job.description,
        requirements: job.requirements,
        salary_range: job.salary_range || undefined,
        is_active: job.is_active,
      }}
    />
  );
}
