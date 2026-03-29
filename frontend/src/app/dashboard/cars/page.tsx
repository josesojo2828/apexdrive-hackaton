"use client";

import { useState } from "react";
import { useCars, Car } from "@/features/cars/hooks/useCars";
import { useAuthStore } from "@/store/useAuthStore";
import { Car as CarIcon, Plus, Search, Filter, Menu, Trash2, Clock, TrendingUp, Fuel, Gauge, Settings, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    AVAILABLE: { label: "DISPONIBLE", color: "text-primary", bg: "bg-primary/10 border-primary/20", dot: "bg-primary" },
    RENTED: { label: "RESERVADO", color: "text-accent", bg: "bg-accent/10 border-accent/20", dot: "bg-accent" },
    IN_AUCTION: { label: "SUBASTA ACTIVA", color: "text-secondary", bg: "bg-secondary/10 border-secondary/20", dot: "bg-secondary" },
    SOLD: { label: "VENDIDO", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20", dot: "bg-rose-500" },
    MAINTENANCE: { label: "SERVICIO", color: "text-brand-blue/30", bg: "bg-black/5 border-black/5", dot: "bg-black/20" },
};

const TYPE_ICONS: Record<string, string> = {
    Sedan: "🚗", SUV: "🚙", Sport: "🏎️", Electric: "⚡", Pickup: "🛻",
};

export default function CarsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { cars, loading, createCar, deleteCar, changeStatus } = useCars(statusFilter);
    const statuses = ["ALL", "AVAILABLE", "RENTED", "IN_AUCTION", "SOLD", "MAINTENANCE"];

    const allCars = Array.isArray(cars) ? cars : [];
    const filtered = allCars.filter(c =>
        `${c.brand} ${c.model} ${c.plate}`.toLowerCase().includes(search.toLowerCase())
    );

    // Fleet stats
    const fleetStats = {
        total: allCars.length,
        available: allCars.filter(c => c.status === 'AVAILABLE').length,
        rented: allCars.filter(c => c.status === 'RENTED').length,
        inAuction: allCars.filter(c => c.status === 'IN_AUCTION').length,
        sold: allCars.filter(c => c.status === 'SOLD').length,
        maintenance: allCars.filter(c => c.status === 'MAINTENANCE').length,
    };
    const totalBasePrice = allCars.reduce((s, c) => s + Number(c.basePrice || 0), 0);

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div className="space-y-8">
            {/* Fleet Dashboard Stats */}
            {isAdmin && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <FleetStat label="Total flota" value={fleetStats.total} color="slate" />
                    <FleetStat label="Disponibles" value={fleetStats.available} color="emerald" />
                    <FleetStat label="Alquilados" value={fleetStats.rented} color="blue" />
                    <FleetStat label="En subasta" value={fleetStats.inAuction} color="amber" />
                    <FleetStat label="Vendidos" value={fleetStats.sold} color="violet" />
                    <FleetStat label="Servicio" value={fleetStats.maintenance} color="slate" />
                </div>
            )}

            {/* Value Banner */}
            {isAdmin && (
                <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor total de la flota</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">${totalBasePrice.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {[
                            { label: 'Disponibles', pct: fleetStats.total ? Math.round((fleetStats.available / fleetStats.total) * 100) : 0, color: 'bg-emerald-500' },
                            { label: 'Alquilados', pct: fleetStats.total ? Math.round((fleetStats.rented / fleetStats.total) * 100) : 0, color: 'bg-blue-500' },
                            { label: 'Subasta', pct: fleetStats.total ? Math.round((fleetStats.inAuction / fleetStats.total) * 100) : 0, color: 'bg-amber-500' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                                    <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.pct}%` }} />
                                </div>
                                <p className="text-[8px] font-bold text-slate-400">{s.label} {s.pct}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">{isAdmin ? "Gestión de flota" : "Mi Flota"}</h1>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{filtered.length} vehículos</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-white border border-black/5 rounded-xl shadow-sm">
                        <button onClick={() => setViewMode("grid")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-black text-white" : "text-black/20 hover:text-black")}>
                            <Filter size={14} />
                        </button>
                        <button onClick={() => setViewMode("list")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-black text-white" : "text-black/20 hover:text-black")}>
                            <Menu size={14} />
                        </button>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm active:scale-95">
                            <Plus size={14} /> Nuevo
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-3 items-center bg-white border border-black/5 p-2 rounded-xl shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Buscar por marca, modelo o placa..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-black/5 rounded-lg text-[10px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div className="flex gap-1.5 flex-wrap items-center p-1">
                    {statuses.map(s => (
                        <button key={s}
                            onClick={() => setStatusFilter(s === "ALL" ? undefined : s)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                (s === "ALL" && !statusFilter) || statusFilter === s
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white text-slate-400 hover:text-slate-600"
                            )}>
                            {s === "ALL" ? "Todos" : STATUS_CONFIG[s]?.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid: Tonal Cards */}
            {loading ? (
                <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={cn("bg-white border border-black/5 animate-pulse", viewMode === "grid" ? "h-[420px] rounded-2xl" : "h-24 rounded-xl")} />
                    ))}
                </div>
            ) : (
                <motion.div layout className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
                    <AnimatePresence mode="popLayout">
                        {filtered.map((car) => (
                            <CarCard
                                key={car.id}
                                car={car}
                                isAdmin={isAdmin}
                                onDelete={deleteCar}
                                onChangeStatus={changeStatus}
                                viewMode={viewMode}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {filtered.length === 0 && !loading && (
                <div className="text-center py-40 bg-white border border-black/5 rounded-[4rem] shadow-sm">
                    <CarIcon size={80} className="mx-auto text-brand-blue/5 mb-8 animate-float" />
                    <p className="text-[12px] font-black text-brand-blue/20 uppercase tracking-[0.5em]">No se encontraron vehículos</p>
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateCarModal onClose={() => setShowCreateModal(false)} onSubmit={createCar} />
                )}
            </AnimatePresence>
        </div>
    );
}

function CarCard({ car, isAdmin, onDelete, onChangeStatus, viewMode = "grid" }: {
    car: Car; isAdmin: boolean;
    onDelete: (id: string) => void;
    onChangeStatus: (id: string, s: string) => void;
    viewMode?: "grid" | "list";
}) {
    const { user } = useAuthStore();
    const isOwnedByMe = car.ownerId === user?.id;
    const isSoldToMe = car.status === 'SOLD' && isOwnedByMe;

    const baseCfg = STATUS_CONFIG[car.status] || STATUS_CONFIG.AVAILABLE;
    const cfg = isSoldToMe ? {
        label: "TUYO",
        color: "text-emerald-500",
        bg: "bg-emerald-500/20 border-emerald-500/30",
        dot: "bg-emerald-500"
    } : baseCfg;

    if (viewMode === "list") {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative flex flex-col md:flex-row md:items-center bg-white border border-black/5 rounded-3xl p-4 gap-4 md:gap-8 hover:shadow-xl transition-all overflow-hidden"
            >
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.02] text-6xl font-black italic tracking-tighter uppercase select-none pointer-events-none hidden md:block">
                    {car.brand}
                </div>

                <div className="w-full md:w-24 h-24 bg-[#F9F9FB] rounded-2xl flex items-center justify-center overflow-hidden">
                    {car.images?.[0] ? (
                        <img src={car.images[0]} className="w-full h-full object-cover" alt={car.brand} />
                    ) : <CarIcon size={24} className="text-brand-blue/10" />}
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 items-center gap-4 md:gap-8">
                    <div>
                        <h3 className="text-[14px] font-black text-brand-blue uppercase leading-none">{car.brand} <span className="text-brand-blue/20">{car.model}</span></h3>
                        <p className="text-[10px] font-bold text-brand-blue/40 mt-1 uppercase tracking-widest">{car.plate}</p>
                    </div>
                    
                    <div className="flex gap-2">
                         <span className="px-2 py-1 rounded bg-primary/10 text-[8px] font-black text-primary uppercase">{car.type}</span>
                         <span className="px-2 py-1 rounded bg-black/5 text-[8px] font-black text-brand-blue/40 uppercase tracking-tighter">{car.year}</span>
                    </div>

                    <div className="text-2xl font-black text-brand-blue italic tracking-tighter">
                        ${car.basePrice?.toLocaleString()}
                    </div>

                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest w-fit",
                        cfg.bg, cfg.color
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                        {cfg.label}
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-none border-black/5">
                    <button 
                        onClick={() => onChangeStatus(car.id, car.status === 'AVAILABLE' ? "IN_AUCTION" : "AVAILABLE")}
                        className="flex-1 md:flex-none px-6 py-3 bg-brand-blue text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                        {car.status === "AVAILABLE" ? "SUBASTA" : "Habilitar"}
                    </button>
                    <Link href={`/dashboard/cars/${car.id}`}>
                        <div className="p-3 rounded-xl border border-black/5 hover:bg-black/5 transition-all text-brand-blue/40">
                            <ArrowRight size={16} />
                        </div>
                    </Link>
                    <Link href={`/dashboard/cars/logs?id=${car.id}`}>
                        <div className="p-3 rounded-xl border border-black/5 hover:bg-black/5 transition-all text-brand-blue/40">
                            <Clock size={16} />
                        </div>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex flex-col h-[460px] bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            {/* HEREO SECTION: Full-width Image */}
            <div className="relative h-[180px] overflow-hidden bg-black/[0.02]">
                <AnimatePresence mode="wait">
                    {car.images?.[0] ? (
                        <motion.img 
                            src={car.images[0]} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt={car.brand} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/5">
                            <CarIcon size={40} className="text-brand-blue/5" />
                        </div>
                    )}
                </AnimatePresence>
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    <div className={cn("px-3 py-1 rounded-full border backdrop-blur-md text-[8px] font-black uppercase tracking-[0.1em] shadow-sm", cfg.bg, cfg.color)}>
                        <span className="flex items-center gap-2">
                            <span className={cn("w-1 h-1 rounded-full", cfg.dot, car.status === 'AVAILABLE' && 'animate-pulse')} />
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Technical Quick-Bar (Glassmorphism) */}
                <div className="absolute bottom-4 inset-x-4 h-10 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between px-4 z-20 transform translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 border-r border-white/10 pr-2">
                        <Gauge size={12} className="text-white/60" />
                        <span className="text-[9px] font-black text-white">{car.mileage?.toLocaleString() || 0} km</span>
                    </div>
                    <div className="flex items-center gap-2 border-r border-white/10 px-2">
                        <Settings size={12} className="text-white/60" />
                        <span className="text-[9px] font-black text-white uppercase">{car.transmission?.slice(0, 4)}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                        <Fuel size={12} className="text-white/60" />
                        <span className="text-[9px] font-black text-white uppercase">{car.fuelType?.slice(0, 4)}</span>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1 p-5 flex flex-col justify-between bg-white relative">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-col">
                            <h3 className="text-[7px] font-black text-brand-blue/30 uppercase tracking-[0.3em] mb-0.5">C_ENGINEERED_BY</h3>
                            <h3 className="text-base font-black text-brand-blue tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
                                {car.brand} {car.model}
                            </h3>
                        </div>
                        <div className="text-right">
                             <p className="text-[7px] font-black text-brand-blue/20 uppercase tracking-[0.2em]">PROTOCOLO</p>
                             <p className="text-[9px] font-black text-brand-blue/40 italic">#{car.id.slice(0, 4)}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-black/[0.03] text-[7px] font-black text-brand-blue/50 uppercase tracking-widest">{car.type}</span>
                        <span className="px-2 py-0.5 rounded bg-black/[0.03] text-[7px] font-black text-brand-blue/30 uppercase tracking-widest">{car.year}</span>
                    </div>
                </div>

                {/* ACTION SECTION */}
                <div className="flex items-end justify-between pt-4 border-t border-black/5">
                    <div>
                        <p className="text-[7px] font-black text-brand-blue/15 uppercase tracking-[0.2em] mb-1">ESTIMATED_VALUE</p>
                        <p className="text-xl font-black text-brand-blue italic tracking-tighter leading-none">
                            ${car.basePrice?.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {isAdmin ? (
                            <div className="flex gap-1.5 items-center">
                                <button 
                                    onClick={() => onChangeStatus(car.id, car.status === 'AVAILABLE' ? "IN_AUCTION" : "AVAILABLE")}
                                    className="px-4 py-2 bg-brand-blue text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                                >
                                    {car.status === "AVAILABLE" ? "Lote" : "Habilitar"}
                                </button>
                                <Link href={`/dashboard/cars/${car.id}`}>
                                    <div className="p-2 text-brand-blue/30 hover:text-brand-blue transition-colors">
                                        <ArrowRight size={12} />
                                    </div>
                                </Link>
                                <button onClick={() => onDelete(car.id)} className="p-2 text-rose-400 hover:text-rose-500 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                                <Link href={`/dashboard/cars/logs?id=${car.id}`}>
                                    <div className="p-2 text-brand-blue/30 hover:text-brand-blue transition-colors">
                                        <Clock size={12} />
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <Link href={`/dashboard/cars/${car.id}`}>
                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-black text-[8px] uppercase tracking-widest shadow-md">
                                    VIEW_SPECS
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function CreateCarModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<any> }) {
    const [form, setForm] = useState({ brand: "", model: "", year: 2024, plate: "", type: "Sedan", description: "", basePrice: 0 });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="bg-white p-8 w-full max-w-xl space-y-8 shadow-2xl rounded-2xl border border-black/5 overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">NEW_PROTOCOL // ASSET_ADD</span>
                    <h2 className="text-2xl font-black text-brand-blue italic tracking-tighter uppercase leading-none">Registrar Activo</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { name: "brand", label: "MARCA", placeholder: "e.g. Porsche" },
                        { name: "model", label: "MODELO", placeholder: "e.g. 911 GT3" },
                        { name: "year", label: "AÑO_SINC", placeholder: "2024", type: "number" },
                        { name: "plate", label: "ID_PLACA", placeholder: "APEX-01" },
                        { name: "basePrice", label: "VALOR_BASE ($)", placeholder: "150000", type: "number" },
                    ].map(f => (
                        <div key={f.name} className="space-y-2">
                            <label className="text-[8px] font-black text-brand-blue/30 uppercase tracking-[0.2em] ml-1">{f.label}</label>
                            <input
                                type={f.type || "text"}
                                placeholder={f.placeholder}
                                value={(form as any)[f.name]}
                                onChange={(e) => setForm(prev => ({ ...prev, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                                required
                                className="w-full px-4 py-2.5 bg-black/[0.02] border border-black/10 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                    ))}
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-brand-blue/30 uppercase tracking-[0.2em] ml-1">CATEGORÍA</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-black/[0.02] border border-black/10 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            {["Sedan", "SUV", "Sport", "Electric", "Pickup"].map(t => (
                                <option key={t} value={t} className="bg-white">{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[8px] font-black text-brand-blue/30 uppercase tracking-[0.2em] ml-1">ESPECIFICACIONES_TÉCNICAS</label>
                    <textarea
                        placeholder="Describa el alma de la máquina..."
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-black/[0.02] border border-black/10 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                    />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-3 text-[9px] font-black text-brand-blue/30 uppercase tracking-[0.3em] hover:text-brand-blue transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={submitting} className="px-10 py-3 bg-brand-blue text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-lg active:scale-95 disabled:opacity-50">
                        {submitting ? "PROCESANDO..." : "SINC_ACTIVO"}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}

function FleetStat({ label, value, color }: { label: string; value: number; color: string }) {
    const dotColors: Record<string, string> = { slate: 'bg-slate-400', emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', violet: 'bg-violet-500' };
    const textColors: Record<string, string> = { slate: 'text-slate-900', emerald: 'text-emerald-600', blue: 'text-blue-600', amber: 'text-amber-600', violet: 'text-violet-600' };
    return (
        <div className="bg-white rounded-xl p-4 border border-black/5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", dotColors[color])} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className={cn("text-2xl font-black tracking-tight", textColors[color])}>{value}</p>
        </div>
    );
}
