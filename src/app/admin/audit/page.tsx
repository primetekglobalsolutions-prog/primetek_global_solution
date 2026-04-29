import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import { History, User, Activity, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AuditLogsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { data: logs, error } = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900 tracking-tight">System Audit Logs</h1>
        <p className="text-text-secondary text-sm">Track all critical actions performed across the platform.</p>
      </div>

      <Card hover={false} className="overflow-hidden border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">User</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Action</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Entity</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleString('en-IN', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-navy-100 flex items-center justify-center text-navy-600">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-navy-900">{log.user_role.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                      log.action.includes('DELETE') ? 'bg-red-50 text-red-600' :
                      log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-text-secondary">
                    {log.entity_type}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-muted font-medium truncate max-w-[200px]">
                    {log.entity_id ? `ID: ${log.entity_id.substring(0, 8)}...` : 'N/A'}
                  </td>
                </tr>
              ))}
              {(!logs || logs.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <History className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-text-muted">No audit logs found.</p>
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
