"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/utils/api/api.client";
import { 
    Clock, 
    CheckCircle2, 
    ArrowRightCircle, 
    Key, 
    Hammer, 
    ShieldCheck, 
    Gavel,
    Search,
    Calendar,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';
import { cn } from "@/utils/cn";

export default function CarHistoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const carId = searchParams.get('id');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/cars/logs', { params: { carId } });
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    }, [carId]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = !search || 
            log.action.toLowerCase().includes(search.toLowerCase()) || 
            log.car?.plate.toLowerCase().includes(search.toLowerCase());
        
        if (filter === 'ALL') return matchesSearch;
        return matchesSearch && log.action.includes(filter);
    });

    const getLogConfig = (action: string) => {
        if (action.includes('RENTAL')) return { icon: <Key size={16} />, color: '#007AFF', label: 'Alquiler' };
        if (action.includes('AUCTION')) return { icon: <Gavel size={16} />, color: '#FFD700', label: 'Subasta' };
        if (action.includes('MAINTENANCE')) return { icon: <Hammer size={16} />, color: '#8E8E93', label: 'Servicio' };
        if (action.includes('STATUS')) return { icon: <CheckCircle2 size={16} />, color: '#34C759', label: 'Estatus' };
        return { icon: <ArrowRightCircle size={16} />, color: '#1D1D1F', label: 'Sistema' };
    };

    return (
        <div className="p-12 max-w-[1200px] mx-auto space-y-12 min-h-screen bg-[#FDFDFD]">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-black/5 shadow-sm">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Historical_Audit_Protocol</span>
                        </div>
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">
                        FLEET <span className="text-primary">LOGS</span>
                    </h1>
                    {carId && (
                        <p className="mt-4 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 inline-block px-4 py-2 rounded-lg">
                            Filtrando_Activo // #{carId.slice(0, 8)}
                        </p>
                    )}
                </motion.div>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por placa o acción..."
                            className="pl-12 pr-6 py-4 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-primary transition-all w-full md:w-[350px] font-black text-xs uppercase tracking-widest placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-black/5 rounded-full">
                        {['ALL', 'RENTAL', 'AUCTION', 'STATUS'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-full text-[9px] font-black uppercase transition-all tracking-widest",
                                    filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t === 'STATUS' ? 'ESTADO' : t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Area */}
            <div className="relative">
                <div className="absolute left-[31px] top-4 bottom-0 w-[2px] bg-slate-100 hidden md:block" />

                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-black/5 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descifrando_Bitácora</p>
                    </div>
                ) : filteredLogs.length > 0 ? (
                    <div className="space-y-10">
                        {filteredLogs.map((log, index) => {
                            const config = getLogConfig(log.action);
                            return (
                                <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative flex items-start gap-8 group"
                                >
                                    <div className="relative z-10 hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 transition-all group-hover:border-primary group-hover:scale-105 shadow-sm" style={{ color: config.color }}>
                                        {config.icon}
                                    </div>

                                    <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-primary transition-all shadow-sm">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-lg bg-black text-[9px] font-black text-white tracking-widest uppercase">
                                                    {log.car?.plate || 'S/M'}
                                                </span>
                                                <h3 className="text-lg font-black italic tracking-tighter text-slate-950 uppercase">
                                                    {log.car ? `${log.car.brand} ${log.car.model}` : 'PROTOCOLO_SISTEMA'}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {new Date(log.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                                            <p className="text-xs font-black italic uppercase tracking-[0.2em]" style={{ color: config.color }}>
                                                {log.action.replace(/_/g, ' ')}
                                            </p>
                                        </div>

                                        <p className="text-slate-600 font-bold text-lg leading-relaxed uppercase italic tracking-tight">
                                            {log.details}
                                        </p>

                                        <div className="mt-8 pt-6 border-t border-slate-50 flex gap-6">
                                            <button className="text-[9px] font-black uppercase text-primary hover:underline tracking-widest">Reporte_Completo</button>
                                            <button className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest">Hash_Audit: {log.id.slice(0, 8)}</button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <AlertCircle size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">No se encontraron registros</p>
                    </div>
                )}
            </div>
        </div>
    );
}
