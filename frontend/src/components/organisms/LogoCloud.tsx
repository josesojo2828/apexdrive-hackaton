"use client";

import React from "react";
import { motion } from "framer-motion";

export const LogoCloud = () => {
    const brands = ["Aston Martin", "Ferrari", "Lamborghini", "Porsche", "McLaren", "Bugatti"];

    return (
        <section className="py-24 md:py-40 bg-white relative z-10 overflow-hidden">
            <div className="max-w-[1700px] mx-auto px-10 relative">
                {/* Section Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center text-[10px] md:text-[11px] uppercase tracking-[1em] font-black text-black/10 mb-16 md:mb-24 italic serif"
                >
                    Alianzas Estratégicas e Ingeniería de Precisión
                </motion.p>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-16 md:gap-y-24 items-center justify-items-center">
                    {brands.map((brand, i) => (
                        <motion.span 
                            key={brand}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 0.2, scale: 1 }}
                            whileHover={{ opacity: 1, scale: 1.1 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-5xl font-black text-black italic tracking-tighter uppercase cursor-alias select-none transition-all duration-700"
                        >
                            {brand}
                        </motion.span>
                    ))}
                </div>

                {/* Series Indicator - Positioned relative to section content */}
                <div className="mt-20 md:mt-32 flex flex-col items-end opacity-30 md:opacity-40">
                    <div className="flex items-baseline gap-1 scale-75 md:scale-100 origin-right">
                        <span className="text-7xl md:text-8xl font-black text-red-600 italic tracking-tighter italic">02</span>
                        <span className="text-3xl md:text-4xl font-bold text-black/10 tracking-tighter">/50</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20 text-right">Serie Global Limitada</p>
                </div>
            </div>
        </section>
    );
};
