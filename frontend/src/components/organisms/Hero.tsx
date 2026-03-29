"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const Hero = () => {
    const images = [
        "/images/12.png",
        "/images/13.png",
        "/images/14.png"
    ];

    const [selectedImage, setSelectedImage] = useState<string>("/images/hero-car-red.png");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        setSelectedImage(images[randomIndex]);
    }, []);

    return (
        <section id="inicio" className="relative h-screen bg-base-100 flex items-center justify-center overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-full max-w-4xl h-full flex items-center justify-center">
                <div className="relative w-[500px] h-[500px]">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 border-[2px] border-primary/10 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 0.9 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-8 bg-primary/5 rounded-full blur-[40px]"
                    />
                    {/* Radial Grids */}
                    <div className="absolute inset-x-[-150px] top-1/2 h-[1px] bg-white/5" />
                    <div className="absolute inset-y-[-150px] left-1/2 w-[1px] bg-white/5" />
                </div>
            </div>

            {/* MAIN LAYERED COMPONENTS */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">

                {/* 1. LAYER BEHIND CAR (TEXT BASE) */}
                <div className="absolute top-[38%] left-[10%] z-0">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, x: -100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-[14vw] font-black text-white/5 leading-none tracking-tighter uppercase italic"
                    >
                        APEX
                    </motion.h1>
                </div>

                {/* 2. CENTRAL CAR IMAGE (MIDDLE LAYER) */}
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "circOut", delay: 0.3 }}
                    className="relative z-10 w-full max-w-[1100px] h-auto pointer-events-none group"
                >
                    <img
                        key={selectedImage}
                        src={selectedImage}
                        alt="Core Concept"
                        className="w-full h-auto drop-shadow-[0_80px_60px_rgba(0,0,0,0.4)] transition-transform duration-1000 group-hover:scale-105"
                    />
                </motion.div>

                {/* 3. LAYER ON TOP OF CAR (TEXT CONTINUATION) */}
                <div className="absolute top-[52%] left-[20%] md:left-[30%] z-20">
                    <motion.h2
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        className="text-[10vw] font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
                    >
                        VELOCITY
                    </motion.h2>
                </div>

            </div>

            {/* Background Text watermark (Nexus) */}
            <div className="absolute right-0 bottom-[-5%] opacity-[0.03] pointer-events-none select-none">
                <h2 className="text-[25rem] font-black italic serif tracking-tighter uppercase">Nexus</h2>
            </div>
        </section>
    );
};
