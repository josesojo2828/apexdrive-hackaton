"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import {
    Banknote, Wallet, TrendingUp, TrendingDown, DollarSign, CreditCard, 
    ArrowUpRight, ArrowDownRight, Users, Gavel, Car, ChevronLeft, ChevronRight, Activity
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area, CartesianGrid, Legend
} from "recharts";

interface FinanceData {
    overview: {
        totalRevenue: number; totalPaid: number; pendingPayments: number;
        totalTxVolume: number; totalWallets: number; totalAuctionValue: number;
        avgRental: number; avgTransaction: number; avgWallet: number;
        totalTxCount: number; totalWalletCount: number;
    };
    txByType: { type: string; count: number; volume: number }[];
    txByStatus: { status: string; count: number; volume: number }[];
    topSpenders: { id: string; name: string; rentalSpend: number; txVolume: number; walletBalance: number }[];
    monthlyFlow: { month: string; rentals: number; transactions: number; total: number }[];
    recentTransactions: { id: string; type: string; amount: number; status: string; user: string | null; date: string; description: string }[];
}

const typeLabels: Record<string, string> = {
    WALLET_TOPUP: "Carga wallet", RENTAL_PAYMENT: "Pago alquiler", AUCTION_PAYMENT: "Pago subasta",
    REFUND: "Reembolso", DEPOSIT: "Depósito", WITHDRAWAL: "Retiro",
};
const statusLabels: Record<string, string> = {
    COMPLETED: "Completada", PENDING: "Pendiente", FAILED: "Fallida", REFUNDED: "Reembolsada",
};

export default function FinancePage() {
    const router = useRouter();
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [txPage, setTxPage] = useState(1);
    const txPerPage = 8;

    useEffect(() => {
        apiClient.get("/admin/finance/stats").then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6 p-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse" />)}
        </div>
    );

    if (!data) return (
        <div className="text-center py-20">
            <p className="text-sm text-slate-400 font-bold">No se pudieron cargar las finanzas</p>
        </div>
    );

    const o = data.overview;
    const pieColors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
    const txPageData = data.recentTransactions.slice((txPage - 1) * txPerPage, txPage * txPerPage);
    const txTotalPages = Math.ceil(data.recentTransactions.length / txPerPage) || 1;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Banknote size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Centro financiero</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vista consolidada de ingresos, pagos y transacciones</p>
                    </div>
                </div>
            </div>

            {/* Main KPIs - 2 rows */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <FinKPI icon={<DollarSign size={16} />} label="Ingresos totales" value={`$${o.totalRevenue.toLocaleString()}`} color="emerald" trend="up" />
                <FinKPI icon={<CreditCard size={16} />} label="Total cobrado" value={`$${o.totalPaid.toLocaleString()}`} color="blue" trend="up" />
                <FinKPI icon={<TrendingDown size={16} />} label="Pendiente cobro" value={`$${o.pendingPayments.toLocaleString()}`} color="amber" trend={o.pendingPayments > 0 ? "down" : "neutral"} />
                <FinKPI icon={<Activity size={16} />} label="Vol. transacciones" value={`$${o.totalTxVolume.toLocaleString()}`} color="violet" />
                <FinKPI icon={<Wallet size={16} />} label="Wallets activas" value={`$${o.totalWallets.toLocaleString()}`} color="blue" sub={`${o.totalWalletCount} wallets`} />
                <FinKPI icon={<Gavel size={16} />} label="Valor subastas" value={`$${o.totalAuctionValue.toLocaleString()}`} color="amber" />
            </div>

            {/* Averages Row */}
            <div className="grid grid-cols-3 gap-3">
                <AvgCard label="Promedio por alquiler" value={`$${Math.round(o.avgRental).toLocaleString()}`} icon={<Car size={14} />} />
                <AvgCard label="Promedio por transacción" value={`$${Math.round(o.avgTransaction).toLocaleString()}`} icon={<CreditCard size={14} />} />
                <AvgCard label="Promedio wallet" value={`$${Math.round(o.avgWallet).toLocaleString()}`} icon={<Wallet size={14} />} />
            </div>

            {/* Revenue Flow Chart */}
            {data.monthlyFlow.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Flujo mensual de ingresos</h3>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthlyFlow}>
                                <defs>
                                    <linearGradient id="gradRentals" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradTx" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                                <Area type="monotone" dataKey="rentals" name="Alquileres" stroke="#3b82f6" fill="url(#gradRentals)" strokeWidth={2} />
                                <Area type="monotone" dataKey="transactions" name="Transacciones" stroke="#22c55e" fill="url(#gradTx)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Tx by Type */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="lg:col-span-4 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Volumen por tipo</h3>
                    {data.txByType.length > 0 ? (
                        <>
                            <div className="h-[160px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={data.txByType.map(t => ({ ...t, name: typeLabels[t.type] || t.type }))} dataKey="volume" cx="50%" cy="50%" innerRadius={35} outerRadius={60} strokeWidth={0}>
                                            {data.txByType.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }}
                                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-1.5 mt-2">
                                {data.txByType.map((t, i) => (
                                    <div key={t.type} className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                                            <span className="text-[9px] font-bold text-slate-500">{typeLabels[t.type] || t.type}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-700">${t.volume.toLocaleString()} ({t.count})</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : <p className="text-xs text-slate-400 text-center py-10">Sin datos</p>}
                </motion.div>

                {/* Tx by Status */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-3 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Por estado</h3>
                    {data.txByStatus.length > 0 ? (
                        <div className="h-[160px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.txByStatus.map(s => ({ ...s, name: statusLabels[s.status] || s.status }))}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 700 }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                    <Bar dataKey="volume" radius={[6, 6, 0, 0]} barSize={28}>
                                        {data.txByStatus.map((s, i) => (
                                            <Cell key={i} fill={s.status === 'COMPLETED' ? '#22c55e' : s.status === 'PENDING' ? '#f59e0b' : s.status === 'FAILED' ? '#ef4444' : '#6b7280'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <p className="text-xs text-slate-400 text-center py-10">Sin datos</p>}
                    <div className="space-y-1.5 mt-3">
                        {data.txByStatus.map(s => (
                            <div key={s.status} className="flex items-center justify-between">
                                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                    s.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                    s.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                                    "bg-red-50 text-red-500"
                                )}>{statusLabels[s.status] || s.status}</span>
                                <span className="text-[9px] font-black text-slate-700">{s.count} tx</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Spenders */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="lg:col-span-5 bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top clientes por gasto</h3>
                    <div className="space-y-3">
                        {data.topSpenders.map((u, i) => (
                            <div key={u.id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition-colors"
                                onClick={() => router.push(`/dashboard/users/${u.id}`)}>
                                <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                                    i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : "bg-orange-100 text-orange-500"
                                )}>{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-900 truncate">{u.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold">W: ${u.walletBalance.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-emerald-600">${u.rentalSpend.toLocaleString()}</p>
                                    <p className="text-[9px] text-slate-400 font-bold">Tx: ${u.txVolume.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        {data.topSpenders.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Sin datos</p>}
                    </div>
                </motion.div>
            </div>

            {/* Recent Transactions Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Últimas transacciones</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txPageData.length > 0 ? txPageData.map(tx => (
                                <tr key={tx.id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                                            {typeLabels[tx.type] || tx.type.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={cn("text-xs font-black",
                                            tx.type === 'REFUND' || tx.type === 'WITHDRAWAL' ? "text-red-500" : "text-emerald-600"
                                        )}>
                                            {tx.type === 'REFUND' || tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                            tx.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                            tx.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                                            "bg-red-50 text-red-500"
                                        )}>{statusLabels[tx.status] || tx.status}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-bold text-slate-600">{tx.user || '—'}</td>
                                    <td className="px-5 py-3 text-[10px] font-bold text-slate-400 max-w-[200px] truncate">{tx.description || '—'}</td>
                                    <td className="px-5 py-3 text-[10px] font-bold text-slate-400">
                                        {new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-bold">Sin transacciones</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-400">{txPageData.length} de {data.recentTransactions.length}</p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronLeft size={12} />
                        </button>
                        <span className="text-[10px] font-black text-slate-500 px-2">{txPage}/{txTotalPages}</span>
                        <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages}
                            className="w-7 h-7 rounded-lg bg-white border border-black/5 flex items-center justify-center text-slate-400 disabled:opacity-30">
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FinKPI({ icon, label, value, color, trend, sub }: { icon: any; label: string; value: string; color: string; trend?: string; sub?: string }) {
    const bgColors: Record<string, string> = { emerald: 'bg-emerald-50', blue: 'bg-blue-50', amber: 'bg-amber-50', violet: 'bg-violet-50' };
    const textColors: Record<string, string> = { emerald: 'text-emerald-600', blue: 'text-blue-600', amber: 'text-amber-600', violet: 'text-violet-600' };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", bgColors[color], textColors[color])}>{icon}</div>
                {trend === 'up' && <ArrowUpRight size={14} className="text-emerald-500" />}
                {trend === 'down' && <ArrowDownRight size={14} className="text-red-400" />}
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
            {sub && <p className="text-[8px] font-bold text-slate-300 mt-0.5">{sub}</p>}
        </motion.div>
    );
}

function AvgCard({ label, value, icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="bg-white rounded-xl p-4 border border-black/5 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
            <div>
                <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}
