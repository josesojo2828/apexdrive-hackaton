"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/features/auth/services/authService";
import { Typography } from "@/components/atoms/Typography";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

interface ActivityLog {
    id: string;
    action: string;
    details: Record<string, unknown>;
    createdAt: string;
    user?: {
        firstName: string;
        lastName: string;
        role: string;
    }
}

interface ActivityTimelineProps {
    userId?: string;
    limit?: number;
    className?: string;
}

export const ActivityTimeline = ({ userId, limit = 10, className }: ActivityTimelineProps) => {
    const t = useTranslations();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const query = userId ? `?userId=${userId}&limit=${limit}` : `?limit=${limit}`;
                const response = await apiClient.get(`/dashboard/activity${query}`);
                const result = response.data?.body || response.data;
                setActivities(Array.isArray(result) ? result : []);
                setError(null);
            } catch (err) {
                console.error("Error fetching activity:", err);
                setError("error.fetch_activity");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [userId, limit]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200  shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-slate-200  rounded w-1/4" />
                            <div className="h-5 bg-slate-100  rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error || activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 opacity-30 text-center">
                <DynamicIcon name="History" className="w-12 h-12 mb-3" />
                <Typography variant="P" className="text-xs font-black uppercase tracking-widest">
                    {activities.length === 0 ? t('dashboard.no_activity') : t(error || '')}
                </Typography>
            </div>
        );
    }

    return (
        <div className={cn("relative space-y-8 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 ", className)}>
            {activities.map((activity) => (
                <div key={activity.id} className="relative flex gap-6 group">
                    {/* Icon Node */}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-white  border border-slate-200  flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:border-[#00f2fe]/50 transition-all duration-300">
                        <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <Typography variant="P" className="text-[10px] font-black text-[#4facfe] uppercase tracking-widest">
                                {activity.action.replace(/_/g, ' ')}
                            </Typography>
                            <span className="text-[9px] font-bold text-slate-400 tabular-nums">
                                {new Date(activity.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="bg-slate-50  border border-slate-100  rounded-2xl p-4 transition-colors group-hover:bg-slate-100 ">
                            <Typography variant="P" className="text-xs text-slate-600  leading-relaxed italic">
                                {String(activity.details?.message || `User ${activity.user?.firstName || ''} performed ${activity.action}`)}
                            </Typography>

                            {activity.user && !userId && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe]" />
                                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                                        {activity.user.firstName} {activity.user.lastName} <span className="mx-1">{'//'}</span> {activity.user.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
