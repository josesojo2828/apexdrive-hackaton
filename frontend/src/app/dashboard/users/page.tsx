"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/api.client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Users, Search, ChevronLeft, ChevronRight, Eye, Shield, TrendingUp, Wallet, Award } from "lucide-react";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface UserRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    profile?: { avatarUrl?: string };
    wallet?: { balance: number };
    _count: { rentals: number; bids: number; transactions: number };
}

interface UserStats {
    total: number;
    byRole: { admins: number; users: number };
    byStatus: { active: number; suspended: number; pending: number; banned: number };
    wallets: { totalBalance: number; avgBalance: number };
    topSpenders: { id: string; name: string; email: string; rentals: number; bids: number; totalSpent: number; walletBalance: number }[];
    registrationTrend: { month: string; count: number }[];
}

export default function UsersListPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const limit = 8;

    useEffect(() => {
        apiClient.get("/admin/users/stats").then(r => setStats(r.data)).catch(() => {});
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { page, limit };
            if (roleFilter) params.role = roleFilter;
            const { data } = await apiClient.get("/admin/users", { params });
            setUsers(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch { setUsers([]); }
        setLoading(false);
    }, [page, roleFilter]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filtered = search
        ? users.filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
        : users;

    const rolePieData = stats ? [
        { name: "Usuarios", value: stats.byRole.users, color: "#3b82f6" },
        { name: "Admins", value: stats.byRole.admins, color: "#8b5cf6" },
    ] : [];

    const statusBarData = stats ? [
        { name: "Activo", value: stats.byStatus.active, color: "#22c55e" },
        { name: "Suspendido", value: stats.byStatus.suspended, color: "#f59e0b" },
        { name: "Pendiente", value: stats.byStatus.pending, color: "#6b7280" },
        { name: "Bloqueado", value: stats.byStatus.banned, color: "#ef4444" },
    ] : [];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <UserKPI icon={<Users size={16} />} label="Total usuarios" value={stats.total} color="blue" />
                    <UserKPI icon={<Shield size={16} />} label="Activos" value={stats.byStatus.active} color="emerald" />
                    <UserKPI icon={<Wallet size={16} />} label="Balance total" value={`$${stats.wallets.totalBalance.toLocaleString()}`} color="amber" />
                    <UserKPI icon={<TrendingUp size={16} />} label="Balance promedio" value={`$${Math.round(stats.wallets.avgBalance).toLocaleString()}`} color="violet" />
                </div>
            )}

            {/* Charts Row */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Role Distribution */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Por rol</h3>
                        <div className="h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={rolePieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                                        {rolePieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-1">
                            {rolePieData.map(d => (
                                <div key={d.name} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-[9px] font-bold text-slate-500">{d.name} ({d.value})</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Status Distribution */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="lg:col-span-4 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Por estado</h3>
                        <div className="h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusBarData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                                        {statusBarData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Top Spenders */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="lg:col-span-5 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top usuarios por actividad</h3>
                        <div className="space-y-2.5">
                            {stats.topSpenders.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition-colors"
                                    onClick={() => router.push(`/dashboard/users/${u.id}`)}>
                                    <span className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black",
                                        i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-500"
                                    )}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate">{u.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">{u.rentals} alq. · {u.bids} pujas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-900">${u.totalSpent.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-emerald-500">W: ${u.walletBalance.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {stats.topSpenders.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-4">Sin datos</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Registrations Trend */}
            {stats && stats.registrationTrend.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Registros por mes</h3>
                    <div className="h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.registrationTrend}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Header + Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Lista de usuarios</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{total} registrados</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text" placeholder="Buscar..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-black/5 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1 p-1 bg-white border border-black/5 rounded-xl">
                        {["", "USER", "ADMIN"].map(r => (
                            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    roleFilter === r ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                                )}>
                                {r || "Todos"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-8 bg-slate-100 rounded-lg animate-pulse" /></td></tr>
                                ))
                            ) : filtered.length > 0 ? filtered.map(u => (
                                <tr key={u.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/users/${u.id}`)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-black/5">
                                                {u.profile?.avatarUrl ? <img src={u.profile.avatarUrl} className="w-full h-full object-cover" /> : <Users size={14} className="m-auto mt-2 text-slate-400" />}
                                            </div>
                                            <span className="text-xs font-black text-slate-900">{u.firstName} {u.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-medium text-slate-500">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                            u.role === 'ADMIN' ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
                                        )}>{u.role === 'ADMIN' ? 'Admin' : 'Usuario'}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                            u.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
                                            u.status === 'SUSPENDED' ? "bg-amber-50 text-amber-600" :
                                            "bg-slate-100 text-slate-500"
                                        )}>{u.status === 'ACTIVE' ? 'Activo' : u.status === 'SUSPENDED' ? 'Suspendido' : u.status}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-black text-slate-900">${Number(u.wallet?.balance || 0).toLocaleString()}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                            <span>{u._count.rentals} alq.</span>
                                            <span>{u._count.bids} pujas</span>
                                            <span>{u._count.transactions} tx</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400 font-bold">Sin resultados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-400">
                        Página {page} de {pages} · {total} usuarios
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all">
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button key={p} onClick={() => setPage(p)}
                                    className={cn("w-8 h-8 rounded-lg text-[10px] font-black transition-all",
                                        page === p ? "bg-slate-900 text-white" : "bg-white border border-black/5 text-slate-400 hover:text-slate-900"
                                    )}>{p}</button>
                            );
                        })}
                        {pages > 5 && <span className="text-slate-400 text-xs">...</span>}
                        <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                            className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function UserKPI({ icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
    const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', violet: 'bg-violet-50 text-violet-600' };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", colors[color])}>{icon}</div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
        </motion.div>
    );
}
