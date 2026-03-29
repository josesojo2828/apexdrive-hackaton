"use client";

import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Category {
    id: string;
    name: Record<string, string>;
    description: Record<string, string>;
    icon: string;
    color: string;
}

export const CategoryShowcase = () => {
    const t = useTranslations("landing.categories");
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // El backend usa paginación, pedimos las primeras 10 (o más si quieres)
                const res = await apiClient.get('/category-items', {
                    params: { take: 10 }
                });
                // Según Persistence: { total, data } o { body: { total, data } }
                const body = res.data?.body || res.data;
                const data = body?.data || [];

                setCategories(data);
                console.log("Categorías cargadas:", data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field[locale] || field['es'] || "";
    };

    if (!loading && categories.length === 0) return null;

    const displayCategories = categories;

    return (
        <section className="py-32 px-4 relative z-10 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--brand-sky)05_0%,_transparent_70%)] pointer-events-none" />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Typography variant="DISPLAY" className="text-brand-blue dark:text-white !text-6xl md:!text-7xl">
                            {t.rich("title", {
                                span: (chunks: React.ReactNode) => <span className="text-[var(--brand-sky)]">{chunks}</span>
                            })}
                        </Typography>
                        <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 max-w-md font-bold uppercase tracking-widest text-xs">
                            {t("subtitle")}
                        </Typography>
                    </div>
                    <Link href="/directorio">
                        <Button variant="PREMIUM" size="XL" className="group shadow-[0_10px_30px_rgba(0,242,254,0.2)]">
                            {t("cta")} <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 text-center py-20 opacity-50 uppercase tracking-[0.3em] font-black text-[10px] animate-pulse">
                            Cargando Categorías...
                        </div>
                    ) : (
                        displayCategories.map((cat) => (
                            <div key={cat.id} className="transition-all duration-500 hover:scale-[1.02]">
                                <CategoryCard
                                    icon={cat.icon || 'cat-professional'}
                                    title={getTranslation(cat.name)}
                                    description={getTranslation(cat.description)}
                                    color={cat.color || "var(--brand-sky)"}
                                    ctaText={t("cta")}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
