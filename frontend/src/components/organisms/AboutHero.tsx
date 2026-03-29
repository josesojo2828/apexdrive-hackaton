"use client";

import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const AboutHero = () => {
    const t = useTranslations('about');

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/about-japan-hero.png"
                    alt="Japan Identity"
                    fill
                    className="object-cover object-center scale-105 animate-mesh"
                    priority
                />
                {/* Modern Overlays for contrast */}
                <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Floating Label Container */}
                    <div className="reveal active inline-block px-6 py-2 mb-8 rounded-full bg-white/40 dark:bg-brand-blue/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg animate-float">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-[var(--brand-blue)] dark:text-[var(--brand-sky)]">
                            {t('pretitle')}
                        </span>
                    </div>

                    <div className="p-10 md:p-16 rounded-[3rem] bg-white/30 dark:bg-black/30 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl reveal active transition-all">
                        <Typography variant="H1" className="mb-8 !text-5xl md:!text-7xl bg-gradient-to-b from-brand-blue via-brand-blue/80 to-slate-700 dark:from-white dark:via-slate-200 dark:to-brand-white/60 bg-clip-text text-transparent !leading-[1] !tracking-tighter font-black">
                            {t('hero_title_part1')}<br />
                            <span className="text-[var(--brand-sky)] drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]">{t('hero_title_accent')}</span>
                        </Typography>

                        <div className="w-24 h-1.5 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-sky)] mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(0,242,254,0.5)]" />

                        <Typography variant="P" className="max-w-2xl mx-auto text-brand-blue/80 dark:text-slate-100 text-xl font-medium leading-relaxed italic drop-shadow-sm">
                            &quot;{t('hero_subtitle')}&quot;
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Decorative Floating Elements (Inspiration-style cards) */}
            <div className="absolute top-1/4 -left-12 w-48 h-32 bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl -rotate-12 animate-shard hidden lg:block" />
            <div className="absolute bottom-1/4 -right-12 w-64 h-40 bg-[var(--brand-blue)]/10 backdrop-blur-xl border border-white/20 rounded-[3rem] rotate-6 animate-shard animation-delay-1000 hidden lg:block" />
        </section>
    );
};
