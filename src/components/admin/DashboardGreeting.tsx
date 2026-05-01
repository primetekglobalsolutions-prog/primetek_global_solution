'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface DashboardGreetingProps {
  userName?: string;
}

export default function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const firstName = userName ? userName.split(' ')[0] : 'Admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-navy-900 p-8 md:p-10 text-white shadow-2xl shadow-navy-900/20 mb-6 group"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] bg-primary-500/20 rounded-full blur-[100px] group-hover:bg-primary-500/30 transition-colors duration-1000" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[40%] h-[80%] bg-teal-500/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span className="text-[10px] font-bold text-primary-200 uppercase tracking-[0.2em]">System Status: Optimal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight text-white">
            Welcome Back,<br />
            <span className="text-primary-400 drop-shadow-md brightness-110">
              {firstName}
            </span>
          </h1>
          <p className="text-gray-300 text-sm mt-3 font-medium max-w-md">
            Here's what's happening across the Primetek Global ecosystem today.
          </p>
        </div>

        <div className="w-full md:w-auto md:min-w-[300px]">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/search:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
