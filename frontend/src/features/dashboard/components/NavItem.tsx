"use client";

import Link from "next/link";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { ObjectSidebar } from "@/types/user/dashboard";
import { useTranslations } from "next-intl";

interface NavItemProps {
    item: ObjectSidebar;
    isCollapsed: boolean;
    pathname: string;
    toggleMenu: (label: string) => void;
    isOpen: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, pathname, toggleMenu, isOpen }) => {
    const t = useTranslations();
    const isActive = pathname === `/dashboard/${item.slug}` || (item.slug && pathname.startsWith(`/dashboard/${item.slug}`));

    if (item.childs && item.childs.length > 0) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => !isCollapsed && toggleMenu(item.label)}
                    className={cn(
                        "w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-700 group",
                        isActive
                            ? "bg-brand-blue text-white shadow-2xl shadow-brand-blue/30 scale-[1.02] italic"
                            : "text-brand-blue/30 hover:bg-black/[0.03] hover:text-brand-blue",
                        isCollapsed && "justify-center"
                    )}
                >
                    <div className="flex items-center gap-6">
                        <DynamicIcon name={item.icon} className={cn("w-5 h-5 transition-all duration-700", isActive ? "text-white scale-110" : "group-hover:scale-110")} />
                        {!isCollapsed && <span className="text-[12px] font-black uppercase tracking-[0.3em] leading-none italic">{t(item.label)}</span>}
                    </div>
                    {!isCollapsed && (
                        <div className="transition-transform duration-700">
                            {isOpen ? <ChevronDown size={14} className="opacity-40" /> : <ChevronRight size={14} className="opacity-40" />}
                        </div>
                    )}
                </button>

                {!isCollapsed && isOpen && (
                    <div className="ml-10 mt-4 space-y-3 pl-8 border-l border-black/5 flex flex-col gap-1">
                        {item.childs.map(child => (
                            <Link
                                key={child.slug}
                                href={`/dashboard/${child.slug}`}
                                className={cn(
                                    "block p-3 text-[11px] font-black uppercase tracking-[0.4em] rounded-[1rem] transition-all duration-500 italic",
                                    pathname === `/dashboard/${child.slug}`
                                        ? "text-primary scale-105"
                                        : "text-brand-blue/20 hover:text-brand-blue hover:translate-x-2"
                                )}
                            >
                                {t(child.label)}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={`/dashboard/${item.slug}`}
            className={cn(
                "flex items-center gap-6 p-6 rounded-[2rem] transition-all duration-700 group relative overflow-hidden",
                pathname === `/dashboard/${item.slug}`
                    ? "bg-brand-blue text-white font-black shadow-2xl shadow-brand-blue/30 scale-[1.05] italic"
                    : "text-brand-blue/30 hover:bg-black/[0.03] hover:text-brand-blue border border-transparent"
            )}
        >
            <DynamicIcon
                name={item.icon}
                className={cn("w-5 h-5 transition-all duration-700", pathname === `/dashboard/${item.slug}` ? "scale-110" : "group-hover:scale-110")}
            />
            {!isCollapsed && <span className="text-[12px] font-black uppercase tracking-[0.3em] leading-none italic">{t(item.label)}</span>}
            
            {/* High-Performance Active Highlight */}
            {pathname === `/dashboard/${item.slug}` && (
                 <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-8 h-16 bg-white/20 blur-2xl rounded-full" />
            )}
        </Link>
    );
};