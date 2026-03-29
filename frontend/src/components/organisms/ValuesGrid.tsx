"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";
import { GlassCard } from "@/components/molecules/GlassCard";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import apiClient from "@/utils/api/api.client";

interface ValueItem {
    id: string;
    title: TranslatableField;
    description: TranslatableField;
    icon: string;
}

export const ValuesGrid = () => {
    const t = useTranslations('about');
    const { tField } = useLocalTranslation();
    const [values, setValues] = useState<ValueItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/value')
            .then(res => {
                setValues(res.data?.body.data || []);
                setLoading(false);
            })
            .catch(() => {
                setValues([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || values.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [values, loading]);

    if (!loading && values.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden bg-white dark:bg-black">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <Typography variant="H2" className="mb-4 text-brand-blue dark:text-white uppercase tracking-tighter !text-4xl font-black">
                        {t('values_title')}
                    </Typography>
                    <div className="w-16 h-1.5 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-sky)] mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 bg-slate-50 dark:bg-brand-blue/80/30 animate-pulse rounded-[2.5rem]" />
                        ))
                    ) : (
                        values.map((val) => (
                            <div key={val.id} className="reveal group">
                                <GlassCard className="p-6 h-full text-center relative overflow-hidden transition-all duration-500 hover:shadow-xl group-hover:-translate-y-2 rounded-[2.5rem] border-white/40 dark:border-white/5">
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-tr from-[var(--brand-blue)] to-[var(--brand-sky)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                            <DynamicIcon name={val.icon} className="w-8 h-8 text-white" />
                                        </div>
                                        <Typography variant="H4" className="mb-3 text-brand-blue dark:text-white uppercase tracking-tight !text-xl font-black">
                                            {tField(val.title)}
                                        </Typography>
                                        <Typography variant="P" className="text-slate-600 dark:text-brand-white/60 text-sm leading-relaxed">
                                            {tField(val.description)}
                                        </Typography>
                                    </div>
                                </GlassCard>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
