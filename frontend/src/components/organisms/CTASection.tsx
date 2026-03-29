"use client";

import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Store, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const CTASection = () => {
    const t = useTranslations("landing.cta");
    return (
        <section className="px-4 py-16 max-w-6xl mx-auto relative z-10">
            <GlassCard className="p-10 md:p-14 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 text-[var(--brand-sky)] font-bold mb-4 uppercase tracking-wider text-sm">
                        <Store className="w-5 h-5" /> {t("badge")}
                    </div>
                    <Typography variant="H2" className="text-brand-blue/80 dark:text-white mb-4">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 max-w-md">
                        {t("description")}
                    </Typography>
                </div>
                <Link href="/registro">
                    <Button variant="PREMIUM" size="XL" className="whitespace-nowrap px-8 py-4">
                        {t("button")} <ChevronRight className="w-6 h-6 ml-2" />
                    </Button>
                </Link>
            </GlassCard>
        </section>
    );
};
