"use client";

import { useEffect, useState } from "react";
import { useFleetLocations } from "@/features/dashboard/hooks/useFleetLocations";
import dynamic from "next/dynamic";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation2, Wifi, WifiOff, Terminal, Activity, ShieldCheck } from "lucide-react";

const FleetMap = dynamic(() => import("@/features/dashboard/components/FleetMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-black/[0.02] animate-pulse flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-brand-blue/20 italic">Initializing_Kinetic_Grid...</span>
    </div>
});

export default function RealtimeDashboard() {
    const { locations } = useFleetLocations();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const addLog = (msg: string) => {
            setLogs(prev => [msg, ...prev].slice(0, 10));
        };

        addLog("PROTOCOL ACTIVE // WS_TRACKING_NAMESPACE_CONNECTED");
        
        if (locations.length > 0) {
            addLog(`UNIT_DETECTION: ${locations.length} ACTIVE_NODES`);
        }
    }, [locations.length]);

    const activeDrivers = locations.filter(l => l.type === 'DRIVER');

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-12">
            {/* Left Control Column */}
            <div className="lg:w-[450px] flex flex-col gap-10">
                
                {/* Status Hero Card */}
                <div className="p-12 bg-white border border-black/5 rounded-[4rem] shadow-2xl shadow-black/[0.02] relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-blue/[0.03] rounded-full blur-[80px]" />
                    
                    <div className="flex items-center gap-4 mb-10">
                         <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#F9D072]" />
                         <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] italic">Fleet Live Stream // Alpha</span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-brand-blue/20 uppercase tracking-[0.4em] italic">Active_Units</p>
                            <p className="text-7xl font-black text-brand-blue italic tracking-tighter uppercase leading-none">{activeDrivers.length}</p>
                        </div>
                        <div className="w-20 h-20 bg-brand-blue/[0.03] rounded-[2rem] flex items-center justify-center text-brand-blue group-hover:rotate-12 transition-transform duration-700">
                            <Activity size={40} className="opacity-40" />
                        </div>
                    </div>

                    <div className="mt-10 h-2 w-full bg-black/[0.03] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(activeDrivers.length * 10, 100)}%` }}
                            className="h-full bg-brand-blue italic shadow-2xl shadow-brand-blue/20" 
                        />
                    </div>
                </div>

                {/* Telemetry Feed */}
                <div className="flex-1 p-12 bg-white border border-black/5 rounded-[4rem] shadow-2xl shadow-black/[0.02] flex flex-col gap-10 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-black/5 pb-8">
                        <div className="flex items-center gap-3">
                            <Navigation2 size={16} className="text-brand-blue italic" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-blue italic">Kinetic_Feed</span>
                        </div>
                        <div className="px-4 py-2 bg-brand-blue/[0.05] rounded-full">
                             <span className="text-[9px] font-black text-brand-blue uppercase italic tracking-widest">v2.0_Secure</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar-light">
                        <AnimatePresence mode="popLayout">
                            {activeDrivers.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center opacity-10 gap-6 text-brand-blue"
                                >
                                    <WifiOff size={48} className="italic" />
                                    <p className="text-[10px] font-black uppercase tracking-[1em] italic text-center">Awaiting_Signal...</p>
                                </motion.div>
                            ) : (
                                activeDrivers.map((driver, i) => (
                                    <motion.div 
                                        key={driver.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-black/[0.01] border border-black/5 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:border-brand-blue/10 transition-all group cursor-crosshair"
                                    >
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-brand-blue/[0.03] border border-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                            <Navigation2 className="w-7 h-7 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 overflow-hidden space-y-1">
                                            <p className="text-sm font-black text-brand-blue truncate uppercase tracking-tight italic leading-tight">{driver.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold text-brand-blue/20 font-mono tracking-tighter italic">
                                                    COORD // {driver.lat.toFixed(6)} • {driver.lng.toFixed(6)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* System Terminal */}
                <div className="h-48 p-10 bg-brand-blue border border-white/5 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-brand-blue/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="text-[10px] text-white/40 uppercase font-black mb-6 flex items-center gap-3 italic tracking-widest">
                         <Terminal size={12} />
                         Console_Interface
                    </div>
                    <div className="text-[11px] leading-relaxed overflow-y-auto h-20 scrollbar-hide font-mono text-white/80 italic space-y-1">
                         {logs.map((log, i) => (
                             <div key={i} className="flex gap-3">
                                 <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                 <span className={cn(i === 0 ? "text-primary font-black" : "opacity-70")}>{`> ${log}`}</span>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Main Area: High-End Map View */}
            <div className="flex-1 h-full min-h-[600px] rounded-[5rem] overflow-hidden border border-black/5 shadow-3xl bg-white relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none opacity-50" />
                 <div className="absolute top-10 right-10 z-20 flex gap-4">
                     <div className="px-8 py-4 bg-white/90 backdrop-blur-xl border border-black/5 rounded-[2rem] shadow-2xl flex items-center gap-4">
                         <ShieldCheck className="text-primary" size={18} />
                         <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest italic">Global_Grid_Scan // Active</span>
                     </div>
                 </div>
                 <FleetMap locations={locations} height="100%" className="grayscale contrast-125 brightness-110 opacity-90 saturate-50" />
            </div>
        </div>
    );
}
