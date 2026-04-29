'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { TrendingUp, Users, Calendar, Briefcase } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartsProps {
  attendanceData: DataPoint[];
  applicationData: DataPoint[];
}

export default function AnalyticsCharts({ attendanceData, applicationData }: AnalyticsChartsProps) {
  const maxAttendance = Math.max(...attendanceData.map(d => d.value), 1);
  const maxApplications = Math.max(...applicationData.map(d => d.value), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Trends */}
      <Card hover={false} className="p-6 md:p-8 rounded-[2rem] border-0 shadow-xl shadow-navy-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-6 -mt-6">
          <Calendar className="w-32 h-32 text-navy-900" />
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading font-black text-navy-900 text-lg">Attendance Consistency</h3>
              <p className="text-xs text-text-muted font-medium mt-1">Average daily check-in percentage</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {attendanceData.map((point, i) => (
              <div key={point.label} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.value / maxAttendance) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-[24px] rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 relative overflow-hidden group-hover:from-primary-500 group-hover:to-primary-300 transition-all duration-300"
                  >
                    <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
                  </motion.div>
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap pointer-events-none">
                    {point.value}%
                  </div>
                </div>
                <span className="text-[10px] font-black text-text-muted mt-3 uppercase tracking-tighter truncate w-full text-center">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recruitment Velocity */}
      <Card hover={false} className="p-6 md:p-8 rounded-[2rem] border-0 shadow-xl shadow-navy-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-6 -mt-6">
          <Briefcase className="w-32 h-32 text-navy-900" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading font-black text-navy-900 text-lg">Recruitment Velocity</h3>
              <p className="text-xs text-text-muted font-medium mt-1">Applications received per week</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {applicationData.map((point, i) => (
              <div key={point.label} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(point.value / maxApplications) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-[24px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 relative overflow-hidden group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-300"
                  >
                    <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
                  </motion.div>
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap pointer-events-none">
                    {point.value}
                  </div>
                </div>
                <span className="text-[10px] font-black text-text-muted mt-3 uppercase tracking-tighter truncate w-full text-center">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
