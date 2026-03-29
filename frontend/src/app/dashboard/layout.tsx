"use client";

import { useState } from "react";
import { AlertContainer } from "@/components/organisms/AlertContainer";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { Sidebar } from "@/components/organisms/dashboard/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { NotificationBell } from "@/components/organisms/dashboard/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-[#FCFBFA] text-[#1D1D1F] overflow-hidden relative font-sans selection:bg-brand-blue selection:text-white">
                
                {/* Floating Sidebar (Fixed Side) */}
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-32 p-8 overflow-y-auto scrollbar-hide py-10">
                    <div className="max-w-[1600px] mx-auto w-full space-y-10">
                        
                        {/* Minimal Top Bar - Refined scale */}
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-black/5">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className="p-3.5 rounded-full bg-white text-[#1D1D1F] lg:hidden hover:shadow-lg transition-all active:scale-95 shadow-sm border border-black/5"
                                >
                                    <Menu size={18} />
                                </button>
                                
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-[#1D1D1F]/20 uppercase tracking-[0.4em] leading-none mb-1">OPERATIONAL_NODE // 07</p>
                                    <h1 className="text-xl md:text-2xl font-black text-brand-blue tracking-tighter uppercase leading-none italic">
                                        Hello, <span className="text-black/30">{user?.firstName || 'Operator'}</span>
                                    </h1>
                                    <p className="text-[11px] font-bold text-[#1D1D1F]/30 tracking-tight leading-relaxed uppercase opacity-80">
                                        System state: healthy. Ready for deployment.
                                    </p>
                                </div>
                            </div>

                            {/* Actions Right (Minimalist & Flat) */}
                            <div className="flex items-center gap-3">
                                <NotificationBell />

                                <Link href="/dashboard/profile" className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center font-black text-white text-[14px] italic uppercase tracking-tighter border border-black/5 shadow-xl hover:scale-105 transition-all">
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </Link>
                            </div>
                        </header>

                        {/* Page Content Rendered Here */}
                        <div className="animate-fade-in relative z-10 pb-20">
                            {children}
                        </div>
                    </div>
                </main>

                <AlertContainer />
            </div>
        </AuthGuard>
    );
}