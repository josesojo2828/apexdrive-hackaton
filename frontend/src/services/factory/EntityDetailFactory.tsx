"use client";

import UserDetail from "@/features/user/page/UserDetails";
import CarDetail from "@/features/cars/components/CarDetail";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface FactoryProps {
    slug: string;
    id: string;
}

export default function EntityDetailFactory({ slug, id }: FactoryProps) {
    const t = useTranslations("dashboard.detail");

    // Dictionary of detail components
    // For ApexDrive we only map the core dealership entities
    const views: Record<string, ReactNode> = {
        'user': <UserDetail id={id} />,
        'cars': <CarDetail id={id} />,
    };

    return views[slug] || (
        <div className="p-20 text-center glass-panel rounded-[3rem] border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">
                {slug.toUpperCase()} DETAIL
            </h2>
            <p className="text-[10px] font-black text-brand-sky/60 uppercase tracking-[0.4em] mt-4 relative z-10">
                ACCESS_KEY: {id}
            </p>
            <div className="mt-10 flex justify-center">
                 <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Encryption Active
                 </div>
            </div>
        </div>
    );
}