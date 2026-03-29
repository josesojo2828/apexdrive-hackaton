"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  MapPin, 
  Navigation, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";

const data = [
  { name: "1", value: 30 },
  { name: "2", value: 45 },
  { name: "3", value: 35 },
  { name: "4", value: 60 },
  { name: "5", value: 50 },
  { name: "6", value: 80 },
  { name: "7", value: 95 },
];

export const HeroDashboard = () => {
  return (
    <div className="relative w-full max-w-[600px] h-[350px] sm:h-[450px] md:h-[500px] flex items-center justify-center translate-y-8 lg:translate-y-0">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden sm:overflow-visible">
        <div className="w-[120%] h-[120%] border border-white/5 rounded-full scale-110 sm:scale-150 opacity-20" />
        <div className="w-[100%] h-[100%] border border-white/5 rounded-full scale-100 sm:scale-125 opacity-10" />
      </div>

      {/* Main Map Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute z-20 w-64 h-80 sm:w-80 sm:h-96 bg-brand-slate/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden group"
      >
        {/* Fake Map Interface */}
        <div className="h-1/2 sm:h-2/3 bg-slate-900/50 relative p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#5188B2_1px,_transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Map Route Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
             <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                d="M10,80 Q30,70 40,40 T80,20" 
                fill="none" 
                stroke="#5B88B2" 
                strokeWidth="2" 
                strokeDasharray="4 2"
             />
             <motion.circle 
                animate={{ 
                  x: [0, 80], 
                  y: [0, -60], 
                  opacity: [0, 1, 0] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                cx="10" 
                cy="80" 
                r="3" 
                fill="#5B88B2" 
                className="shadow-[0_0_10px_#5B88B2]"
             />
          </svg>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-sky" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
             <span className="text-[10px] font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
               <Clock className="w-3 h-3 text-brand-sky" /> 4 MIN
             </span>
          </div>
        </div>

        {/* Card Footer Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Destino Actual</p>
              <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Downtown Central</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-sky rounded-lg sm:rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(91,136,178,0.5)]">
               <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-brand-white" />
            </div>
          </div>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: ["0%", "75%", "75%"] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="h-full bg-gradient-to-r from-brand-sky to-brand-blue" 
             />
          </div>
        </div>
      </motion.div>

      {/* Floating Stats Card (Top Right) */}
      <motion.div 
        animate={{ y: [-10, 10] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute -top-12 -right-4 sm:-top-10 sm:-right-20 z-30 w-48 sm:w-64 p-4 sm:p-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-4">
           <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
             <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
           </div>
           <span className="text-[8px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest">+24% AVG</span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white">$4,285<span className="text-xs sm:text-sm text-white/40 ml-1">.50</span></p>
        <p className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 sm:mb-4">Ingresos</p>
        
        <div className="h-12 sm:h-16 w-full opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B88B2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5B88B2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#5B88B2" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Floating Activity Card (Bottom Left) */}
      <motion.div 
        animate={{ x: [-10, 10] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute -bottom-12 -left-4 sm:-bottom-10 sm:-left-20 z-10 w-48 sm:w-60 p-4 sm:p-5 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] sm:rounded-[1.8rem] shadow-lg"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-sky/20 flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-brand-sky" />
             </div>
             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">Flota Activa</p>
            <p className="text-[9px] sm:text-xs text-white/40">148 Online</p>
          </div>
        </div>
      </motion.div>

      {/* Payment Accent Card (Back) - Hidden on smallest mobile */}
      <motion.div 
        animate={{ rotate: [-2, 2] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -right-8 bottom-4 sm:-right-10 sm:bottom-10 z-0 w-32 sm:w-48 p-4 bg-brand-blue/60 backdrop-blur-md border border-white/5 rounded-[1.5rem] opacity-20 sm:opacity-40 rotate-12 hidden xs:block"
      >
        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white/20 mb-2" />
        <div className="h-1.5 w-2/3 bg-white/10 rounded-full mb-2" />
        <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
      </motion.div>
    </div>
  );
};
