"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Bell, Home, Settings, Menu } from "lucide-react";
import { cn } from "@/utils/cn";

interface HeaderProps {
    onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
    const t = useTranslations();
    const { user } = useAuthStore();

    return (
        <header className="h-24 flex items-center justify-between px-12 flex-shrink-0 bg-white/70 backdrop-blur-3xl border-b border-black/5 transition-all z-50">
            <div className="flex items-center gap-10">
                <button
                    onClick={onOpenMobileSidebar}
                    className="p-4 rounded-[1.2rem] bg-black/[0.03] text-brand-blue lg:hidden hover:bg-black/10 transition-all active:scale-95 shadow-sm border border-black/5"
                >
                    <Menu size={22} className="italic" />
                </button>

                <div className="flex items-center gap-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/20 animate-pulse" />
                    <h1 className="text-[12px] font-black text-brand-blue/30 tracking-[0.5em] uppercase italic">
                        {t('application.management')} // SINC_LIVE
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-12">
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className="p-4 rounded-full bg-black/[0.02] text-brand-blue/30 hover:text-brand-blue hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all active:scale-95 border border-transparent hover:border-black/5">
                        <Home size={20} className="italic" />
                    </Link>
                    <button className="p-4 rounded-full bg-black/[0.02] text-brand-blue/30 hover:text-brand-blue hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all relative active:scale-95 border border-transparent hover:border-black/5">
                        <Bell size={20} className="italic" />
                        <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/30" />
                    </button>
                    <Link href="/dashboard/settings" className="p-4 rounded-full bg-black/[0.02] text-brand-blue/30 hover:text-brand-blue hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all active:scale-95 border border-transparent hover:border-black/5">
                        <Settings size={20} className="italic" />
                    </Link>
                </div>

                <Link href="/dashboard/profile" className="flex items-center gap-6 pl-12 border-l border-black/5 group active:scale-95 transition-all">
                    <div className="text-right hidden lg:block space-y-1">
                        <p className="text-[13px] font-black text-brand-blue leading-none uppercase tracking-tighter group-hover:text-primary transition-colors italic">
                            {user?.firstName || 'Operator'} {user?.lastName}
                        </p>
                        <p className="text-[9px] font-black text-brand-blue/20 uppercase tracking-[0.3em] italic">
                            {user?.role || 'EXECUTIVE_MANAGER'} // VIP
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-[1.2rem] bg-black/[0.02] p-[1.5px] shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all border border-black/5 group-hover:rotate-3 group-hover:scale-110">
                        <div className="w-full h-full rounded-[1.1rem] bg-white flex items-center justify-center font-black text-brand-blue text-[13px] italic uppercase">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    );
};
