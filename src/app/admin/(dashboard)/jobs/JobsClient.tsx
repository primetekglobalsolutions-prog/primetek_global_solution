'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toggleJobActive } from './actions';

// Define standard job type based on Supabase schema
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary_range?: string | null;
  is_active: boolean;
  created_at: string;
}

interface JobsClientProps {
  initialJobs: Job[];
}

export default function JobsClient({ initialJobs }: JobsClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState('');

  const filtered = jobs.filter((job) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return job.title.toLowerCase().includes(q) || job.department.toLowerCase().includes(q);
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, is_active: !currentStatus } : job))
    );
    try {
      await toggleJobActive(id, currentStatus);
    } catch {
      // Revert on failure
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, is_active: currentStatus } : job))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Job Postings</h1>
          <p className="text-text-secondary text-sm mt-1">Manage all job listings.</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button size="sm">
            <Plus className="w-4 h-4" /> Create Job
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Posted</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-navy-900">{job.title}</p>
                    <p className="text-xs text-text-muted">{job.salary_range || '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{job.department}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{job.location}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium capitalize">{job.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(job.id, job.is_active)}
                      className="flex items-center gap-1.5"
                      title={job.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {job.is_active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-300" />
                      )}
                      <span className={`text-xs font-medium ${job.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{formatDate(job.created_at)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/jobs/${job.id}/edit`} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-text-muted">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
