"use client";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";

interface CategoryCardProps {
    icon: string;
    title: string;
    description: string;
    color?: string;    // Accent color (brand identity)
    ctaText?: string;
    onClick?: () => void;
}

export const CategoryCard = ({
    icon,
    title,
    description,
    color = "var(--brand-sky)",
    ctaText = "Ver más",
    onClick
}: CategoryCardProps) => {
    return (
        <GlassCard
            onClick={onClick}
            className="group cursor-pointer overflow-hidden p-0 rounded-[2.5rem] border-slate-200/50 dark:border-white/10 hover:border-[var(--brand-sky)]/40 transition-all duration-500 shadow-xl dark:shadow-2xl bg-white/70 dark:bg-black/40 active:scale-[0.98]"
        >
            {/* ── BRAND TOP ACCENT ── */}
            <div
                className="h-[2px] w-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            />

            <div className="p-8 md:p-10 relative">

                {/* ── FLOATING ICON HERO ── */}
                <div className="mb-10 relative h-20 flex items-center justify-start">
                    {/* Soft Backdrop Glow */}
                    <div
                        className="absolute inset-y-0 left-0 w-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                        style={{ backgroundColor: color }}
                    />

                    <div className="relative w-14 h-14 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ease-out flex items-center justify-center">
                        <DynamicIcon
                            name={icon}
                            className="w-full h-full text-[var(--brand-sky)]"
                        />
                    </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="space-y-4">
                    <Typography variant="H3" className="text-brand-blue dark:text-white group-hover:text-[var(--brand-sky)] transition-colors leading-none font-black tracking-tighter">
                        {title}
                    </Typography>

                    <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 text-sm leading-relaxed font-semibold line-clamp-2">
                        {description}
                    </Typography>
                </div>

                {/* ── FOOTER INTERACTION ── */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 group/btn">
                        <span className="text-brand-blue dark:text-white font-black uppercase tracking-widest text-[9px] group-hover:text-[var(--brand-sky)] transition-colors">
                            {ctaText}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-sky)] transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
