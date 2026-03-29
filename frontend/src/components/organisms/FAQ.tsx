"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Question {
    id: string;
    question: Record<string, string>;
    response: Record<string, string>;
    enabled: boolean;
}

export const FAQ = () => {
    const t = useTranslations("landing.faq");
    const locale = 'es';
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Filtramos por habilitados. 
                // El backend espera QueryOptions. 
                // Asumiendo filter[enabled]=true o similar si se soporta, 
                // o simplemente traemos todos y filtramos en cliente.
                const res = await apiClient.get('/question', {
                    params: { take: 50 }
                });
                const body = res.data?.body || res.data;
                const data = (body?.data || []) as Question[];

                // Filtrar por enabled
                setQuestions(data.filter(q => q.enabled));
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field[locale] || field['es'] || "";
    };

    if (!loading && questions.length === 0) return null;

    return (
        <section className="py-24 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-[var(--brand-sky)] text-xs font-bold uppercase tracking-widest border border-blue-500/20 backdrop-blur-md">
                        <HelpCircle className="w-4 h-4" />
                        {t("badge")}
                    </div>
                    <Typography variant="H2" className="text-brand-blue/80 dark:text-white">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 max-w-xl mx-auto">
                        {t("subtitle")}
                    </Typography>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 opacity-50 uppercase tracking-[0.2em] font-black text-[10px] animate-pulse">
                            Cargando Preguntas...
                        </div>
                    ) : (
                        questions.map((faq, index) => (
                            <GlassCard
                                key={faq.id}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={`transition-all duration-300 cursor-pointer overflow-hidden ${openIndex === index ? 'p-8' : 'p-6'}`}
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-[var(--brand-sky)]' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {getTranslation(faq.question)}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-brand-white/60 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[var(--brand-sky)]' : ''}`} />
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="text-slate-500 dark:text-brand-white/60 leading-relaxed">
                                            {getTranslation(faq.response)}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>

                <div className="text-center mt-12">
                    <p className="text-brand-white/60 dark:text-slate-500 font-bold text-sm">
                        {t.rich("footer", {
                            link: (chunks: React.ReactNode) => (
                                <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    {chunks}
                                </a>
                            )
                        })}
                    </p>
                </div>
            </div>
        </section>
    );
};
