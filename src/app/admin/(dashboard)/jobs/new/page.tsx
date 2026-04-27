import JobForm from '@/components/admin/JobForm';

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Create New Job</h1>
        <p className="text-text-secondary text-sm mt-1">Add a new job posting to the careers page.</p>
      </div>
      <JobForm />
    </div>
  );
}
