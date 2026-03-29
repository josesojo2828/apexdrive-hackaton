"use client";

import { useState, useEffect } from "react";
import { useAuctions, Auction } from "@/features/auctions/hooks/useAuctions";
import { useCars } from "@/features/cars/hooks/useCars";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/utils/api/api.client";
import { Gavel, Clock, Users, ChevronRight, Filter, Plus, Edit2, Eye, Calendar, DollarSign, TrendingUp, Award, Activity, Banknote } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface AuctionStats {
    total: number;
    byStatus: { active: number; upcoming: number; resolved: number; cancelled: number };
    bids: { total: number; totalVolume: number; avgBid: number };
    pricing: { totalValue: number; avgPrice: number };
    topAuctions: { id: string; car: string; year: number; image: string | null; status: string; startingPrice: number; currentPrice: number; bidsCount: number; winner: string | null }[];
    monthlyTrend: { month: string; count: number }[];
}

interface CountdownProps { endDate: string; }
export function SimpleCountdown({ endDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const tick = () => {
            const diff = new Date(endDate).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft("Cerrada"); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            if (d > 0) setTimeLeft(`${d}d ${h}h`);
            else setTimeLeft(`${h}h ${m}m ${s}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    return (
        <div className={cn("inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-tight", 
            timeLeft === "Cerrada" ? "text-rose-500" : "text-slate-500")}>
            <Clock size={10} className={cn(timeLeft !== "Cerrada" && "animate-pulse")} />
            {timeLeft}
        </div>
    );
}

export default function AuctionsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";
    const { auctions, loading, createAuction, updateAuction, fetchAuctions } = useAuctions();
    const { cars } = useCars("AVAILABLE");
    const [tab, setTab] = useState<"ACTIVE" | "UPCOMING" | "RESOLVED" | "ALL">("ALL");
    const [showCreate, setShowCreate] = useState(false);
    const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
    const [stats, setStats] = useState<AuctionStats | null>(null);

    useEffect(() => {
        apiClient.get("/admin/auctions/stats").then(r => setStats(r.data)).catch(() => {});
    }, []);

    const filtered = tab === "ALL" ? auctions : auctions.filter(a => a.status === tab);

    const statusLabels: Record<string, string> = { ACTIVE: 'Activa', UPCOMING: 'Próxima', RESOLVED: 'Resuelta', CANCELLED: 'Cancelada' };

    const pieData = stats ? [
        { name: "Activas", value: stats.byStatus.active, color: "#22c55e" },
        { name: "Próximas", value: stats.byStatus.upcoming, color: "#f59e0b" },
        { name: "Resueltas", value: stats.byStatus.resolved, color: "#6b7280" },
        { name: "Canceladas", value: stats.byStatus.cancelled, color: "#ef4444" },
    ].filter(d => d.value > 0) : [];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard label="Total subastas" value={stats.total} color="slate" />
                    <StatCard label="Activas" value={stats.byStatus.active} color="emerald" />
                    <StatCard label="Próximas" value={stats.byStatus.upcoming} color="amber" />
                    <StatCard label="Resueltas" value={stats.byStatus.resolved} color="slate" />
                    <StatCard label="Total pujas" value={stats.bids.total} color="blue" />
                    <StatCard label="Vol. pujas" value={`$${stats.bids.totalVolume.toLocaleString()}`} color="violet" />
                </div>
            )}

            {/* Charts Row */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Status Distribution */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Por estado</h3>
                        {pieData.length > 0 ? (
                            <>
                                <div className="h-[120px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                                                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3 mt-1">
                                    {pieData.map(d => (
                                        <div key={d.name} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                            <span className="text-[9px] font-bold text-slate-500">{d.name} ({d.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-10">Sin datos</p>
                        )}
                    </motion.div>

                    {/* Financial Summary */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="lg:col-span-4 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resumen financiero</h3>
                        <div className="space-y-3">
                            <FinanceRow label="Valor total subastas" value={`$${stats.pricing.totalValue.toLocaleString()}`} />
                            <FinanceRow label="Precio promedio" value={`$${Math.round(stats.pricing.avgPrice).toLocaleString()}`} />
                            <FinanceRow label="Volumen total pujas" value={`$${stats.bids.totalVolume.toLocaleString()}`} />
                            <FinanceRow label="Puja promedio" value={`$${Math.round(stats.bids.avgBid).toLocaleString()}`} />
                            <FinanceRow label="Total pujas realizadas" value={stats.bids.total} />
                        </div>
                    </motion.div>

                    {/* Top Auctions */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="lg:col-span-5 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top subastas por valor</h3>
                        <div className="space-y-2.5">
                            {stats.topAuctions.map((a, i) => (
                                <Link key={a.id} href={`/dashboard/auctions/${a.id}`}
                                    className="flex items-center gap-3 group hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition-colors">
                                    <span className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black",
                                        i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-500"
                                    )}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate">{a.car}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-slate-400 font-bold">{a.bidsCount} pujas</span>
                                            <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                a.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
                                                a.status === 'RESOLVED' ? "bg-slate-100 text-slate-500" :
                                                "bg-amber-50 text-amber-600"
                                            )}>{statusLabels[a.status] || a.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-900">${a.currentPrice.toLocaleString()}</p>
                                        {a.winner && <p className="text-[9px] font-bold text-emerald-500">{a.winner}</p>}
                                    </div>
                                </Link>
                            ))}
                            {stats.topAuctions.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-4">Sin subastas</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Monthly Trend */}
            {stats && stats.monthlyTrend.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subastas por mes</h3>
                    <div className="h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyTrend}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Header + Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Subastas</h1>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{auctions.length} registradas</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-white border border-black/5 rounded-xl shadow-sm">
                        {(["ALL", "ACTIVE", "UPCOMING", "RESOLVED"] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    tab === t ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}>
                                {t === 'ALL' ? 'Todas' : statusLabels[t] || t}
                            </button>
                        ))}
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm active:scale-95">
                            <Plus size={14} /> Nueva subasta
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio inicial</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio actual</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Último postor</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cierre</th>
                            <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-10 bg-slate-100 rounded-lg animate-pulse" /></td></tr>
                             ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400 font-bold">Sin subastas en esta categoría</td></tr>
                        ) : (
                            filtered.map((auction) => {
                                const highestBid = auction.bids && auction.bids.length > 0 ? auction.bids[0] : null;
                                return (
                                    <tr key={auction.id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded-lg bg-slate-50 overflow-hidden border border-black/5 flex items-center justify-center p-0.5">
                                                    {auction.car?.images?.[0] ? (
                                                        <img src={auction.car.images[0]} alt="" className="w-full h-full object-contain" />
                                                    ) : <Gavel size={14} className="text-slate-300" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{auction.car?.brand} {auction.car?.model}</p>
                                                    <p className="text-[9px] font-bold text-slate-400">{auction.car?.year}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                                auction.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" :
                                                auction.status === "RESOLVED" ? "bg-slate-100 text-slate-500" :
                                                auction.status === "UPCOMING" ? "bg-amber-50 text-amber-600" :
                                                "bg-red-50 text-red-500"
                                            )}>{statusLabels[auction.status] || auction.status}</span>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-bold text-slate-400">${Number(auction.startingPrice).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">${Number(auction.currentPrice).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            {highestBid ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                                        <Users size={10} className="text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">
                                                        {highestBid.user?.firstName} {highestBid.user?.lastName}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-300">Sin ofertas</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <SimpleCountdown endDate={auction.endDate} />
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/auctions/${auction.id}`}
                                                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                                                    <Eye size={14} />
                                                </Link>
                                                {isAdmin && (
                                                    <button onClick={() => setEditingAuction(auction)}
                                                        className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all">
                                                        <Edit2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence mode="wait">
                {showCreate && (
                    <SimpleFormModal 
                        title="Nueva subasta" 
                        cars={cars} 
                        onClose={() => setShowCreate(false)} 
                        onSubmit={async (data) => {
                            await createAuction(data.carId, data.startingPrice, undefined, data.endDate, data.status);
                            setShowCreate(false);
                        }}
                    />
                )}
                {editingAuction && (
                    <SimpleFormModal 
                        title="Editar subasta" 
                        cars={cars} 
                        isEdit
                        initialData={editingAuction}
                        onClose={() => setEditingAuction(null)} 
                        onSubmit={async (data) => {
                            await updateAuction(editingAuction.id, data);
                            setEditingAuction(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
    const dotColors: Record<string, string> = { slate: 'bg-slate-400', emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', violet: 'bg-violet-500' };
    const textColors: Record<string, string> = { slate: 'text-slate-900', emerald: 'text-emerald-600', blue: 'text-blue-600', amber: 'text-amber-600', violet: 'text-violet-600' };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", dotColors[color])} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className={cn("text-xl font-black tracking-tight", textColors[color])}>{value}</p>
        </motion.div>
    );
}

function FinanceRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs font-bold text-slate-500">{label}</span>
            <span className="text-xs font-black text-slate-900">{value}</span>
        </div>
    );
}

function SimpleFormModal({ title, cars, isEdit, initialData, onClose, onSubmit }: any) {
    const [carId, setCarId] = useState(initialData?.carId || "");
    const [price, setPrice] = useState(initialData?.startingPrice || 0);
    const [endDate, setEndDate] = useState(initialData?.endDate ? initialData.endDate.substring(0, 16) : "");
    const [status, setStatus] = useState(initialData?.status || "ACTIVE");
    const [loading, setLoading] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.form 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 border border-black/5"
                onClick={e => e.stopPropagation()}
                onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                        await onSubmit({ carId, startingPrice: price, endDate, status });
                    } finally { setLoading(false); }
                }}
            >
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Vehículo</label>
                        <select value={carId} onChange={e => setCarId(e.target.value)}
                            className="w-full bg-slate-50 border border-black/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                            <option value="">Seleccionar...</option>
                            {cars.map((c: any) => <option key={c.id} value={c.id}>{c.brand} {c.model} - {c.year} [{c.plate}]</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Precio inicial</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-black/5 rounded-xl pl-8 pr-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Fecha cierre</label>
                            <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-black/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5">
                        <input type="checkbox" id="enabled" checked={status === "ACTIVE"}
                            onChange={e => setStatus(e.target.checked ? "ACTIVE" : "UPCOMING")}
                            className="w-4 h-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="enabled" className="text-xs font-bold text-slate-600 cursor-pointer">Activar inmediatamente</label>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                    <button type="submit" disabled={loading}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-blue-600 transition-all disabled:opacity-50">
                        {loading ? "..." : isEdit ? "Actualizar" : "Crear subasta"}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}
