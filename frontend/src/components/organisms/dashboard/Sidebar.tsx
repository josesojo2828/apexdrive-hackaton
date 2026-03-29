"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Clock, 
    Users, 
    Car,
    Wallet, 
    Banknote,
    LogOut,
    Sparkles
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
    const pathname = usePathname();
    const { handleLogout } = useLogin();
    const { user } = useAuthStore();

    const isAdmin = user?.role === 'ADMIN';

    // IMPORTANT: Admin must have access to Flota (Car) for Global Management
    const adminItems = [
        { icon: LayoutDashboard, href: "/dashboard", label: "Panel" },
        { icon: Car, href: "/dashboard/cars", label: "Flota" },
        { icon: Sparkles, href: "/dashboard/ai-cars", label: "AI_LAB" },
        { icon: Banknote, href: "/dashboard/finance", label: "Finanzas" },
        { icon: Users, href: "/dashboard/users", label: "Usuarios" },
        { icon: Wallet, href: "/dashboard/auctions", label: "Subastas" },
        { icon: Clock, href: "/dashboard/rentals", label: "Reservas" },
    ];

    const userItems = [
        { icon: LayoutDashboard, href: "/dashboard", label: "Panel" },
        { icon: Car, href: "/dashboard/cars", label: "Flota" },
        { icon: Wallet, href: "/dashboard/auctions", label: "Subasta" },
        { icon: Clock, href: "/dashboard/rentals", label: "Reserva" },
    ];

    const menuItems = isAdmin ? adminItems : userItems;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <aside
                className={cn(
                    "fixed left-6 top-6 bottom-6 w-20 bg-[#1A1A1A] z-[120] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-[2.5rem] flex flex-col items-center py-10 shadow-2xl",
                    "lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-[150%]"
                )}
            >
                {/* Top: Branding */}
                <Link 
                    href="/"
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform mb-16 relative group"
                >
                    <LayoutDashboard size={20} />
                    <div className="absolute left-full ml-6 px-4 py-2 bg-white text-black text-[12px] font-black rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none whitespace-nowrap italic uppercase tracking-widest border border-black/5">
                        Inicio
                    </div>
                </Link>

                {/* Main Navigation */}
                <nav className="flex-1 flex flex-col gap-10">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative p-3 rounded-2xl transition-all duration-500 group",
                                    isActive ? "text-white" : "text-white/30 hover:text-white"
                                )}
                            >
                                <item.icon size={22} className={cn("transition-transform duration-500", isActive && "scale-110")} />
                                
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_#8cace8]" />
                                )}

                                {/* Hover Tooltip (Kinetic Style) */}
                                <div className="absolute left-full ml-6 px-4 py-2 bg-white text-black text-[12px] font-black rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none whitespace-nowrap italic uppercase tracking-widest border border-black/5 z-[130]">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto flex flex-col gap-10 pt-10 border-t border-white/5 w-full items-center">
                    <button
                        onClick={handleLogout}
                        className="p-3 text-white/30 hover:text-rose-500 transition-all hover:scale-110 group relative"
                    >
                        <LogOut size={22} />
                        <div className="absolute left-full ml-6 px-4 py-2 bg-rose-500 text-white text-[12px] font-black rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none whitespace-nowrap italic uppercase tracking-widest border border-black/5">
                            Exit_System
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
};