'use client';

import { useParams } from 'next/navigation';
import { demoJobs } from '@/lib/demo-data';
import JobForm from '@/components/admin/JobForm';

export default function EditJobPage() {
  const params = useParams();
  const job = demoJobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-heading font-bold text-navy-900">Job not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Edit Job</h1>
        <p className="text-text-secondary text-sm mt-1">Update the details for &ldquo;{job.title}&rdquo;.</p>
      </div>
      <JobForm
        isEditing
        defaultValues={{
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements,
          salary_range: job.salary_range,
          is_active: job.is_active,
        }}
      />
    </div>
  );
}
