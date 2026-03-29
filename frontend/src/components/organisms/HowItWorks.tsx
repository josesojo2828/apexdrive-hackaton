"use client";

import React from "react";
import { Search, CreditCard, Key } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        num: "01",
        title: "Búsqueda Global",
        description: "Explora nuestro inventario de vehículos premium. Filtrá por marca, modelo y categoría técnica.",
    },
    {
        num: "02",
        title: "Protocolo Directo",
        description: "Gestión unificada de compra, alquiler flexible o participación en subastas internacionales.",
    },
    {
        num: "03",
        title: "Entrega Garantizada",
        description: "Logística coordinada de puerta a puerta con inspección certificada y garantía total.",
    },
];

export const HowItWorks = () => {
    return (
        <section id="subastas" className="relative py-28 px-10 md:px-20 bg-base-300 overflow-hidden border-t border-white/5">
            <div className="max-w-[1500px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-white/5 pb-12">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 italic serif">El Proceso</span>
                        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic serif uppercase leading-[0.7]">
                            Pasos de <span className="text-primary/10">Precisión</span>
                        </h2>
                     </div>
                     <div className="text-right hidden md:block">
                          <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Eficiencia Redefinida</p>
                          <p className="text-[10px] text-white/40 font-medium tracking-tight mt-2 italic">Logística Integral de Grado VIP</p>
                     </div>
                </div>

                {/* Steps Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative group p-10 border border-white/5 hover:border-primary/20 transition-all rounded-[2rem] hover:bg-primary/[0.02]"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors duration-700 italic serif">
                                        {step.num}
                                    </span>
                                    <div className="w-12 h-[1px] bg-white/10 group-hover:bg-primary/30 transition-all" />
                                </div>
                                <div className="space-y-3">
                                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif leading-none">{step.title}</h3>
                                     <p className="text-xs text-white/40 font-medium leading-relaxed italic">{step.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
