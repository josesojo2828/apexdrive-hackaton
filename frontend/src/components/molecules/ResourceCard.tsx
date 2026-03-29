"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";

interface ResourceCardProps {
    title: string;
    description: string;
    icon: string;
    href: string;
    category?: string;
    color?: string;
}

export const ResourceCard = ({
    title,
    description,
    icon,
    href,
    category,
    color = "var(--brand-sky)"
}: ResourceCardProps) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
            <GlassCard className="h-full p-6 md:p-8 flex flex-col border-slate-200/50 dark:border-white/10 hover:border-[var(--brand-sky)]/40 transition-all duration-500 bg-white/70 dark:bg-black/40 group-hover:shadow-2xl group-hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        {/* Soft Glow Background */}
                        <div
                            className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                            style={{ backgroundColor: color }}
                        />
                        <div className="relative w-10 h-10">
                            <Image
                                src={icon}
                                alt={title}
                                fill
                                className="object-contain filter drop-shadow-[0_0_8px_rgba(0,242,254,0.3)] opacity-80 group-hover:opacity-100 transition-all"
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-[var(--brand-sky)] group-hover:border-[var(--brand-sky)] transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4 text-brand-white/60 dark:text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex-1">
                    {category && (
                        <span className="text-[10px] font-black text-brand-white/60 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                            {category}
                        </span>
                    )}
                    <Typography variant="H4" className="text-brand-blue dark:text-white group-hover:text-[var(--brand-sky)] transition-colors mb-3 font-black tracking-tight">
                        {title}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 text-sm leading-relaxed font-medium">
                        {description}
                    </Typography>
                </div>

                {/* Technical Accent Line */}
                <div
                    className="h-[1px] w-0 group-hover:w-full transition-all duration-700 mt-6"
                    style={{ backgroundColor: color }}
                />
            </GlassCard>
        </a>
    );
};
