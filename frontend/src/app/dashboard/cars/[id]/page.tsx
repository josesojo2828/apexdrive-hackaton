"use client";

import { useCarDetail } from "@/features/cars/hooks/useCarDetail";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Gauge, Settings, Fuel, Shield, Zap, Wind, Calendar, MapPin, Clock, CheckCircle2, AlertCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export default function CarDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { car, loading } = useCarDetail(id);
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Cargando...</p>
            </div>
        </div>
    );

    if (!car) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
            <div className="text-center">
                <AlertCircle size={40} className="mx-auto text-rose-500 mb-4 opacity-20" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Lote No Encontrado</p>
                <button onClick={() => router.back()} className="mt-6 text-xs font-black text-slate-900 uppercase tracking-widest underline">Volver</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
            {/* Nav */}
            <nav className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-all active:scale-95">
                        <ArrowLeft size={18} className="text-slate-900" />
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Ficha /</span>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">#{car.id.slice(0, 8)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
                        <Share2 size={16} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 space-y-16 mt-8">
                {/* Hero Feature Card - BLACK BACKGROUND */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="relative h-[420px] bg-slate-950 rounded-[3rem] overflow-hidden flex items-center px-16 shadow-2xl border border-white/5">
                    
                    {/* Visual Decor */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.1),_transparent)] pointer-events-none" />
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
                    
                    <div className="relative z-10 w-full flex items-end justify-between">
                        <div className="space-y-8">
                           <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full inline-block">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Vehículo registrado</p>
                           </div>

                            <div className="space-y-1">
                                <p className="text-xl font-bold text-white/40 italic uppercase tracking-tighter">{car.brand}</p>
                                <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
                                    {car.model}
                                </h1>
                            </div>

                            <div className="flex items-center gap-12 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Valor estimado</p>
                                    <p className="text-4xl font-black text-blue-400 italic tracking-tighter leading-none">${Number(car.basePrice).toLocaleString()}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Año</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{car.year}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-6 pb-2">
                             <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 active:rotate-1">
                                Reservar Ahora
                            </button>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                                <Zap size={20} />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Performance Metrics - HIGH CONTRAST */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <MetricCard icon={<Zap size={20} />} label="650 HP" sub="Potencia" />
                    <MetricCard icon={<Gauge size={20} />} label="V12 Turbo" sub="Motor" />
                    <MetricCard icon={<Wind size={20} />} label="0.24 CX" sub="Aerodin." />
                    <MetricCard icon={<CheckCircle2 size={20} />} label={car.type} sub="Categoría" />
                </section>

                {/* Description & Bidding Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-7 space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                Descripción
                            </h3>
                            <p className="text-xl font-black text-slate-800 uppercase italic tracking-tight leading-[1.1]">
                                {car.description || "PRECISION ENGINEERED PERFORMANCE MACHINE. OPTIMIZED FOR TRACK-GRADE HANDLING AND COMMANDING PRESENCE."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                           <SpecItem label="Placa" value={car.plate} />
                           <SpecItem label="Kilometraje" value={`${car.mileage?.toLocaleString()} KM`} />
                           <SpecItem label="Transmisión" value={car.transmission || "Automática"} />
                           <SpecItem label="Combustible" value={car.fuelType || "Gasolina"} />
                        </div>

                        {/* Lifecycle Timeline */}
                        <div className="space-y-10 pt-16 border-t border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                Historial del vehículo
                            </h3>

                            <div className="space-y-6">
                                {[
                                    ...(car.logs?.map(l => ({ ...l, type: 'LOG' })) || []),
                                    ...(car.rentals?.map(r => ({ ...r, type: 'RENTAL' })) || []),
                                    ...(car.auctions?.filter(a => a.status === 'CLOSED').map(a => ({ ...a, type: 'AUCTION' })) || [])
                                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-all shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                            <div className="w-[1px] h-full bg-slate-200 group-last:hidden" />
                                        </div>
                                        <div className="pb-8 flex-1 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-slate-400 font-mono">
                                                    {new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                                    item.type === 'RENTAL' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    item.type === 'AUCTION' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-slate-100 text-slate-500 border-slate-200"
                                                )}>
                                                    {item.type === 'RENTAL' ? 'Alquiler' : item.type === 'AUCTION' ? 'Subasta' : 'Sistema'}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black text-slate-800 uppercase italic tracking-tight">
                                                {item.type === 'RENTAL' ? `Alquiler por ${item.user?.firstName} ${item.user?.lastName}` :
                                                 item.type === 'AUCTION' ? `Subasta cerrada - Final: $${Number(item.currentPrice).toLocaleString()}` :
                                                 item.details || item.action}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!car.logs?.length && !car.rentals?.length) && (
                                     <div className="p-8 bg-white border border-dashed border-slate-200 rounded-3xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin registros operacionales</p>
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl space-y-10 border border-white/5">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono border-b border-white/5 pb-4">Estado de subasta</p>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">En Vivo</p>
                                        <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">${Number(car.basePrice).toLocaleString()}</h4>
                                    </div>
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                                        <Clock size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input type="number" 
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 text-white font-black text-lg focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10" 
                                    placeholder="Monto..." />
                                <button className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-[0.98]">
                                    Hacer oferta
                                </button>
                                <p className="text-center text-[9px] font-medium text-slate-500 uppercase tracking-widest italic">Se requiere aceptar términos</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function MetricCard({ icon, label, sub }: { icon: any, label: string, sub: string }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {icon}
            </div>
            <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none mb-1 uppercase">{label}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">{sub}</p>
        </div>
    );
}

function SpecItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                <Shield size={16} />
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{value}</p>
            </div>
        </div>
    );
}
