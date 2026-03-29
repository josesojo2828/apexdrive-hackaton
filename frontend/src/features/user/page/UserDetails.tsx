"use client";

import { useEntityDetail } from "@/features/dashboard/hooks/useEntityDetail";
import { ActivityTimeline } from "@/features/dashboard/components/ActivityTimeline";
import { AdvancedSkeleton } from "@/features/dashboard/components/AdvancedSkeleton";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ReportTemplate } from "@/features/dashboard/components/ReportTemplate";
import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { History, MapPin, Truck, Calendar, Mail, Phone, Clock } from "lucide-react";
import { IUser } from "@/types/user/user";

export default function UserDetail({ id }: { id: string }) {
    const { data: user, loading } = useEntityDetail<IUser>('user', id);
    const [activeTab, setActiveTab] = useState<'profile' | 'trips'>('profile');
    const role = user?.role?.toLowerCase();
    const showTrips = role === 'business' || role === 'workshop' || role === 'driver';

    if (loading) return <AdvancedSkeleton type="info" rows={10} />;

    return (
        <div className="space-y-8">
            {/* Tabs Selector */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'profile' ? "bg-white text-brand-blue shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Información General
                </button>
                {showTrips && (
                    <button
                        onClick={() => setActiveTab('trips')}
                        className={cn(
                            "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'trips' ? "bg-white text-brand-blue shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Carreras Realizadas
                    </button>
                )}
            </div>

            {activeTab === 'profile' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 p-1 mb-6 flex items-center justify-center">
                                    <div className="w-full h-full rounded-xl bg-brand-blue flex items-center justify-center text-3xl font-black text-white uppercase tracking-tighter">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </div>
                                </div>
                                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-[10px] font-black uppercase tracking-widest">
                                    {user?.role}
                                </div>
                                <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                    Estado: <span className={cn("font-black", user && user.status ? 'text-emerald-500' : 'text-rose-500')}>{user?.status}</span>
                                </div>
                            </div>

                            <div className="mt-10 space-y-5 pt-8 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <DynamicIcon name="Mail" className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Email</p>
                                        <p className="text-xs font-bold text-slate-700">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <DynamicIcon name="Phone" className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Teléfono</p>
                                        <p className="text-xs font-bold text-slate-700">{user?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <DynamicIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Miembro desde</p>
                                        <p className="text-xs font-bold text-slate-700">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Bitacora */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 px-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                                <DynamicIcon name="History" className="w-4 h-4 opacity-70" />
                            </div>
                            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] italic">
                                PROTOCOL_BITACORA // USER_ACTIVITY_LOG
                            </h2>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-h-[600px] overflow-y-auto scrollbar-hide">
                            <ActivityTimeline userId={id} limit={20} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">Historial de Carreras</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Gestión de servicios solicitados e impartidos</p>
                        </div>
                    </div>
                    <UserTrips userId={id} role={user?.role || ''} user={user} />
                </div>
            )}
        </div>
    );
}

// Subcomponente para la lista de carreras con filtros y reportes
function UserTrips({ userId, role, user }: { userId: string, role: string, user: IUser | null }) {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de filtros
    const [status, setStatus] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Sincronizar con el contenedor de impresión (Estado elevado si se quisiera,
    // pero lo haremos simple con un callback o pasando props hacia arriba si es necesario).
    // Para simplificar, renderizaremos el ReportTemplate dentro de UserTrips pero oculto.

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const currentRole = role?.toLowerCase();
            const field = currentRole === 'business' || currentRole === 'workshop' ? 'businessId' : 'driverId';

            const filters: any = { [field]: userId };
            if (status !== 'ALL') filters.status = status;

            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const response = await apiClient.get('/trip', {
                params: {
                    take: 2000, 
                    orderBy: JSON.stringify({ createdAt: 'desc' }),
                    ...filters
                }
            });

            const result = response.data?.body?.data || response.data?.body || response.data;
            setTrips(Array.isArray(result) ? result : result.data || []);
        } catch (err) {
            console.error("Error fetching user trips:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchTrips();
    }, [userId, role, status, startDate, endDate]);

    const handleExport = () => {
        if (trips.length === 0) return;

        const headers = ["ID", "Fecha", "Estado", "Origen", "Destino", "Monto", "Distancia"];
        const rows = trips.map(t => [
            t.id,
            new Date(t.createdAt).toLocaleString(),
            t.status,
            t.origin,
            t.destination,
            t.amount,
            t.distance || '0'
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_carreras_${userId.substring(0, 8)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Template oculto para impresión PDF - Controlado por @media print en globals.css */}
            <div className="hidden print:block">
                <ReportTemplate
                    user={user}
                    trips={trips}
                    filters={{ status, start: startDate, end: endDate }}
                />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-2 no-print">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Estado</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="block w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue/30"
                    >
                        <option value="ALL">TODOS LOS ESTADOS</option>
                        <option value="PENDING">PENDIENTE</option>
                        <option value="ACCEPTED">ACEPTADO</option>
                        <option value="IN_TRANSIT">EN TRÁNSITO</option>
                        <option value="DELIVERED">ENTREGADO</option>
                        <option value="CANCELLED">CANCELADO</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Desde</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue/30"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Hasta</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue/30"
                    />
                </div>

                <div className="flex-1 flex justify-end gap-2">
                    <button
                        onClick={handleExport}
                        disabled={trips.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:translate-y-0"
                    >
                        <DynamicIcon name="FileSpreadsheet" size={12} />
                        CSV
                    </button>
                    <button
                        onClick={handlePrintPDF}
                        disabled={trips.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-blue/20 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:translate-y-0"
                    >
                        <DynamicIcon name="Printer" size={12} />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-brand-blue rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Generando_Vista...</p>
                </div>
            ) : trips.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-slate-300" size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hay resultados para los filtros aplicados</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4">ID</th>
                                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ruta</th>
                                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest pr-4 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {trips.map((trip: any) => (
                                <tr key={trip.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 pl-4 font-mono text-[10px] text-slate-400 group-hover:text-brand-blue transition-colors">#{trip.id.slice(-6).toUpperCase()}</td>
                                    <td className="py-5 text-[10px] font-bold text-slate-500">{new Date(trip.createdAt).toLocaleDateString()}</td>
                                    <td className="py-5 text-center">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border",
                                            trip.status === 'DELIVERED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                trip.status === 'CANCELLED' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                    'bg-blue-50 border-blue-100 text-blue-600'
                                        )}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-700 truncate max-w-[200px]">{trip.origin}</p>
                                            <div className="flex items-center gap-1 opacity-10 group-hover:opacity-40 transition-opacity">
                                                <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                <p className="text-[8px] font-bold uppercase italic">{trip.destination}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 pr-4 text-right font-black text-brand-blue text-xs tabular-nums">${trip.status === 'CANCELLED' ? '0.00' : trip.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
