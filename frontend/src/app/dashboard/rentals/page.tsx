"use client";

import { useState, useEffect } from "react";
import { useRentals, Rental } from "@/features/rentals/hooks/useRentals";
import { useCars } from "@/features/cars/hooks/useCars";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/utils/api/api.client";
import Link from "next/link";
import { CalendarDays, Key, CheckCircle2, XCircle, Clock, Plus, Car, Banknote, TrendingUp, Users, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RentalStats {
    total: number;
    byStatus: { active: number; pending: number; completed: number; cancelled: number };
    finance: { totalRevenue: number; totalPaid: number; pending: number; avgRental: number };
    topCars: { id: string; car: string; year: number; image: string | null; rentals: number }[];
    monthlyTrend: { month: string; count: number }[];
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    PENDING: { label: "Pendiente", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
    ACTIVE: { label: "Activo", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
    COMPLETED: { label: "Completado", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
    CANCELLED: { label: "Cancelado", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
};

export default function RentalsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";
    const { rentals, loading, fetchMyRentals, fetchAllRentals, createRental, updateStatus, addPayment } = useRentals();
    const { cars } = useCars("AVAILABLE");
    const [users, setUsers] = useState<any[]>([]);
    const [tab, setTab] = useState<string>("ALL");
    const [showCreate, setShowCreate] = useState(false);
    const [stats, setStats] = useState<RentalStats | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 8;

    useEffect(() => {
        if (isAdmin) {
            fetchAllRentals();
            apiClient.get("/admin/rentals/stats").then(r => setStats(r.data)).catch(() => {});
            apiClient.get("/user?role=USER&take=100").then(res => setUsers(res.data.data || res.data));
        } else {
            fetchMyRentals();
        }
    }, [isAdmin, fetchAllRentals, fetchMyRentals]);

    const filtered = tab === "ALL" ? rentals : rentals.filter(r => r.status === tab);
    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const pagedData = filtered.slice((page - 1) * perPage, page * perPage);

    const pieData = stats ? [
        { name: "Activos", value: stats.byStatus.active, color: "#3b82f6" },
        { name: "Pendientes", value: stats.byStatus.pending, color: "#f59e0b" },
        { name: "Completados", value: stats.byStatus.completed, color: "#22c55e" },
        { name: "Cancelados", value: stats.byStatus.cancelled, color: "#ef4444" },
    ].filter(d => d.value > 0) : [];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            {isAdmin && stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <KPI label="Total reservas" value={stats.total} color="slate" />
                    <KPI label="Activas" value={stats.byStatus.active} color="blue" />
                    <KPI label="Completadas" value={stats.byStatus.completed} color="emerald" />
                    <KPI label="Ingresos" value={`$${stats.finance.totalRevenue.toLocaleString()}`} color="emerald" />
                    <KPI label="Cobrado" value={`$${stats.finance.totalPaid.toLocaleString()}`} color="blue" />
                    <KPI label="Pendiente" value={`$${stats.finance.pending.toLocaleString()}`} color="amber" />
                </div>
            )}

            {/* Charts Row */}
            {isAdmin && stats && (
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
                        ) : <p className="text-xs text-slate-400 text-center py-10">Sin datos</p>}
                    </motion.div>

                    {/* Financial Summary */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="lg:col-span-4 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resumen financiero</h3>
                        <div className="space-y-3">
                            <FinRow label="Ingresos totales" value={`$${stats.finance.totalRevenue.toLocaleString()}`} />
                            <FinRow label="Total cobrado" value={`$${stats.finance.totalPaid.toLocaleString()}`} />
                            <FinRow label="Pendiente de cobro" value={`$${stats.finance.pending.toLocaleString()}`} highlight />
                            <FinRow label="Promedio por reserva" value={`$${Math.round(stats.finance.avgRental).toLocaleString()}`} />
                        </div>
                    </motion.div>

                    {/* Top Cars */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="lg:col-span-5 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vehículos más alquilados</h3>
                        <div className="space-y-2.5">
                            {stats.topCars.map((c, i) => (
                                <div key={c.id} className="flex items-center gap-3">
                                    <span className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black",
                                        i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-500"
                                    )}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate">{c.car}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">{c.year}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-blue-600">{c.rentals} alq.</p>
                                    </div>
                                </div>
                            ))}
                            {stats.topCars.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Sin datos</p>}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Monthly Trend */}
            {isAdmin && stats && stats.monthlyTrend.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reservas por mes</h3>
                    <div className="h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyTrend}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Header + Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Reservas</h1>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{filtered.length} registradas</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-white border border-black/5 rounded-xl shadow-sm">
                        {["ALL", "ACTIVE", "PENDING", "COMPLETED", "CANCELLED"].map(t => (
                            <button key={t} onClick={() => { setTab(t); setPage(1); }}
                                className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    tab === t ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}>
                                {t === "ALL" ? "Todas" : STATUS_CFG[t]?.label || t}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm active:scale-95">
                        <Plus size={14} /> Nueva
                    </button>
                </div>
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
                                {isAdmin && <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>}
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Periodo</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagado</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-10 bg-slate-100 rounded-lg animate-pulse" /></td></tr>
                                ))
                            ) : pagedData.length > 0 ? pagedData.map(rental => {
                                const cfg = STATUS_CFG[rental.status] || STATUS_CFG.PENDING;
                                const remaining = Number(rental.totalAmount) - Number(rental.paidAmount);
                                return (
                                    <tr key={rental.id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-7 rounded-lg bg-slate-50 overflow-hidden border border-black/5 flex items-center justify-center p-0.5">
                                                    {(rental.car as any)?.images?.[0] ? (
                                                        <img src={(rental.car as any).images[0]} alt="" className="w-full h-full object-contain" />
                                                    ) : <Car size={12} className="text-slate-300" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{rental.car?.brand} {rental.car?.model}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold">{rental.car?.plate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-5 py-3 text-xs font-bold text-slate-600">
                                                {rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : '—'}
                                            </td>
                                        )}
                                        <td className="px-5 py-3">
                                            <p className="text-[10px] font-bold text-slate-500">
                                                {new Date(rental.startDate).toLocaleDateString('es-ES')} → {new Date(rental.endDate).toLocaleDateString('es-ES')}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">${Number(rental.totalAmount).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs font-bold text-emerald-600">${Number(rental.paidAmount).toLocaleString()}</span>
                                            {remaining > 0 && (
                                                <span className="text-[9px] text-red-400 font-bold ml-1">(-${remaining.toLocaleString()})</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest", cfg.bg, cfg.color)}>
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {rental.status === "ACTIVE" && remaining > 0 && (
                                                    <button onClick={async () => { await addPayment(rental.id, remaining); window.location.reload(); }}
                                                        className="px-2 py-1 rounded-lg text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                                                        Pagar
                                                    </button>
                                                )}
                                                {rental.status === "ACTIVE" && (
                                                    <button onClick={async () => { await updateStatus(rental.id, "COMPLETED"); window.location.reload(); }}
                                                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}
                                                {(rental.status === "ACTIVE" || rental.status === "PENDING") && (
                                                    <button onClick={async () => { await updateStatus(rental.id, "CANCELLED"); window.location.reload(); }}
                                                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                                                        <XCircle size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400 font-bold">Sin reservas en esta categoría</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-400">{pagedData.length} de {filtered.length}</p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronLeft size={12} />
                        </button>
                        <span className="text-[10px] font-black text-slate-500 px-2">{page}/{totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Create Modal */}
            <AnimatePresence mode="wait">
                {showCreate && <CreateRentalModal cars={cars} users={users} isAdmin={isAdmin} onClose={() => setShowCreate(false)} onSubmit={createRental} />}
            </AnimatePresence>
        </div>
    );
}

function KPI({ label, value, color }: { label: string; value: any; color: string }) {
    const dots: Record<string, string> = { slate: 'bg-slate-400', emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500' };
    const texts: Record<string, string> = { slate: 'text-slate-900', emerald: 'text-emerald-600', blue: 'text-blue-600', amber: 'text-amber-600' };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", dots[color])} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className={cn("text-xl font-black tracking-tight", texts[color])}>{value}</p>
        </motion.div>
    );
}

function FinRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs font-bold text-slate-500">{label}</span>
            <span className={cn("text-xs font-black", highlight ? "text-amber-600" : "text-slate-900")}>{value}</span>
        </div>
    );
}

function CreateRentalModal({ cars, users, isAdmin, onClose, onSubmit }: {
    cars: any[]; users: any[]; isAdmin: boolean; onClose: () => void;
    onSubmit: (carId: string, userId: string | null, start: string, end: string, rate: number, paid: number) => Promise<any>;
}) {
    const [carId, setCarId] = useState("");
    const [userId, setUserId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dailyRate, setDailyRate] = useState(500);
    const [paidAmount, setPaidAmount] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)) : 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <motion.form initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={async (e) => { e.preventDefault(); setSubmitting(true); try { await onSubmit(carId, isAdmin ? userId : null, startDate, endDate, dailyRate, paidAmount); onClose(); window.location.reload(); } finally { setSubmitting(false); } }}
                className="bg-white p-6 w-full max-w-lg space-y-5 shadow-2xl rounded-2xl border border-black/5">

                <h2 className="text-lg font-black text-slate-900 tracking-tight">Nueva reserva</h2>

                <div className="space-y-4">
                    {isAdmin && (
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Cliente</label>
                            <select value={userId} onChange={(e) => setUserId(e.target.value)} required
                                className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option value="">Seleccionar...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.firstName || u.profile?.firstName} {u.lastName || u.profile?.lastName} ({u.email})</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Vehículo</label>
                        <select value={carId} onChange={(e) => setCarId(e.target.value)} required
                            className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                            <option value="">Seleccionar...</option>
                            {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.plate})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Inicio</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                                className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Fin</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
                                className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tarifa diaria ($)</label>
                            <input type="number" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} required
                                className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 block">Adelanto ($)</label>
                            <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} required
                                className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                        </div>
                    </div>

                    {days > 0 && (
                        <div className="p-4 bg-blue-50 rounded-xl text-center">
                            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">{days} días</p>
                            <p className="text-2xl font-black text-blue-600 tracking-tight">${(days * dailyRate).toLocaleString()}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                    <button type="submit" disabled={submitting}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-blue-600 transition-all disabled:opacity-50">
                        {submitting ? "..." : "Crear reserva"}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}
