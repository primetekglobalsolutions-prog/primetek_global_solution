'use client';

import { useState } from 'react';
import { 
  Calendar, Home, CheckCircle2, XCircle, 
  Clock, MapPin, User, ChevronRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { updateLeaveStatus, updateWFHStatus } from './actions';
import { formatDate } from '@/lib/utils';

export default function ApprovalsClient({ 
  initialLeaves, 
  initialWFH 
}: { 
  initialLeaves: any[], 
  initialWFH: any[] 
}) {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [wfh, setWfh] = useState(initialWFH);
  const [activeTab, setActiveTab] = useState<'leaves' | 'wfh'>('leaves');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleLeaveAction = async (id: string, status: 'Approved' | 'Rejected') => {
    setProcessing(id);
    try {
      await updateLeaveStatus(id, status);
      setLeaves(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert('Action failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleWFHAction = async (id: string, status: 'Approved WFH' | 'Rejected WFH') => {
    setProcessing(id);
    try {
      await updateWFHStatus(id, status);
      setWfh(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert('Action failed');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-surface-alt rounded-2xl w-fit border border-border">
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'leaves' ? 'bg-white text-primary-500 shadow-sm' : 'text-text-muted hover:text-navy-900'}`}
        >
          <Calendar className="w-4 h-4" />
          Leaves
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-50 text-[10px]">{leaves.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('wfh')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'wfh' ? 'bg-white text-primary-500 shadow-sm' : 'text-text-muted hover:text-navy-900'}`}
        >
          <Home className="w-4 h-4" />
          WFH Requests
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-50 text-[10px]">{wfh.length}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="wait">
          {activeTab === 'leaves' ? (
            <motion.div
              key="leaves"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {leaves.length === 0 ? (
                <Card hover={false} className="p-12 text-center text-text-muted">
                  No pending leave requests.
                </Card>
              ) : (
                leaves.map((leave) => (
                  <Card key={leave.id} hover={false} className="p-5 md:p-6 border-l-4 border-amber-400">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-navy-900" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-navy-900">{leave.employee_name}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Calendar className="w-3.5 h-3.5 text-primary-500" />
                              {formatDate(leave.start_date)} — {formatDate(leave.end_date)}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary font-bold uppercase tracking-wider">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {leave.type} Leave
                            </span>
                          </div>
                          {leave.reason && (
                            <p className="text-sm text-text-muted mt-3 bg-surface-alt/50 p-3 rounded-xl italic border border-border">
                              &ldquo;{leave.reason}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                          disabled={processing === leave.id}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleLeaveAction(leave.id, 'Approved')}
                          disabled={processing === leave.id}
                          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                        >
                          {processing === leave.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve</>}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="wfh"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {wfh.length === 0 ? (
                <Card hover={false} className="p-12 text-center text-text-muted">
                  No pending WFH requests.
                </Card>
              ) : (
                wfh.map((request) => (
                  <Card key={request.id} hover={false} className="p-5 md:p-6 border-l-4 border-primary-400">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center shrink-0">
                          <Home className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-navy-900">{request.employee_name}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Calendar className="w-3.5 h-3.5 text-primary-500" />
                              {formatDate(request.date)}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Clock className="w-3.5 h-3.5 text-primary-500" />
                              Requested at {new Date(request.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                            <MapPin className="w-3.5 h-3.5" />
                            Location Captured: {request.lat.toFixed(4)}, {request.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleWFHAction(request.id, 'Rejected WFH')}
                          disabled={processing === request.id}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" /> Deny
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleWFHAction(request.id, 'Approved WFH')}
                          disabled={processing === request.id}
                          className="bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                        >
                          {processing === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve WFH</>}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
