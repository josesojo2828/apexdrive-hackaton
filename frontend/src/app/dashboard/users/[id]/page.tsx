"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import {
    ArrowLeft, User, Wallet, Car, Gavel, Banknote, Clock,
    Mail, Phone, Shield, ChevronLeft, ChevronRight, Calendar,
    UserCheck, UserX, Crown, Activity
} from "lucide-react";
import {
    BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function UserDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'rentals' | 'bids' | 'transactions'>('rentals');
    const [tablePage, setTablePage] = useState(1);
    const [updating, setUpdating] = useState(false);
    const perPage = 5;

    const fetchUser = () => {
        apiClient.get(`/admin/users/${id}`).then(r => { setUser(r.data); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchUser(); }, [id]);

    const handleUpdateUser = async (field: string, value: string) => {
        setUpdating(true);
        try {
            await apiClient.patch(`/admin/users/${id}`, { [field]: value });
            fetchUser();
        } catch (e) { console.error(e); }
        setUpdating(false);
    };

    if (loading) return (
        <div className="p-8 space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse" />)}
        </div>
    );

    if (!user) return (
        <div className="p-8 text-center">
            <p className="text-sm text-slate-400 font-bold">Usuario no encontrado</p>
            <button onClick={() => router.back()} className="mt-4 text-xs font-bold text-blue-600 underline">Volver</button>
        </div>
    );

    const walletBalance = Number(user.wallet?.balance || 0);
    const totalRentalSpend = user.rentals?.reduce((s: number, r: any) => s + Number(r.totalAmount), 0) || 0;
    const totalBids = user.bids?.length || 0;
    const auctionsWon = user.auctionsWon?.length || 0;
    const totalTxVolume = user.transactions?.reduce((s: number, t: any) => s + Number(t.amount), 0) || 0;

    // Chart data
    const txByType: Record<string, number> = {};
    user.transactions?.forEach((t: any) => {
        const label = t.type.replace(/_/g, ' ');
        txByType[label] = (txByType[label] || 0) + 1;
    });
    const txChartData = Object.entries(txByType).map(([name, count]) => ({ name, count }));
    const barColors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];

    // Activity timeline - merge all events
    const timeline = [
        ...(user.rentals?.map((r: any) => ({ date: r.createdAt, type: 'rental', text: `Alquiler: ${r.car?.brand} ${r.car?.model}`, sub: `$${Number(r.totalAmount).toLocaleString()} · ${r.status}` })) || []),
        ...(user.bids?.map((b: any) => ({ date: b.createdAt, type: 'bid', text: `Puja: ${b.auction?.car?.brand} ${b.auction?.car?.model}`, sub: `$${Number(b.amount).toLocaleString()}` })) || []),
        ...(user.transactions?.map((t: any) => ({ date: t.createdAt, type: 'tx', text: t.type.replace(/_/g, ' '), sub: `$${Number(t.amount).toLocaleString()} · ${t.status}` })) || []),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

    // Pagination
    const tabData = tab === 'rentals' ? (user.rentals || []) : tab === 'bids' ? (user.bids || []) : (user.transactions || []);
    const totalPages = Math.ceil(tabData.length / perPage) || 1;
    const pagedData = tabData.slice((tablePage - 1) * perPage, tablePage * perPage);

    const statusOptions = ['ACTIVE', 'SUSPENDED', 'BANNED'];
    const statusLabels: Record<string, string> = { ACTIVE: 'Activo', SUSPENDED: 'Suspendido', BANNED: 'Bloqueado', PENDING_VERIFICATION: 'Pendiente' };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center bg-white rounded-xl border border-black/5 shadow-sm hover:border-blue-500/30 transition-all">
                    <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 overflow-hidden border-2 border-white shadow-lg flex items-center justify-center">
                        {user.profile?.avatarUrl ? <img src={user.profile.avatarUrl} className="w-full h-full object-cover" /> :
                            <span className="text-xl font-black text-white">{user.firstName?.[0]}{user.lastName?.[0]}</span>}
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                            {user.phone && <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Phone size={10} /> {user.phone}</span>}
                        </div>
                    </div>
                </div>
                {/* Role & Status Badges */}
                <div className="flex items-center gap-2">
                    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        user.role === 'ADMIN' ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"
                    )}>{user.role === 'ADMIN' ? '👑 Admin' : 'Usuario'}</span>
                    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        user.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-600" :
                        user.status === 'SUSPENDED' ? "bg-amber-100 text-amber-600" :
                        user.status === 'BANNED' ? "bg-red-100 text-red-600" :
                        "bg-slate-100 text-slate-500"
                    )}>{statusLabels[user.status] || user.status}</span>
                </div>
            </div>

            {/* Profile Info + Admin Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Información del perfil</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow icon={<Mail size={14} />} label="Email" value={user.email} />
                        <InfoRow icon={<Phone size={14} />} label="Teléfono" value={user.phone || 'No registrado'} />
                        <InfoRow icon={<Calendar size={14} />} label="Registrado" value={new Date(user.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} />
                        <InfoRow icon={<Shield size={14} />} label="Rol" value={user.role === 'ADMIN' ? 'Administrador' : 'Usuario'} />
                        <InfoRow icon={<Activity size={14} />} label="Estado" value={statusLabels[user.status] || user.status} />
                        <InfoRow icon={<Wallet size={14} />} label="Balance wallet" value={`$${walletBalance.toLocaleString()}`} />
                    </div>
                </motion.div>

                {/* Admin Actions */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="lg:col-span-5 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Acciones de administrador</h3>
                    <div className="space-y-4">
                        {/* Change Status */}
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cambiar estado</p>
                            <div className="flex gap-2">
                                {statusOptions.map(s => (
                                    <button key={s} onClick={() => handleUpdateUser('status', s)} disabled={updating || user.status === s}
                                        className={cn("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                                            user.status === s ? "bg-slate-900 text-white border-slate-900" : "bg-white border-black/5 text-slate-400 hover:border-slate-300 hover:text-slate-600",
                                            updating && "opacity-50 cursor-not-allowed"
                                        )}>
                                        {s === 'ACTIVE' && <UserCheck size={12} className="inline mr-1" />}
                                        {s === 'SUSPENDED' && <Clock size={12} className="inline mr-1" />}
                                        {s === 'BANNED' && <UserX size={12} className="inline mr-1" />}
                                        {statusLabels[s]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Change Role */}
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cambiar rol</p>
                            <div className="flex gap-2">
                                {['USER', 'ADMIN'].map(r => (
                                    <button key={r} onClick={() => handleUpdateUser('role', r)} disabled={updating || user.role === r}
                                        className={cn("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                                            user.role === r ? "bg-slate-900 text-white border-slate-900" : "bg-white border-black/5 text-slate-400 hover:border-slate-300 hover:text-slate-600",
                                            updating && "opacity-50 cursor-not-allowed"
                                        )}>
                                        {r === 'ADMIN' && <Crown size={12} className="inline mr-1" />}
                                        {r === 'USER' && <User size={12} className="inline mr-1" />}
                                        {r === 'ADMIN' ? 'Admin' : 'Usuario'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resumen rápido</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-lg font-black text-slate-900">{user.rentals?.length || 0}</p>
                                    <p className="text-[8px] font-bold text-slate-400">Alquileres</p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-lg font-black text-slate-900">{totalBids}</p>
                                    <p className="text-[8px] font-bold text-slate-400">Pujas</p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-lg font-black text-slate-900">{auctionsWon}</p>
                                    <p className="text-[8px] font-bold text-slate-400">Ganadas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <MiniKPI icon={<Wallet size={16} />} label="Wallet" value={`$${walletBalance.toLocaleString()}`} color="blue" />
                <MiniKPI icon={<Car size={16} />} label="Gasto alq." value={`$${totalRentalSpend.toLocaleString()}`} color="emerald" />
                <MiniKPI icon={<Gavel size={16} />} label="Pujas" value={totalBids} color="amber" />
                <MiniKPI icon={<Shield size={16} />} label="Ganadas" value={auctionsWon} color="violet" />
                <MiniKPI icon={<Banknote size={16} />} label="Vol. pagos" value={`$${totalTxVolume.toLocaleString()}`} color="emerald" />
            </div>

            {/* Charts + Timeline Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Activity Chart */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Transacciones por tipo</h3>
                    {txChartData.length > 0 ? (
                        <div className="h-[160px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={txChartData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={30}>
                                        {txChartData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-10">Sin transacciones</p>
                    )}
                </motion.div>

                {/* Activity Timeline */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Actividad reciente</h3>
                    {timeline.length > 0 ? (
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                            {timeline.map((item, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                                            item.type === 'rental' ? "bg-blue-500" : item.type === 'bid' ? "bg-amber-500" : "bg-emerald-500"
                                        )} />
                                        {i < timeline.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                                    </div>
                                    <div className="pb-3 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-slate-900 truncate">{item.text}</p>
                                            <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex-shrink-0",
                                                item.type === 'rental' ? "bg-blue-50 text-blue-600" :
                                                item.type === 'bid' ? "bg-amber-50 text-amber-600" :
                                                "bg-emerald-50 text-emerald-600"
                                            )}>{item.type === 'rental' ? 'Alq.' : item.type === 'bid' ? 'Puja' : 'Tx'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] font-bold text-slate-400">{item.sub}</p>
                                            <span className="text-[9px] text-slate-300">·</span>
                                            <p className="text-[9px] text-slate-300 font-bold">{new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-10">Sin actividad registrada</p>
                    )}
                </motion.div>
            </div>

            {/* Financial Summary */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resumen financiero</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FinanceBox label="Gasto en alquileres" value={`$${totalRentalSpend.toLocaleString()}`} icon={<Car size={16} />} color="blue" />
                    <FinanceBox label="Balance wallet" value={`$${walletBalance.toLocaleString()}`} icon={<Wallet size={16} />} color="emerald" />
                    <FinanceBox label="Volumen transacciones" value={`$${totalTxVolume.toLocaleString()}`} icon={<Banknote size={16} />} color="amber" />
                    <FinanceBox label="Subastas ganadas" value={String(auctionsWon)} icon={<Gavel size={16} />} color="violet" />
                </div>
            </motion.div>

            {/* Tabbed Data Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="flex items-center gap-1 p-2 border-b border-slate-100">
                    {(['rentals', 'bids', 'transactions'] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setTablePage(1); }}
                            className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                tab === t ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}>
                            {t === 'rentals' ? 'Alquileres' : t === 'bids' ? 'Pujas' : 'Transacciones'}
                            <span className="ml-1.5 text-[9px] opacity-60">({tab === t ? tabData.length : (t === 'rentals' ? user.rentals?.length : t === 'bids' ? user.bids?.length : user.transactions?.length) || 0})</span>
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {tab === 'rentals' && <>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inicio</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fin</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagado</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                </>}
                                {tab === 'bids' && <>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subasta</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                </>}
                                {tab === 'transactions' && <>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                </>}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.length > 0 ? pagedData.map((item: any, i: number) => (
                                <tr key={item.id || i} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors">
                                    {tab === 'rentals' && <>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">{item.car?.brand} {item.car?.model}</td>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-500">{new Date(item.startDate).toLocaleDateString('es-ES')}</td>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-500">{new Date(item.endDate).toLocaleDateString('es-ES')}</td>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">${Number(item.totalAmount).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-xs font-bold text-emerald-600">${Number(item.paidAmount || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                                item.status === 'ACTIVE' ? "bg-blue-50 text-blue-600" :
                                                item.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                                "bg-slate-100 text-slate-500"
                                            )}>{item.status === 'ACTIVE' ? 'Activo' : item.status === 'COMPLETED' ? 'Completado' : item.status}</span>
                                        </td>
                                    </>}
                                    {tab === 'bids' && <>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-500">#{item.auctionId?.slice(0, 8)}</td>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">{item.auction?.car?.brand} {item.auction?.car?.model}</td>
                                        <td className="px-5 py-3 text-xs font-black text-amber-600">${Number(item.amount).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-500">{new Date(item.createdAt).toLocaleDateString('es-ES')}</td>
                                    </>}
                                    {tab === 'transactions' && <>
                                        <td className="px-5 py-3">
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">{item.type.replace(/_/g, ' ')}</span>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-black text-slate-900">${Number(item.amount).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                                item.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>{item.status === 'COMPLETED' ? 'OK' : item.status}</span>
                                        </td>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-500 max-w-[200px] truncate">{item.description || '—'}</td>
                                        <td className="px-5 py-3 text-[10px] font-bold text-slate-400">{new Date(item.createdAt).toLocaleDateString('es-ES')}</td>
                                    </>}
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="py-10 text-center text-xs text-slate-400 font-bold">Sin datos en esta categoría</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-400">{pagedData.length} de {tabData.length}</p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setTablePage(p => Math.max(1, p - 1))} disabled={tablePage === 1}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronLeft size={12} />
                        </button>
                        <span className="text-[10px] font-black text-slate-500 px-2">{tablePage}/{totalPages}</span>
                        <button onClick={() => setTablePage(p => Math.min(totalPages, p + 1))} disabled={tablePage === totalPages}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Auctions Won */}
            {user.auctionsWon?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Subastas ganadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.auctionsWon.map((a: any) => (
                            <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Gavel size={16} className="text-amber-500" />
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-900">{a.car?.brand} {a.car?.model}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Final: ${Number(a.currentPrice).toLocaleString()}</p>
                                </div>
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Ganada</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function MiniKPI({ icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
    const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', violet: 'bg-violet-50 text-violet-600' };
    return (
        <div className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", colors[color])}>{icon}</div>
            <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="p-1.5 bg-white rounded-lg text-slate-400 shadow-sm">{icon}</div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-bold text-slate-900 truncate">{value}</p>
            </div>
        </div>
    );
}

function FinanceBox({ label, value, icon, color }: { label: string; value: string; icon: any; color: string }) {
    const bgColors: Record<string, string> = { blue: 'bg-blue-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50', violet: 'bg-violet-50' };
    const textColors: Record<string, string> = { blue: 'text-blue-600', emerald: 'text-emerald-600', amber: 'text-amber-600', violet: 'text-violet-600' };
    return (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2", bgColors[color], textColors[color])}>{icon}</div>
            <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
        </div>
    );
}
