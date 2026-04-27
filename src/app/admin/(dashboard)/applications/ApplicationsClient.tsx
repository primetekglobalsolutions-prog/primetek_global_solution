'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, X } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { updateApplicationStatus, updateApplicationNotes } from './actions';

export interface ApplicationRecord {
  id: string;
  job_id: string;
  job_title: string;
  name: string;
  email: string;
  phone?: string;
  experience_years?: number;
  cover_letter?: string;
  resume_url?: string;
  status: string;
  created_at: string;
  notes?: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  pending: 'bg-blue-50 text-blue-600 border-blue-200',
  reviewed: 'bg-amber-50 text-amber-600 border-amber-200',
  shortlisted: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected: 'bg-red-50 text-red-500 border-red-200',
};

const statusOptions = ['all', 'pending', 'reviewed', 'shortlisted', 'rejected'] as const;

export default function ApplicationsClient({ initialApps }: { initialApps: ApplicationRecord[] }) {
  const [apps, setApps] = useState<ApplicationRecord[]>(initialApps);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        !search ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesJob = jobFilter === 'all' || app.job_id === jobFilter;
      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [apps, search, statusFilter, jobFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    // Optimistic UI
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (selectedApp?.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status } : null));
    }
    
    try {
      await updateApplicationStatus(id, status);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const uniqueJobs = [...new Map(apps.map((j) => [j.job_id, { id: j.job_id, title: j.job_title }])).values()];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Applications</h1>
        <p className="text-text-secondary text-sm mt-1">Review and manage candidate applications.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400">
          {statusOptions.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400">
          <option value="all">All Jobs</option>
          {uniqueJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Applicant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Job</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Exp.</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted text-sm">No applications found.</td></tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-navy-900">{app.name}</p>
                      <p className="text-xs text-text-muted">{app.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{app.job_title}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{app.experience_years || 0}y</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer ${statusColors[app.status] || statusColors.new} focus:outline-none`}
                      >
                        {statusOptions.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{formatDate(app.created_at)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
          <div
            className="w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-navy-900">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 rounded-lg hover:bg-surface-alt text-text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Applicant</p>
                <p className="text-lg font-bold text-navy-900">{selectedApp.name}</p>
                <p className="text-sm text-text-secondary">{selectedApp.email}</p>
                {selectedApp.phone && <p className="text-sm text-text-secondary">{selectedApp.phone}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Applied For</p>
                <p className="text-sm font-medium text-navy-900">{selectedApp.job_title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Experience</p>
                <p className="text-sm text-text-secondary">{selectedApp.experience_years || 0} years</p>
              </div>
              {selectedApp.cover_letter && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Cover Letter</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{selectedApp.cover_letter}</p>
                </div>
              )}
              {selectedApp.resume_url && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Resume</p>
                  <Button variant="outline" size="sm" onClick={() => alert(`Would download ${selectedApp.resume_url}`)}>
                    <Download className="w-4 h-4" /> Download Resume
                  </Button>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Status</p>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${statusColors[selectedApp.status] || statusColors.new} focus:outline-none w-full`}
                >
                  {statusOptions.filter((s) => s !== 'all').map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
