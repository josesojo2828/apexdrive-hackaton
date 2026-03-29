"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Star, Quote } from "lucide-react";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Testimonial {
    id: string;
    name: string;
    message: Record<string, string>;
}

export const TestimonialWall = () => {
    const t = useTranslations("landing.testimonials");
    const locale = useLocale();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await apiClient.get('/testimonial', {
                    params: { take: 9 } // Suficientes para el "wall"
                });
                const body = res.data?.body || res.data;
                const data = (body?.data || []) as Testimonial[];
                setTestimonials(data);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field[locale] || field['es'] || "";
    };

    const displayTestimonials = testimonials;

    if (!loading && displayTestimonials.length === 0) return null;

    return (
        <section className="py-24 px-4 bg-white/5 dark:bg-brand-blue/10 backdrop-blur-sm relative z-10 border-y border-white/20 dark:border-brand-blue/80/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 text-[var(--brand-sky)] font-bold mb-4 uppercase tracking-widest text-xs">
                        <Quote className="w-5 h-5" /> {t("badge")}
                    </div>
                    <Typography variant="H2" className="text-brand-blue/80 dark:text-white">{t("title")}</Typography>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {loading ? (
                        <div className="col-span-full text-center py-20 opacity-50 uppercase tracking-widest font-black text-xs animate-pulse">
                            Cargando Testimonios...
                        </div>
                    ) : (
                        displayTestimonials.map((test) => (
                            <GlassCard
                                key={test.id}
                                className="break-inside-avoid p-8 bg-white/50 dark:bg-brand-blue/80/50 hover:bg-white dark:hover:bg-brand-blue/80/80 transition-all duration-500 border-white/60 dark:border-slate-700/50 !rounded-3xl"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Typography variant="P" className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
                                    &quot;{getTranslation(test.message)}&quot;
                                </Typography>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--brand-blue)] to-[var(--brand-sky)] flex items-center justify-center text-white font-black text-xs">
                                        {test.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-brand-blue/80 dark:text-white text-sm">{test.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-brand-white/60">Verificado</p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
