"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const philosophyItems = [
    {
        title: "Subastas en Vivo",
        image: "/images/8.png",
        label: "Exposición",
        href: "/subastas"
    },
    {
        title: "Tienda de Lujo",
        image: "/images/9.png",
        label: "Inventario",
        href: "/store"
    },
];

export const ValueProposition = () => {
    return (
        <section id="catalogo" className="relative py-28 px-10 md:px-20 bg-white overflow-hidden border-t border-black/5">
            <div className="max-w-[1500px] mx-auto space-y-24">

                {/* Technical Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-black/5 pb-12 gap-8">
                     <div className="flex items-center gap-6">
                          <div className="flex flex-col gap-2">
                               <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-black">Exploración</h2>
                               <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((dot) => (
                                        <div key={dot} className={`h-[2px] w-4 ${dot <= 2 ? 'bg-primary' : 'bg-black/5'}`} />
                                    ))}
                               </div>
                          </div>
                          <div className="h-10 w-[1px] bg-black/5 hidden md:block" />
                          <p className="text-[9px] font-bold text-black/40 uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">
                               Plataforma experimental desarrollada para el Apex Drive Hackathon 2026.
                          </p>
                     </div>

                     <div className="flex items-baseline gap-4">
                          <div className="text-right">
                               <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.4em] mb-1">Status: Active</p>
                               <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-7xl font-black italic serif text-black leading-none tracking-tighter">02</span>
                                    <span className="text-xl font-bold text-black/10 tracking-widest italic serif">/ 100</span>
                                </div>
                          </div>
                     </div>
                </div>

                {/* Vertical List based on Reference UI */}
                <div className="space-y-24">
                    {philosophyItems.map((item, i) => (
                        <Link key={i} href={item.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.2 }}
                                className="flex flex-col xl:flex-row items-center gap-16 group cursor-pointer mb-24 last:mb-0"
                            >
                                {/* Image Container */}
                                <div className="w-full xl:w-[600px] h-[380px] overflow-hidden rounded-[1.5rem] shadow-2xl transition-all duration-1000 group-hover:rounded-none border border-black/5">
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        alt={item.title}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em]">{item.label}</p>
                                        <h3 className="text-4xl md:text-7xl font-black text-black italic serif tracking-tighter uppercase leading-[0.85]">
                                            {item.title.split(' ').map((word, idx) => (
                                                <span key={idx} className={idx === 1 || idx === 2 ? "text-black/20" : "block"}>{word} </span>
                                            ))}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
