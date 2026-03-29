"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";

import { useTranslations } from "next-intl";

export const StatsSection = () => {
    const t = useTranslations("landing.stats");
    const stats = [0, 1, 2, 3].map(i => ({
        label: t(`items.${i}.label`),
        value: ["250+", "1.2k", "15+", "47"][i], // Values are numeric/hardcoded numbers usually fine
        detail: t(`items.${i}.detail`)
    }));
    return (
        <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, idx) => (
                    <GlassCard key={idx} className="p-8 text-center border-white/40 dark:border-slate-700/50 group">
                        <Typography variant="H2" className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-sky)] bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-500">
                            {stat.value}
                        </Typography>
                        <Typography variant="H4" className="text-sm font-black text-brand-blue/80 dark:text-white uppercase tracking-wider mb-1">
                            {stat.label}
                        </Typography>
                        <Typography variant="P" className="text-[10px] opacity-50 uppercase tracking-[0.2em]">
                            {stat.detail}
                        </Typography>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
};
