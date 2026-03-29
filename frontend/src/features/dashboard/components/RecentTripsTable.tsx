"use client";

import { useTranslations } from "next-intl";
import { Typography } from "@/components/atoms/Typography";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";
import apiClient from "@/utils/api/api.client";

interface TripData {
    id: string;
    origin: string;
    destination: string;
    status: string;
    amount: string;
    createdAt: string;
    driver?: { firstName: string; lastName: string };
    business?: { businessProfile?: { name: string } };
}

export const RecentTripsTable = () => {
    const t = useTranslations();
    const [trips, setTrips] = useState<TripData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await apiClient.get('/trip', { params: { take: 5, orderBy: JSON.stringify({ createdAt: 'desc' }) } });
                const result = response.data?.body || response.data;
                setTrips(result?.data || result || []);
            } catch (error) {
                console.error("Error fetching recent trips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'ACCEPTED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'IN_TRANSIT': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-100  animate-pulse" />
            ))}
        </div>
    );

    if (trips.length === 0) return (
        <div className="py-10 text-center opacity-40">
            <Typography variant="P" className="text-xs uppercase tracking-widest">{t('dashboard.no_trips') || 'No recent trips'}</Typography>
        </div>
    );

    return (
        <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                        <th className="px-4 py-2">Trip ID</th>
                        <th className="px-4 py-2">Route</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip) => (
                        <tr key={trip.id} className="group hover:translate-x-1 transition-transform">
                            <td className="px-4 py-4 rounded-l-2xl bg-white/50  border-y border-l border-slate-200 ">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/5  flex items-center justify-center border border-slate-200 ">
                                        <DynamicIcon name="Navigation" className="w-4 h-4 opacity-50" />
                                    </div>
                                    <Typography variant="P" className="text-[10px] font-bold text-slate-500 truncate w-16">
                                        #{trip.id.substring(0, 8)}
                                    </Typography>
                                </div>
                            </td>
                            <td className="px-4 py-4 bg-white/50  border-y border-slate-200 ">
                                <div className="space-y-1">
                                    <Typography variant="P" className="text-[11px] font-black text-brand-blue  truncate">
                                        {trip.origin}
                                    </Typography>
                                    <div className="flex items-center gap-1 opacity-40">
                                        <DynamicIcon name="ArrowRight" size={10} />
                                        <Typography variant="P" className="text-[9px] font-bold truncate">
                                            {trip.destination}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-4 bg-white/50  border-y border-slate-200  text-right">
                                <Typography variant="P" className="text-xs font-black text-brand-blue ">
                                    ${trip.amount}
                                </Typography>
                            </td>
                            <td className="px-4 py-4 rounded-r-2xl bg-white/50  border-y border-r border-slate-200  text-center">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                    getStatusColor(trip.status)
                                )}>
                                    {trip.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
