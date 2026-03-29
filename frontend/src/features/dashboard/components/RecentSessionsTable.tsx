"use client";

import { Typography } from "@/components/atoms/Typography";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { cn } from "@/utils/cn";

interface SessionData {
    id: string;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    }
}

export const RecentSessionsTable = ({ sessions }: { sessions: SessionData[] }) => {
    return (
        <div className="w-full overflow-hidden">
            <div className="grid grid-cols-1 gap-2">
                {sessions.map((session, i) => (
                    <div
                        key={session.id}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-3xl border border-slate-100  bg-white/40  hover:bg-white/60  transition-all group",
                            "animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both"
                        )}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center border border-slate-200  group-hover:scale-110 transition-transform">
                                <DynamicIcon name="Shield" className="w-4 h-4 text-[#4facfe]" />
                            </div>
                            <div>
                                <Typography variant="P" className="text-xs font-black uppercase text-slate-800  leading-none">
                                    {session.user.firstName} {session.user.lastName}
                                </Typography>
                                <Typography variant="P" className="text-[9px] font-bold text-slate-400  mt-1 uppercase tracking-widest leading-none">
                                    {session.ipAddress || '0.0.0.0'} <span className="mx-1">//</span> {session.user.role}
                                </Typography>
                            </div>
                        </div>

                        <div className="text-right">
                            <Typography variant="P" className="text-[10px] font-black tabular-nums text-slate-500 ">
                                {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <Typography variant="P" className="text-[8px] font-bold text-slate-300  uppercase tracking-tighter">
                                {new Date(session.createdAt).toLocaleDateString()}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
