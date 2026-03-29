import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import apiClient from "@/utils/api/api.client";
import { 
    Palette, 
    MessageSquare, 
    Share2, 
    Globe, 
    CheckCircle2, 
    Clock, 
    Zap,
    Users,
    ChevronRight,
    TrendingUp
} from "lucide-react";

type CategoryKey = "design" | "whatsapp" | "social" | "web";

export const ServicesPricing = () => {
    const t = useTranslations("landing.pricing");
    const [activeTab, setActiveTab] = useState<CategoryKey>("design");
    const [dynamicData, setDynamicData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDynamicServices = async () => {
            try {
                const response = await apiClient.get("/services/landing");
                if (response.data && response.data.length > 0) {
                    setDynamicData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch dynamic services:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDynamicServices();
    }, []);

    const categories: { key: CategoryKey; icon: any; color: string }[] = [
        { key: "design", icon: Palette, color: "text-purple-500 bg-purple-500/10" },
        { key: "whatsapp", icon: MessageSquare, color: "text-emerald-500 bg-emerald-500/10" },
        { key: "social", icon: Share2, color: "text-sky-500 bg-sky-500/10" },
        { key: "web", icon: Globe, color: "text-orange-500 bg-orange-500/10" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "design":
                return (
                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {["design", "video"].map((item) => (
                            <GlassCard key={item} className="p-8 group hover:scale-[1.02] transition-all border-[#00f2fe]/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            {t("categories.design.items." + item + ".time")}
                                        </Typography>
                                    </div>
                                </div>
                                <Typography variant="H3" className="mb-4 text-brand-blue dark:text-white">
                                    {t("categories.design.items." + item + ".name")}
                                </Typography>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                                        <span>Entrega Digital</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                                        <span>Revisiones Ilimitadas</span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                );
            case "whatsapp":
                return (
                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {["basic", "normal", "premium"].map((item) => (
                            <GlassCard key={item} className={`p-8 group hover:scale-[1.02] transition-all ${item === 'premium' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#00f2fe]/10'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                                        {t("categories.whatsapp.items." + item + ".time")}
                                    </span>
                                </div>
                                <Typography variant="H3" className="mb-2 text-brand-blue dark:text-white">
                                    {t("categories.whatsapp.items." + item + ".name")}
                                </Typography>
                                <Typography variant="P" className="text-2xl font-black text-emerald-500 mb-6">
                                    {t("categories.whatsapp.items." + item + ".groups")} <span className="text-sm font-medium text-slate-500">Grupos</span>
                                </Typography>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Difusión Diaria</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>P + X Analytics</span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                );
            case "social":
                return (
                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {["strategy", "presence", "positioning"].map((item) => (
                            <GlassCard key={item} className={`p-8 group hover:scale-[1.02] transition-all ${item === 'positioning' ? 'border-sky-500/30 bg-sky-500/5' : 'border-[#00f2fe]/10'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-sky)]">
                                        {t("categories.social.items." + item + ".range")}
                                    </span>
                                </div>
                                <Typography variant="H3" className="mb-4 text-brand-blue dark:text-white h-14 line-clamp-2">
                                    {t("categories.social.items." + item + ".name")}
                                </Typography>
                                <Typography variant="DISPLAY" className="!text-4xl mb-6">
                                    {t("categories.social.items." + item + ".cost")}
                                </Typography>
                                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5">
                                    {activeTab === 'social' && item !== 'strategy' && (
                                        <>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Posts:</span>
                                                <span className="font-bold text-sky-500">{t("categories.social.items." + item + ".posts")}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Historias:</span>
                                                <span className="font-bold text-sky-500">{t("categories.social.items." + item + ".stories")}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Reportes:</span>
                                                <span className="font-bold text-sky-500">{t("categories.social.items." + item + ".reports")}</span>
                                            </div>
                                        </>
                                    )}
                                    {item === 'strategy' && (
                                        <p className="text-sm text-slate-500 italic">Sesión de consultoría integral para definir el rumbo de tu marca.</p>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                );
            case "web":
                return (
                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {["landing", "catalog"].map((item) => (
                            <GlassCard key={item} className="p-10 group hover:scale-[1.02] transition-all border-[#00f2fe]/10 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                        <Globe className="w-8 h-8" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-orange-500">{t("categories.web.items." + item + ".cost")}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+ {t("categories.web.items." + item + ".maintenance")} mant.</div>
                                    </div>
                                </div>

                                <Typography variant="H2" className="mb-4 text-brand-blue dark:text-white">
                                    {t("categories.web.items." + item + ".name")}
                                </Typography>
                                
                                <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tiempo de Entrega: {t("categories.web.items." + item + ".time")}</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {["Responsive Design", "SEO Básico", "Panel Admin", "Cloud Hosting"].map(feature => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                    Solicitar {t("categories.web.items." + item + ".name")} <ChevronRight className="w-4 h-4" />
                                </button>
                            </GlassCard>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderDynamicContent = () => {
        if (dynamicData.length === 0) return renderContent();

        const activeCategory = dynamicData.find(c => {
            const nameEs = typeof c.name === 'string' ? c.name.toLowerCase() : String(c.name?.es || '').toLowerCase();
            if (activeTab === 'design' && nameEs.includes('diseño')) return true;
            if (activeTab === 'whatsapp' && (nameEs.includes('whatsapp') || nameEs.includes('difusión'))) return true;
            if (activeTab === 'social' && nameEs.includes('redes')) return true;
            if (activeTab === 'web' && nameEs.includes('web')) return true;
            return false;
        });

        if (!activeCategory || !activeCategory.plans) return renderContent();

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {activeCategory.plans.map((plan: any) => (
                    <GlassCard key={plan.id} className={`p-8 group hover:scale-[1.02] transition-all relative ${plan.isPopular ? 'border-brand-sky/40 bg-brand-sky/5 shadow-[0_20px_40px_rgba(0,242,254,0.12)]' : 'border-white/10 shadow-xl'}`}>
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-sky text-brand-blue text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Popular
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-2 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest border ${plan.isPopular ? 'bg-brand-sky/20 text-brand-sky border-brand-sky/30' : 'bg-brand-blue/5 dark:bg-white/5 text-brand-blue dark:text-sky-400 border-brand-blue/10'}`}>
                                {plan.billingCycle || "Plan"}
                            </div>
                            {plan.attributes?.time && (
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {plan.attributes.time}
                                </div>
                            )}
                        </div>
                        <Typography variant="H3" className="mb-2 text-brand-blue dark:text-white h-12 line-clamp-2">
                            {typeof plan.name === 'string' ? plan.name : (plan.name?.es || plan.name?.en || 'Plan')}
                        </Typography>
                        <div className="flex items-baseline gap-1 mb-8">
                             <Typography variant="DISPLAY" className="!text-4xl text-brand-blue dark:text-white">
                                {plan.cost ? `${Number(plan.cost).toFixed(0)}$` : 'FREE'}
                            </Typography>
                            {plan.attributes?.maintenance && (
                                <span className="text-[10px] font-bold text-slate-500">+ {plan.attributes.maintenance} mant.</span>
                            )}
                        </div>
                       
                        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
                            {plan.attributes && Object.entries(plan.attributes).filter(([k]) => k !== 'time' && k !== 'maintenance').map(([key, val]: [any, any]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key}:</span>
                                    <span className="text-xs font-bold text-brand-blue dark:text-sky-400">{val}</span>
                                </div>
                            ))}
                            {(!plan.attributes || Object.keys(plan.attributes).length < 2) && (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle2 className="w-3 h-3 text-sky-500" />
                                            <span>Característica Premium {i}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        );
    };

    return (
        <section id="servicios" className="py-32 px-4 relative z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,_var(--brand-sky)02_0%,_transparent_70%)] pointer-events-none opacity-50" />
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-blue/5 dark:bg-white/5 border border-brand-blue/10 dark:border-white/10 backdrop-blur-md mb-4 text-[#00f2fe] text-[10px] font-black uppercase tracking-[0.3em]">
                        {t("badge")}
                    </div>
                    <Typography variant="DISPLAY" className="text-brand-blue dark:text-white !text-5xl md:!text-7xl">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        {t("subtitle")}
                    </Typography>
                </div>

                {/* Categories Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveTab(cat.key)}
                            className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl ${
                                activeTab === cat.key 
                                ? `shadow-2xl border-white/50 scale-105 z-20 ${cat.key === 'design' ? 'bg-purple-500/10' : cat.key === 'whatsapp' ? 'bg-emerald-500/10' : cat.key === 'social' ? 'bg-sky-500/10' : 'bg-orange-500/10'}` 
                                : "bg-white/5 border-white/10 hover:bg-white/10 opacity-60"
                            }`}
                        >
                            <div className={`p-2 rounded-xl ${cat.color}`}>
                                <cat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest ${activeTab === cat.key ? 'text-brand-blue dark:text-white' : 'text-slate-500'}`}>
                                {t(`categories.${cat.key}.title`)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active Category Description */}
                <div className="max-w-3xl mx-auto text-center mb-16 px-6 py-8 rounded-[2rem] bg-brand-blue/5 dark:bg-white/5 border border-brand-blue/10 dark:border-white/10 backdrop-blur-md">
                    <Typography variant="P" className="italic text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                        &quot;{t(`categories.${activeTab}.description`)}&quot;
                    </Typography>
                </div>

                {/* Plans Grid */}
                <div className="relative min-h-[500px]">
                    {renderDynamicContent()}
                </div>
            </div>
        </section>
    );
};
