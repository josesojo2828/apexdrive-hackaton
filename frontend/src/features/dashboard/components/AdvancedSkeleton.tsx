"use client";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface AdvancedSkeletonProps {
    type: "table" | "cards" | "info";
    message?: string;
    rows?: number;
    className?: string;
}

export const AdvancedSkeleton = ({ type, message, rows = 5, className }: AdvancedSkeletonProps) => {
    const t = useTranslations();

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Loading Message Overlay (Optional but requested) */}
            <div className="flex items-center gap-3 mb-6 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-[#00f2fe]" />
                <Typography variant="P" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    {message || t('action.loading_data')}
                </Typography>
            </div>

            {type === "table" && (
                <div className="border border-slate-100  rounded-[2rem] overflow-hidden bg-white/50 ">
                    {[...Array(rows)].map((_, i) => (
                        <div key={i} className={`flex items-center gap-6 px-8 py-5 border-b border-slate-100  animate-pulse`} style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="w-10 h-10 rounded-xl bg-slate-200 " />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-200  rounded w-1/3" />
                                <div className="h-2 bg-slate-100  rounded w-1/4" />
                            </div>
                            <div className="h-8 w-24 bg-slate-200  rounded-xl" />
                        </div>
                    ))}
                </div>
            )}

            {type === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(rows)].map((_, i) => (
                        <div key={i} className="bg-white/50  border border-slate-100  rounded-3xl p-6 space-y-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex justify-between">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 " />
                                <div className="w-16 h-6 bg-slate-200  rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200  rounded w-3/4" />
                                <div className="h-3 bg-slate-100  rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {type === "info" && (
                <div className="space-y-6 animate-pulse">
                    {[...Array(rows)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-5 h-5 bg-slate-200  rounded text-transparent" />
                            <div className="space-y-2 flex-1">
                                <div className="h-2 bg-slate-200  rounded w-24" />
                                <div className="h-4 bg-slate-100  rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const EmptyState = ({ icon = "Search", title, message }: { icon?: string; title?: string; message?: string }) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100  flex items-center justify-center mb-6 border border-slate-200 ">
                <DynamicIcon name={icon} className="w-8 h-8 opacity-20" />
            </div>
            <Typography variant="H4" className="mb-2 !text-lg font-black uppercase tracking-tighter">
                {title || t('status.no_results')}
            </Typography>
            <Typography variant="P" className="text-slate-500 text-sm max-w-xs italic">
                {message || t('status.no_results_desc')}
            </Typography>
        </div>
    );
};
