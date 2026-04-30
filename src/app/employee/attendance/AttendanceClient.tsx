'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, LogIn, LogOut, Loader2, Home, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { checkIn, checkOut, resumeSession, requestWFH } from './actions';

const statusColors: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  late: 'bg-amber-50 text-amber-600 border-amber-200',
  absent: 'bg-red-50 text-red-600 border-red-200',
  'half-day': 'bg-blue-50 text-blue-600 border-blue-200',
  'pending wfh': 'bg-amber-50 text-amber-600 border-amber-200',
  'approved wfh': 'bg-indigo-50 text-indigo-600 border-indigo-200',
  'rejected wfh': 'bg-red-50 text-red-600 border-red-200',
};

export interface AttendanceRecord {
  id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  check_in_raw: string | null;
  duration_hours: number;
  status: string;
}

export default function AttendanceClient({ initialRecords }: { initialRecords: AttendanceRecord[] }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [wfhRequest, setWfhRequest] = useState<{ active: boolean; distance?: number; officeName?: string } | null>(null);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const todayStr = getLocalDateString(new Date());
  const todayRecord = initialRecords.find(r => r.date === todayStr);

  const checkedIn = !!todayRecord;
  const isCheckedOut = todayRecord && todayRecord.check_out;
  const checkInTime = todayRecord && todayRecord.check_in_raw ? new Date(todayRecord.check_in_raw) : null;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setGpsStatus('loading');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoords({ lat, lng });
      
      const result = await checkIn(lat, lng);
      
      if (!result.success) {
        if (result.outOfRadius) {
          setWfhRequest({ active: true, distance: result.distance, officeName: result.officeName });
          setGpsStatus('idle');
        } else {
          setGpsStatus('error');
          alert(result.error || 'Check-in failed');
        }
        return;
      }

      setGpsStatus('success');
    } catch (err: any) {
      setGpsStatus('error');
      alert(err.message || 'Could not get location');
    }
  };

  const handleWFHRequest = async () => {
    if (!coords) return;
    setGpsStatus('loading');
    try {
      const result = await requestWFH(coords.lat, coords.lng);
      if (result.success) {
        setGpsStatus('success');
        setWfhRequest(null);
      } else {
        alert(result.error);
        setGpsStatus('error');
      }
    } catch {
      setGpsStatus('error');
      alert('Failed to request WFH');
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    if (!window.confirm('Clock out now?')) return;
    setGpsStatus('loading');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const result = await checkOut(todayRecord.id, position.coords.latitude, position.coords.longitude);
      if (result.success) setGpsStatus('success');
      else {
        alert(result.error);
        setGpsStatus('error');
      }
    } catch (err: any) {
      setGpsStatus('error');
      alert(err.message || 'Check-out failed');
    }
  };

  const handleResume = async () => {
    if (!todayRecord) return;
    setGpsStatus('loading');
    try {
      const result = await resumeSession(todayRecord.id);
      if (result.success) setGpsStatus('success');
      else {
        alert(result.error);
        setGpsStatus('error');
      }
    } catch {
      setGpsStatus('error');
      alert('Failed to resume');
    }
  };

  const elapsed = (checkInTime && !isCheckedOut) ? Math.floor((currentTime.getTime() - checkInTime.getTime()) / 1000) : 0;
  const elapsedHrs = Math.floor(elapsed / 3600);
  const elapsedMin = Math.floor((elapsed % 3600) / 60);
  const elapsedSec = elapsed % 60;

  const monthStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
  const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < monthStart.getDay(); i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getStatusForDay = (day: number) => {
    const dStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = initialRecords.find(r => r.date === dStr);
    return record?.status?.toLowerCase() || null;
  };

  const calendarColors: Record<string, string> = {
    present: 'bg-emerald-500 text-white',
    late: 'bg-amber-400 text-white',
    absent: 'bg-red-400 text-white',
    'half-day': 'bg-blue-400 text-white',
    'pending wfh': 'bg-amber-300 text-white',
    'approved wfh': 'bg-indigo-500 text-white',
    'rejected wfh': 'bg-red-300 text-white',
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false} className="p-6 md:p-8 text-center space-y-6">
          <div>
            <p className="text-5xl font-bold text-navy-900 font-mono tracking-wide">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm text-text-muted mt-1">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {checkedIn && !isCheckedOut && (
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wider mb-1">Working Since</p>
              <p className="text-2xl font-bold text-emerald-700 font-mono">
                {String(elapsedHrs).padStart(2, '0')}:{String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
              </p>
            </div>
          )}

          {!checkedIn ? (
            <Button size="lg" className="w-full py-6" onClick={handleCheckIn} disabled={gpsStatus === 'loading'}>
              {gpsStatus === 'loading' ? <><Loader2 className="w-6 h-6 animate-spin" /> Location...</> : <><LogIn className="w-6 h-6" /> Check In</>}
            </Button>
          ) : !isCheckedOut ? (
            <Button size="lg" variant="outline" className="w-full py-6 border-red-300 text-red-600" onClick={handleCheckOut} disabled={gpsStatus === 'loading'}>
              {gpsStatus === 'loading' ? <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</> : <><LogOut className="w-6 h-6" /> Check Out</>}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Shift Completed</p>
              </div>
              <button onClick={handleResume} className="text-xs text-primary-500 font-bold underline">Resume Session</button>
            </div>
          )}
        </Card>

        {/* Calendar Card (Keep simple) */}
        <Card hover={false} className="p-6 md:p-8">
          <h2 className="font-heading font-bold text-navy-900 mb-4">{currentTime.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] font-bold text-text-muted py-2">{d}</div>)}
            {calendarDays.map((day, i) => (
              <div key={i} className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium ${day && getStatusForDay(day) && calendarColors[getStatusForDay(day)!] ? calendarColors[getStatusForDay(day)!] : day ? 'text-navy-900' : ''}`}>
                {day}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border"><h2 className="font-heading font-bold text-navy-900">Attendance History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-surface-alt/50 border-b border-border text-text-muted">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {initialRecords.map(r => (
                <tr key={r.id} className="border-b border-border">
                  <td className="px-6 py-4 font-medium">{r.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border font-bold uppercase ${statusColors[r.status.toLowerCase()] || 'bg-gray-100'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{r.duration_hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* WFH Modal */}
      <AnimatePresence>
        {wfhRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm">
              <Card hover={false} className="p-6 border-2 border-primary-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2"><button onClick={() => setWfhRequest(null)}><X className="w-5 h-5 text-text-muted" /></button></div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mb-2">
                    <Home className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-navy-900">Request WFH?</h3>
                    <p className="text-sm text-text-secondary mt-2">
                      You are <strong>{wfhRequest.distance}m</strong> away from <strong>{wfhRequest.officeName}</strong>.
                      Would you like to request Work From Home for today?
                    </p>
                  </div>
                  <div className="flex flex-col w-full gap-3 pt-4">
                    <Button onClick={handleWFHRequest} disabled={gpsStatus === 'loading'} className="w-full shadow-lg shadow-primary-500/20">
                      Yes, Request WFH
                    </Button>
                    <button onClick={() => setWfhRequest(null)} className="text-sm font-bold text-text-muted py-2">
                      Cancel
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
