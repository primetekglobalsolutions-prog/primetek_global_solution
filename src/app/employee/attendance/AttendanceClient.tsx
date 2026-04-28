'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, LogIn, LogOut, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { checkIn, checkOut } from './actions';

const statusColors: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  late: 'bg-amber-50 text-amber-600 border-amber-200',
  absent: 'bg-red-50 text-red-600 border-red-200',
  'half-day': 'bg-blue-50 text-blue-600 border-blue-200',
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

  // find today's record
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
      setGpsStatus('success');
      
      await checkIn(lat, lng);
    } catch (err: any) {
      setGpsStatus('error');
      const msg = err.message || 'Could not get your location. Please ensure GPS is enabled and you have given permission.';
      alert(msg);
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
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
      setGpsStatus('success');
      
      await checkOut(todayRecord.id, lat, lng);
    } catch (err: any) {
      setGpsStatus('error');
      const msg = err.message || 'Could not get your location for check-out.';
      alert(msg);
    }
  };

  const elapsed = (checkInTime && !isCheckedOut)
    ? Math.floor((currentTime.getTime() - checkInTime.getTime()) / 1000)
    : 0;
  const elapsedHrs = Math.floor(elapsed / 3600);
  const elapsedMin = Math.floor((elapsed % 3600) / 60);
  const elapsedSec = elapsed % 60;

  // Calendar grid
  const monthStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
  const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
  const startDay = monthStart.getDay();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getStatusForDay = (day: number) => {
    const dateStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = initialRecords.find((r) => r.date === dateStr);
    return record?.status?.toLowerCase() || null;
  };

  const calendarColors: Record<string, string> = {
    present: 'bg-emerald-500 text-white',
    late: 'bg-amber-400 text-white',
    absent: 'bg-red-400 text-white',
    'half-day': 'bg-blue-400 text-white',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-navy-900">Attendance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Panel */}
        <Card hover={false} className="p-6 md:p-8">
          <div className="text-center space-y-6">
            {/* Live Clock */}
            <div>
              <p className="text-5xl font-bold text-navy-900 font-mono tracking-wide">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-sm text-text-muted mt-1">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Duration Timer */}
            {checkedIn && !isCheckedOut && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wider mb-1">Working Since</p>
                <p className="text-2xl font-bold text-emerald-700 font-mono">
                  {String(elapsedHrs).padStart(2, '0')}:{String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
                </p>
              </div>
            )}
            
            {isCheckedOut && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-medium tracking-wider mb-1">Checked out for today</p>
              </div>
            )}

            {/* GPS Status */}
            {coords && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="text-text-secondary">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            )}

            {/* Action Button */}
            {!checkedIn ? (
              <Button
                size="lg"
                className="w-full text-lg py-6"
                onClick={handleCheckIn}
                disabled={gpsStatus === 'loading'}
              >
                {gpsStatus === 'loading' ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Getting Location...</>
                ) : (
                  <><LogIn className="w-6 h-6" /> Check In</>
                )}
              </Button>
            ) : !isCheckedOut ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleCheckOut}
                disabled={gpsStatus === 'loading'}
              >
                {gpsStatus === 'loading' ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                ) : (
                  <><LogOut className="w-6 h-6" /> Check Out</>
                )}
              </Button>
            ) : null}
          </div>
        </Card>

        {/* Calendar */}
        <Card hover={false} className="p-6 md:p-8">
          <h2 className="font-heading font-bold text-navy-900 mb-4">
            {currentTime.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h2>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Present</span>
            <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-amber-400" /> Late</span>
            <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-red-400" /> Absent</span>
            <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-gray-200" /> Weekend</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-xs font-semibold text-text-muted py-2">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dayDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), day);
              const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
              const isToday = day === currentTime.getDate();
              const status = getStatusForDay(day);
              const isFuture = day > currentTime.getDate();

              return (
                <div
                  key={day}
                  className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    isToday
                      ? 'ring-2 ring-primary-500 ring-offset-1'
                      : ''
                  } ${
                    status && calendarColors[status]
                      ? calendarColors[status]
                      : isWeekend
                        ? 'bg-gray-100 text-gray-400'
                        : isFuture
                          ? 'text-gray-300'
                          : 'text-navy-900'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-heading font-bold text-navy-900">Attendance History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check In</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Check Out</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Hours</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialRecords.slice(0, 15).map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0 hover:bg-surface-alt/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-navy-900 font-medium">{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.check_in || '—'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.check_out || '—'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{record.duration_hours > 0 ? `${record.duration_hours}h` : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[record.status.toLowerCase()] || statusColors.present}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
