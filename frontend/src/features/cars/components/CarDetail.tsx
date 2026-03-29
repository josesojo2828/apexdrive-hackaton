"use client";

import { useEntityDetail } from "@/features/dashboard/hooks/useEntityDetail";
import { Car } from "@/features/cars/hooks/useCars";
import { motion } from "framer-motion";
import { Gauge, Zap, Wind, Shield, ChevronRight, Gavel, Calendar, Tag } from "lucide-react";
import { cn } from "@/utils/cn";

export default function CarDetail({ id }: { id: string }) {
    const { data: car, loading } = useEntityDetail<Car>("cars", id);

    if (loading) return (
        <div className="space-y-12 animate-pulse">
            <div className="h-96 bg-white/5 rounded-[3rem]" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-3xl" />)}
            </div>
        </div>
    );

    if (!car) return (
        <div className="text-center py-40 glass-panel rounded-[3rem]">
            <p className="text-sm font-black text-white/20 uppercase tracking-[0.5em]">Vehículo No Encontrado</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Header */}
            <div className="relative h-[500px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl group">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1118] via-[#050505] to-[#0a1118]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,225,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none">
                     <span className="text-[25rem] font-black text-white/[0.02] italic tracking-tighter uppercase select-none">{car.brand[0]}</span>
                </div>

                <div className="relative z-10 h-full p-12 md:p-20 flex flex-col justify-end gap-8 bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Asset #{car.id.slice(-6).toUpperCase()}</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none"
                        >
                            {car.brand} <span className="text-white/20">{car.model}</span>
                        </motion.h1>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex gap-12">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Valor Estimado</p>
                                <p className="text-4xl font-black text-primary italic tracking-tighter">${car.basePrice?.toLocaleString()}</p>
                             </div>
                             <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Año Edición</p>
                                <p className="text-4xl font-black text-white italic tracking-tighter">{car.year}</p>
                             </div>
                        </div>

                        <div className="flex gap-4">
                             <button className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all shadow-xl active:scale-95">
                                Reservar Ahora
                             </button>
                             <button className="p-5 bg-white/5 border border-white/10 rounded-[2rem] text-white hover:bg-white/10 transition-all">
                                <Gavel size={20} />
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: "Performance", value: "650 HP", icon: <Zap className="text-primary" />, desc: "RAW POWER" },
                    { label: "Engineering", value: "V12 BI-TURBO", icon: <Gauge className="text-primary" />, desc: "ENGINE TYPE" },
                    { label: "Aerodynamics", value: "0.24 CX", icon: <Wind className="text-primary" />, desc: "DRAG RATIO" },
                    { label: "Class", value: car.type.toUpperCase(), icon: <Shield className="text-primary" />, desc: "VEHICLE TYPE" }
                ].map((spec, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={spec.label} 
                        className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-white/10 transition-all group"
                    >
                        <div className="flex justify-between items-center">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                {spec.icon}
                            </div>
                            <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">{spec.desc}</p>
                        </div>
                        <div>
                             <p className="text-3xl font-black text-white italic tracking-tighter">{spec.value}</p>
                             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">{spec.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <section className="p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] space-y-6">
                        <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-primary" />
                             <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">Descripción Editorial</h2>
                        </div>
                        <p className="text-base text-white/50 leading-[1.8] font-medium italic">
                            {car.description || "Este ejemplar representa la cúspide de la ingeniería moderna. Un vehículo que no solo transporta, sino que define un nuevo estándar de excelencia automotriz. Cada curva ha sido diseñada para cortar el viento, y cada componente mecánico ha sido calibrado para la perfección absoluta."}
                        </p>
                    </section>

                    <section className="grid grid-cols-2 gap-8">
                         <div className="p-8 border border-white/5 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                              <div className="flex items-center gap-6">
                                   <Calendar className="text-white/20" />
                                   <div>
                                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Registro</p>
                                       <p className="text-xs font-black text-white uppercase tracking-widest">Matrícula {car.plate}</p>
                                   </div>
                              </div>
                              <ChevronRight size={16} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                         </div>
                         <div className="p-8 border border-white/5 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                              <div className="flex items-center gap-6">
                                   <Tag className="text-white/20" />
                                   <div>
                                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Categoría</p>
                                       <p className="text-xs font-black text-white uppercase tracking-widest">{car.type}</p>
                                   </div>
                              </div>
                              <ChevronRight size={16} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                         </div>
                    </section>
                </div>

                {/* Sidebar Sticky Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 p-10 bg-primary/5 border border-primary/20 backdrop-blur-xl rounded-[3rem] space-y-8">
                        <div className="space-y-2">
                             <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Timeline de Subasta</p>
                             <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                  <div className="h-full w-[60%] bg-primary shadow-[0_0_15px_#00f5e1]" />
                             </div>
                        </div>

                        <div className="space-y-6">
                             <div className="flex justify-between items-end border-b border-primary/10 pb-6">
                                  <div>
                                       <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Oferta Actual</p>
                                       <p className="text-3xl font-black text-white italic tracking-tighter">${(car.basePrice || 0 * 1.2).toLocaleString()}</p>
                                  </div>
                                  <div className="text-right">
                                       <p className="text-xs font-black text-primary">LIVE</p>
                                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">12 BIDS</p>
                                  </div>
                             </div>

                             <div className="space-y-4">
                                  <input 
                                    type="number" 
                                    placeholder="Enter Bid Amount..."
                                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-black text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/5"
                                  />
                                  <button className="w-full py-5 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(0,245,225,0.2)] hover:scale-[1.02] transition-all">
                                      Place Bid
                                  </button>
                             </div>
                        </div>

                        <p className="text-[8px] font-medium text-white/20 text-center uppercase tracking-widest">Verified and Secured by Apex Authentication</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
