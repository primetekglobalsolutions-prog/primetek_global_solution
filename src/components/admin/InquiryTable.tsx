'use client';

import { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  requirement: string;
  status: string;
  created_at: string;
}

interface InquiryTableProps {
  inquiries: Inquiry[];
}

const statusOptions = ['all', 'new', 'contacted', 'qualified', 'closed'] as const;

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

const ITEMS_PER_PAGE = 8;

export default function InquiryTable({ inquiries }: InquiryTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [localInquiries, setLocalInquiries] = useState(inquiries);

  const filtered = useMemo(() => {
    return localInquiries.filter((inq) => {
      const matchesSearch =
        search === '' ||
        inq.name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email.toLowerCase().includes(search.toLowerCase()) ||
        inq.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localInquiries, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusChange = (id: string, newStatus: string) => {
    setLocalInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    // TODO: PATCH to /api/inquiries/[id] when Supabase is connected
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Requirement', 'Status', 'Date'];
    const rows = filtered.map((inq) => [
      inq.name,
      inq.email,
      inq.company,
      inq.phone,
      `"${inq.requirement.replace(/"/g, '""')}"`,
      inq.status,
      formatDate(inq.created_at),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `primetek-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card hover={false} className="p-0 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'All Status' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Export */}
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-alt/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Company</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Requirement</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-text-muted text-sm">No inquiries found.</p>
                </td>
              </tr>
            ) : (
              paginated.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-navy-900">{inquiry.name}</p>
                    <p className="text-xs text-text-muted">{inquiry.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{inquiry.company}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary max-w-[250px]">
                    {truncate(inquiry.requirement, 60)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer ${statusColors[inquiry.status]} focus:outline-none`}
                    >
                      {statusOptions.filter((s) => s !== 'all').map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                    {formatDate(inquiry.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
