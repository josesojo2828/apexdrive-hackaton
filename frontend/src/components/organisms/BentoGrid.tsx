"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Shield, Zap, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export const BentoGrid = () => {
    const t = useTranslations("landing.bento");
    return (
        <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
                <Typography variant="H2" className="text-brand-blue/80 dark:text-white drop-shadow-sm">
                    {t("title")}
                </Typography>
                <Typography variant="P" className="text-brand-white/60 dark:text-slate-300 max-w-2xl mx-auto font-medium">
                    {t("subtitle")}
                </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
                {/* ── LARGE EDITORIAL FEATURE ────────────────────── */}
                <GlassCard className="md:col-span-8 relative overflow-hidden group border-slate-200/50 dark:border-white/10 rounded-[3rem] p-0 shadow-2xl">
                    {/* Background Photography */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/hero-1.png"
                            alt="San Juan Skyline"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[3s] brightness-75 dark:brightness-50"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/40 via-transparent to-slate-950/80" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col p-10 md:p-14">
                        {/* Top Technical Badge */}
                        <div className="inline-flex items-center self-start px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-auto">
                            <div className="w-2 h-2 rounded-full bg-[var(--brand-sky)] mr-3 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t("network.badge")}</span>
                        </div>

                        <div className="max-w-md mt-auto">
                            <Typography variant="H2" className="text-white mb-6 leading-[0.9] tracking-[calc(-0.04em)] drop-shadow-2xl">
                                {t.rich("network.title", {
                                    br: () => <br />,
                                    span: (chunks: React.ReactNode) => <span className="text-[var(--brand-sky)]">{chunks}</span>
                                })}
                            </Typography>
                            <Typography variant="P" className="text-slate-200 text-lg leading-relaxed font-medium mb-8 drop-shadow-md">
                                {t("network.description")}
                            </Typography>

                        </div>
                    </div>
                </GlassCard>

                {/* ── SIDE FEATURES COLUMN ───────────────────────── */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Small Feature: Verification */}
                    <GlassCard className="flex-1 bg-white/40 dark:bg-brand-blue/40 border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 group hover:border-emerald-500/30 transition-all flex flex-col justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <Typography variant="H3" className="text-2xl mb-3 text-brand-blue dark:text-white font-black tracking-tight">{t("verified.title")}</Typography>
                        <Typography variant="P" className="text-sm text-slate-600 dark:text-brand-white/60 font-medium leading-relaxed">
                            {t("verified.description")}
                        </Typography>
                    </GlassCard>

                    {/* Horizontal Mini Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 h-48">
                        <GlassCard className="bg-white/40 dark:bg-brand-blue/40 border-slate-200/50 dark:border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group">
                            <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mb-2 group-hover:scale-125 transition-transform" />
                            <span className="text-[9px] font-black text-brand-white/60 dark:text-slate-500 uppercase tracking-widest">{t("performance.label")}</span>
                            <span className="text-xs font-bold text-brand-blue dark:text-white">{t("performance.value")}</span>
                        </GlassCard>
                        <GlassCard className="bg-white/40 dark:bg-brand-blue/40 border-slate-200/50 dark:border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group">
                            <Smartphone className="w-8 h-8 text-pink-600 dark:text-pink-500 mb-2 group-hover:scale-125 transition-transform" />
                            <span className="text-[9px] font-black text-brand-white/60 dark:text-slate-500 uppercase tracking-widest">{t("interface.label")}</span>
                            <span className="text-xs font-bold text-brand-blue dark:text-white">{t("interface.value")}</span>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
};
