'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LeaveRequestForm from '@/components/employee/LeaveRequestForm';
import { getEmployeeLeaves, getLeaveBalances } from './actions';
import { formatDate, cn } from '@/lib/utils';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [leavesData, balancesData] = await Promise.all([
      getEmployeeLeaves(),
      getLeaveBalances()
    ]);
    setLeaves(leavesData);
    setBalances(balancesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    rejected: 'bg-red-50 text-red-600 border-red-200',
  };

  const statusIcons: Record<string, any> = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  const getBalance = (type: string) => {
    const b = balances.find(bal => bal.leave_type === type);
    return b ? b.remaining_days : 0;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-900">Leave Management</h1>
          <p className="text-sm text-text-secondary mt-1">Track your time off and balances.</p>
        </div>
        <Button onClick={() => setIsApplying(true)} size="sm" className="shadow-lg shadow-primary-500/10">
          <Plus className="w-4 h-4" /> Apply Leave
        </Button>
      </div>

      {/* Summary Cards (Real Balances) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover={false} className="p-4 text-center border-l-4 border-blue-400">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sick</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{loading ? '...' : getBalance('Sick')}</p>
        </Card>
        <Card hover={false} className="p-4 text-center border-l-4 border-emerald-400">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Casual</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{loading ? '...' : getBalance('Casual')}</p>
        </Card>
        <Card hover={false} className="p-4 text-center border-l-4 border-indigo-400">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Earned</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{loading ? '...' : getBalance('Earned')}</p>
        </Card>
        <Card hover={false} className="p-4 text-center border-l-4 border-amber-400">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {loading ? '...' : leaves.filter(l => l.status === 'Pending').length}
          </p>
        </Card>
      </div>

      {/* Leave List */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-alt/30">
          <h2 className="font-heading font-bold text-navy-900">Request History</h2>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-12 text-center text-text-muted">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
              <p className="text-sm">Loading requests...</p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-text-muted">No leave requests found.</p>
            </div>
          ) : (
            leaves.map((leave) => {
              const Icon = statusIcons[leave.status.toLowerCase()] || AlertCircle;
              return (
                <div key={leave.id} className="p-5 hover:bg-surface-alt/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        statusColors[leave.status.toLowerCase()]
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-900">{leave.type} Leave</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatDate(leave.start_date)} — {formatDate(leave.end_date)}
                        </p>
                        {leave.reason && (
                          <p className="text-[11px] text-text-secondary mt-2 bg-surface-alt/50 px-2 py-1 rounded border border-border inline-block italic">
                            &ldquo;{leave.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      statusColors[leave.status.toLowerCase()]
                    )}>
                      {leave.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm" onClick={() => setIsApplying(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Card hover={false} className="p-6 md:p-8 relative shadow-2xl border-2 border-primary-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-navy-900">Apply for Leave</h2>
                    <p className="text-xs text-text-muted mt-1">Submit your time-off request for approval.</p>
                  </div>
                  <button onClick={() => setIsApplying(false)} className="p-2 hover:bg-surface-alt rounded-lg text-text-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <LeaveRequestForm onSuccess={() => {
                  setIsApplying(false);
                  fetchData();
                }} />
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
