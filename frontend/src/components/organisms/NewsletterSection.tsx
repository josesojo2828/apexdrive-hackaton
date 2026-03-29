"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { GlassCard } from "@/components/molecules/GlassCard";

import { useTranslations } from "next-intl";

export const NewsletterSection = () => {
    const t = useTranslations("landing.newsletter");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        // Simulación — conectar con backend real
        await new Promise(r => setTimeout(r, 1200));
        setStatus("success");
        setEmail("");
    };

    return (
        <section className="py-24 px-4 relative z-10">
            <GlassCard className="max-w-4xl mx-auto p-12 md:p-16 text-center shadow-2xl overflow-hidden relative">
                {/* Decorative orbs inside the card */}
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-[var(--brand-sky)] text-xs font-bold uppercase tracking-widest mb-8 border border-blue-500/20 backdrop-blur-md">
                        <Mail className="w-4 h-4" />
                        {t("badge")}
                    </div>

                    <Typography variant="H2" className="text-brand-blue/80 dark:text-white mb-6">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 dark:text-brand-white/60 mb-10 max-w-xl mx-auto">
                        {t.rich("description", {
                            span: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                            br: () => <br />,
                            strong: (_chunks: React.ReactNode) => <strong>{t("no_spam")}</strong>
                        })}
                        <strong> {t("no_spam")}</strong>
                    </Typography>

                    {status === "success" ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-3xl max-w-md mx-auto animate-fade-in">
                            <Check className="w-10 h-10 mx-auto mb-4" />
                            <Typography variant="H4" className="mb-2">{t("success.title")}</Typography>
                            <Typography variant="P" className="text-sm">{t("success.desc")}</Typography>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <div className="flex-1">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={t("placeholder")}
                                    required
                                    size="XL"
                                    className="!bg-white/50 dark:!bg-brand-blue/80/40"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="PREMIUM"
                                size="XL"
                                isLoading={status === "loading"}
                                className="sm:w-auto w-full"
                            >
                                {t("button")} <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </form>
                    )}

                    <Typography variant="P" className="text-xs text-brand-white/60 dark:text-slate-500 mt-8 font-bold">
                        {t("footer")}
                    </Typography>
                </div>
            </GlassCard>
        </section>
    );
};
