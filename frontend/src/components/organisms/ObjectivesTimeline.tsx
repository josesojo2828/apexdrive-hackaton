"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

interface ObjectiveItem {
    id: string;
    objetivo: TranslatableField;
    description: TranslatableField;
    icon: string;
}

export const ObjectivesTimeline = () => {
    const t = useTranslations('about');
    const { tField } = useLocalTranslation();
    const [objectives, setObjectives] = useState<ObjectiveItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/objective')
            .then(res => {
                setObjectives(res.data?.body.data || []);
                setLoading(false);
            })
            .catch(() => {
                setObjectives([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || objectives.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [objectives, loading]);

    if (!loading && objectives.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-black/50">
            {/* Background Diagram Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-slate-300 dark:border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-slate-300 dark:border-white/10 rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <Typography variant="H2" className="mb-4 text-brand-blue dark:text-white uppercase tracking-tighter !text-4xl font-black">
                        {t('objectives_title')}
                    </Typography>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-sky)] mx-auto rounded-full" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical connecting line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--brand-blue)] via-[var(--brand-sky)] to-transparent opacity-10 hidden md:block" />

                    <div className="space-y-12 md:space-y-16">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-slate-100 dark:bg-brand-blue/80 animate-pulse rounded-[2.5rem]" />
                            ))
                        ) : (
                            objectives.map((obj, idx) => (
                                <div key={obj.id} className={cn(
                                    "relative flex flex-col md:flex-row items-center gap-6 md:gap-0 reveal",
                                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                )}>
                                    {/* Number Indicator */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-brand-blue border-2 border-[var(--brand-sky)] flex items-center justify-center shadow font-black text-[var(--brand-blue)] text-sm">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={cn(
                                        "w-full md:w-[45%]",
                                        idx % 2 === 0 ? "md:text-right" : "md:text-left"
                                    )}>
                                        <div className="bg-white dark:bg-brand-blue/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 hover:shadow-lg transition-all duration-500 group">
                                            <div className={cn(
                                                "w-14 h-14 bg-gradient-to-tr from-[var(--brand-blue)] to-[var(--brand-sky)] rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-105",
                                                idx % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                                            )}>
                                                <DynamicIcon name={obj.icon} className="w-7 h-7 text-white" />
                                            </div>
                                            <Typography variant="H4" className="mb-2 text-brand-blue dark:text-white uppercase tracking-tighter !text-xl font-black">
                                                {tField(obj.objetivo)}
                                            </Typography>
                                            <Typography variant="P" className="text-slate-600 dark:text-brand-white/60 text-sm leading-relaxed">
                                                {tField(obj.description)}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
