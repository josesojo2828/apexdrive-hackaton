"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import {
    Car, Activity, Gavel,
    Clock, Shield, Award
} from "lucide-react";

interface DashboardStat {
    label: string;
    value: string;
    delta: string;
    icon: string;
    color: string;
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        apiClient.get("/dashboard/stats")
            .then(r => {
                setStats(r.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 border border-black/5 rounded-3xl animate-pulse" />)}
            </div>
            <div className="h-96 bg-white/50 border border-black/5 rounded-3xl animate-pulse" />
        </div>
    );

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'cat-transport': return <Car size={20} />;
            case 'srv-calendar-booking': return <Clock size={20} />;
            case 'msg-broadcast': return <Gavel size={20} />;
            case 'fin-transaction': return <Award size={20} />;
            default: return <Activity size={20} />;
        }
    };

    /**
     * Tailwind Whitelist (Ensure these classes are bundled):
     * from-blue-500 to-blue-700
     * from-emerald-500 to-emerald-700
     * from-amber-500 to-amber-700
     * from-rose-500 to-rose-700
     * from-[#1D1D1F] to-[#434343]
     * from-blue-600 to-blue-800
     * from-orange-500 to-orange-700
     */

    return (
        <div className="space-y-10">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1D1D1F] tracking-tighter uppercase italic leading-none">
                        {isAdmin ? 'Operation_Control' : 'User_Panel'}
                    </h2>
                    <p className="text-[11px] font-bold text-[#1D1D1F]/30 uppercase tracking-[0.3em]">
                        {isAdmin ? 'Nexus System Administrator' : 'ApexDrive Participant'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-black/5 rounded-xl shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]/40">System Live</span>
                    </div>
                </div>
            </div>

            {/* KPI Row (Dynamic from API) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] p-7 border border-black/5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group"
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg text-white group-hover:scale-110 transition-transform",
                            stat.color
                        )}>
                            {getIcon(stat.icon)}
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-[#1D1D1F] tracking-tighter italic">{stat.value}</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-black text-[#1D1D1F]/30 uppercase tracking-widest">{stat.label}</p>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter opacity-80 bg-blue-500/5 px-2 py-0.5 rounded-lg">{stat.delta}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Access Grid - Primary Navigation */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <QuickItem 
                    label="Mi Flota" 
                    icon={<Car size={16}/>} 
                    path="/dashboard/cars" 
                    description={isAdmin ? "Administrar inventario" : "Mis vehículos activos"}
                 />
                 <QuickItem 
                    label="Subastas" 
                    icon={<Gavel size={16}/>} 
                    path="/dashboard/auctions" 
                    description="Participar en pujas"
                 />
                 <QuickItem 
                    label="Reservas" 
                    icon={<Clock size={16}/>} 
                    path="/dashboard/rentals" 
                    description="Historial de rentas"
                 />
                 <QuickItem 
                    label="Mi Perfil" 
                    icon={<Shield size={16}/>} 
                    path="/dashboard/profile" 
                    description="Configuración de cuenta"
                 />
            </div>
        </div>
    );
}

function QuickItem({ label, icon, path, description }: { label: string; icon: any; path: string; description: string }) {
    const router = useRouter();
    return (
        <button 
           onClick={() => router.push(path)}
           className="bg-white border border-black/5 rounded-[2rem] p-8 flex flex-col gap-4 hover:shadow-2xl hover:border-blue-500/20 hover:scale-[1.02] transition-all text-left group min-h-[160px]"
        >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1D1D1F]/30 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                {icon}
            </div>
            <div className="space-y-1">
                <span className="text-[12px] font-black uppercase tracking-widest text-[#1D1D1F] block">{label}</span>
                <p className="text-[10px] text-[#1D1D1F]/40 font-medium leading-tight">{description}</p>
            </div>
        </button>
    );
}
