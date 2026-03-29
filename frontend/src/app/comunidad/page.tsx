"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ResourceCard } from "@/components/molecules/ResourceCard";
import { GlassCard } from "@/components/molecules/GlassCard";
import {
    Instagram,
    MessageCircle,
    Users,
    ArrowRight,
    Globe,
    BookOpen,
    HeartHandshake
} from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { useTranslations } from "next-intl";

export default function CommunityPage() {
    const t = useTranslations("community");

    const team = [
        {
            name: "Jose Sojo",
            role: t("team.members.jose.role"),
            image: "/images/1.png",
            bio: t("team.members.jose.bio"),
            links: { ig: "#", x: "#" }
        },
        {
            name: "Team Speed Delivery",
            role: t("team.members.support.role"),
            image: "/images/2.png",
            bio: t("team.members.support.bio"),
            links: { ig: "#", x: "#" }
        }
    ];

    const resources = [
        {
            title: t("resources.items.embassy.title"),
            description: t("resources.items.embassy.description"),
            icon: "/icons/svg/jp/jp-torii.svg",
            href: "https://japon.embajada.gob.ve/",
            category: t("resources.items.embassy.category"),
            color: "#ef4444"
        },
        {
            title: t("resources.items.guide.title"),
            description: t("resources.items.guide.description"),
            icon: "/icons/svg/geo-country.svg",
            href: "https://www.moj.go.jp/isa/support/portal/index.html",
            category: t("resources.items.guide.category"),
            color: "#00f2fe"
        },
        {
            title: t("resources.items.social.title"),
            description: t("resources.items.social.description"),
            icon: "/icons/svg/msg-broadcast.svg",
            href: "#",
            category: t("resources.items.social.category"),
            color: "#4facfe"
        },
        {
            title: t("resources.items.legal.title"),
            description: t("resources.items.legal.description"),
            icon: "/icons/svg/srv-contract-legal.svg",
            href: "#",
            category: t("resources.items.legal.category"),
            color: "#a855f7"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-700 bg-[#eef2f5] dark:bg-slate-950">
            <div className="fixed inset-0 z-0 bg-[#eef2f5] dark:bg-[#080d1a] transition-colors duration-700"></div>
            <div className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#e0f2fe] dark:bg-blue-900/30 rounded-full blur-[140px] opacity-70 transition-colors duration-1000"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#e0e7ff] dark:bg-indigo-900/20 rounded-full blur-[120px] opacity-60 transition-colors duration-1000"></div>
            <div className="fixed top-[40%] left-[40%] w-[50vw] h-[50vw] bg-white dark:bg-[#00f2fe]/5 rounded-full blur-[100px] opacity-80 dark:opacity-40 transition-colors duration-1000"></div>

            <div className="relative z-10">
                <Header />
                <main className="min-h-screen pt-32 pb-24 px-4 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* ── HERO SECTION ── */}
                        <div className="text-center mb-32">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8">
                                <Users className="w-4 h-4 text-[#00f2fe] mr-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{t("hero.badge")}</span>
                            </div>
                            <Typography variant="DISPLAY" className="mb-8 !text-6xl md:!text-8xl lg:!text-9xl">
                                {t.rich("hero.title", {
                                    br: () => <br />,
                                    span: (chunks: React.ReactNode) => <span className="text-[#00f2fe]">{chunks}</span>
                                })}
                            </Typography>
                            <Typography variant="P" className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-semibold">
                                {t("hero.description")}
                            </Typography>
                        </div>

                        {/* ── SOCIAL CONNECT GRID ── */}
                        <section className="mb-40">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[400px]">
                                <GlassCard className="md:col-span-7 bg-gradient-to-br from-pink-500/10 to-orange-500/10 border-pink-500/20 p-10 flex flex-col justify-between group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-pink-500/20 transition-all duration-700" />
                                    <div>
                                        <Instagram className="w-12 h-12 text-pink-500 mb-6" />
                                        <Typography variant="H2" className="text-slate-900 dark:text-white mb-4">{t("social.instagram.title")}</Typography>
                                        <Typography variant="P" className="text-slate-600 dark:text-slate-400 max-w-sm">
                                            {t("social.instagram.description")}
                                        </Typography>
                                    </div>
                                    <Button variant="GLASS" className="self-start group/btn !bg-pink-500/10 !border-pink-500/20 hover:!bg-pink-500/20 transition-all">
                                        {t("social.instagram.button")} <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </GlassCard>

                                <GlassCard className="md:col-span-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 p-10 flex flex-col justify-between group">
                                    <div>
                                        <MessageCircle className="w-12 h-12 text-emerald-500 mb-6" />
                                        <Typography variant="H2" className="text-slate-900 dark:text-white mb-4">{t("social.whatsapp.title")}</Typography>
                                        <Typography variant="P" className="text-slate-600 dark:text-slate-400">
                                            {t("social.whatsapp.description")}
                                        </Typography>
                                    </div>
                                    <Button variant="GLASS" className="self-start group/btn !bg-emerald-500/10 !border-emerald-500/20 hover:!bg-emerald-500/20 transition-all">
                                        {t("social.whatsapp.button")} <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </GlassCard>
                            </div>
                        </section>

                        {/* ── RESOURCES OF INTEREST ── */}
                        <section className="mb-40">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                            <BookOpen className="w-6 h-6 text-[#00f2fe]" />
                                        </div>
                                        <Typography variant="H2" className="text-slate-900 dark:text-white">{t("resources.title")}</Typography>
                                    </div>
                                    <Typography variant="P" className="text-slate-500 dark:text-slate-400 max-w-md uppercase tracking-widest text-[10px] font-black">
                                        {t("resources.subtitle")}
                                    </Typography>
                                </div>
                                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10 mx-10 hidden md:block" />
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {resources.map((resource, i) => (
                                    <ResourceCard key={i} {...resource} />
                                ))}
                            </div>
                        </section>

                        {/* ── TEAM SECTION ── */}
                        <section className="mb-24">
                            <div className="text-center mb-20 space-y-4">
                                <Typography variant="H2">{t("team.title")}</Typography>
                                <Typography variant="P" className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                                    {t("team.description")}
                                </Typography>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {team.map((member, i) => (
                                    <GlassCard key={i} className="p-8 group overflow-hidden">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative w-32 h-32 mb-6 p-1 rounded-full border border-[#00f2fe]/30 group-hover:scale-105 transition-transform duration-500">
                                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={member.image}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-[3s]"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                                    <div className="px-3 py-1 rounded-full bg-[#00f2fe] text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                        {member.role}
                                                    </div>
                                                </div>
                                            </div>
                                            <Typography variant="H3" className="mb-2 text-slate-900 dark:text-white group-hover:text-[#00f2fe] transition-colors">
                                                {member.name}
                                            </Typography>
                                            <Typography variant="P" className="text-sm text-slate-500 dark:text-slate-400 mb-6 italic">
                                                &quot;{member.bio}&quot;
                                            </Typography>
                                            <div className="flex gap-4">
                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-pink-500/50 transition-colors cursor-pointer group/icon">
                                                    <Instagram className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/icon:text-pink-500" />
                                                </div>
                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#00f2fe]/50 transition-colors cursor-pointer group/icon">
                                                    <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/icon:text-[#00f2fe]" />
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>

                        {/* ── FINAL CTA ── */}
                        <section className="text-center">
                            <GlassCard className="p-12 md:p-20 bg-gradient-to-br from-[#4facfe]/5 to-[#00f2fe]/5 border-[#00f2fe]/20 max-w-5xl mx-auto rounded-[4rem]">
                                <HeartHandshake className="w-16 h-16 text-[#00f2fe] mx-auto mb-8 animate-pulse" />
                                <Typography variant="H2" className="mb-6">{t("cta.title")}</Typography>
                                <Typography variant="P" className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 text-lg font-medium">
                                    {t("cta.description")}
                                </Typography>
                                <Button variant="PREMIUM" size="XL" className="shadow-[0_15px_40px_rgba(0,242,254,0.3)]">
                                    {t("cta.button")} <ArrowRight className="ml-3 w-5 h-5" />
                                </Button>
                            </GlassCard>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
