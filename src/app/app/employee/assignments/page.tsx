import { getEmployeeAssignments } from './actions';
import Card from '@/components/ui/Card';
import { Briefcase, User, Mail, Phone, Download, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default async function EmployeeAssignmentsPage() {
  const assignments = await getEmployeeAssignments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900 tracking-tight">Assigned Profiles</h1>
        <p className="text-text-secondary text-sm">Client profiles assigned to you for processing.</p>
      </div>

      {assignments.length === 0 ? (
        <Card hover={false} className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
          <p className="text-text-secondary font-medium">No profiles assigned yet.</p>
          <p className="text-text-muted text-xs mt-1">Check back later or contact admin.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((app) => (
            <Card key={app.id} className="p-6 overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-heading font-bold text-navy-900">{app.client_name}</h3>
                  <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mt-1">{app.job_title}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                  app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {app.status}
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span>{app.client_email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span>{app.client_phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>Assigned on {formatDate(app.created_at)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                {app.resume_url ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                    <Download className="w-4 h-4" /> Resume
                  </Button>
                ) : (
                  <span className="text-xs text-text-muted italic">No resume attached</span>
                )}
                <Button variant="primary" size="sm" className="w-full">
                  Update Status
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
