"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Bell, Check, X, BellOff, Info, Clock } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

// Simple helper to avoid external dependencies for now (permission issues)
function formatDistance(date: Date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return `hace ${Math.floor(diff / 86400)} d`;
}

export const NotificationBell = () => {
    const { user } = useAuthStore();
    const {
        notifications,
        unreadCount,
        init,
        markAsRead,
        markAllAsRead,
        loading,
        fetchNotifications
    } = useNotificationStore();
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user?.id) {
            init(user.id);
        }
    }, [user?.id, init]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className={cn(
                    "p-3.5 w-12 h-12 rounded-2xl bg-white text-[#1D1D1F]/30 hover:text-brand-blue transition-all shadow-sm border border-black/5 flex items-center justify-center relative active:scale-95",
                    isOpen && "text-brand-blue border-brand-blue/20 ring-4 ring-brand-blue/5 shadow-lg shadow-brand-blue/10"
                )}
            >
                <Bell size={18} className={cn(isOpen && "italic")} />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-blue text-[8px] font-black text-white shadow-lg border-2 border-white ring-2 ring-brand-blue/20">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl border border-black/10 shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-sm font-black text-[#1D1D1F] uppercase tracking-tighter">Notificaciones</h3>
                                <p className="text-[10px] font-bold text-[#1D1D1F]/30 uppercase tracking-[0.2em] mt-0.5">
                                    {unreadCount} sin leer
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-[10px] font-black text-brand-blue hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                                >
                                    <Check size={12} /> Marcar todo
                                </button>
                            )}
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto bg-white">
                            {loading && notifications.length === 0 ? (
                                <div className="p-12 flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 rounded-full border-4 border-black/5 border-t-brand-blue animate-spin" />
                                    <p className="text-[10px] font-black text-[#1D1D1F]/20 uppercase tracking-widest">Sincronizando...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-16 flex flex-col items-center gap-6 text-center">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
                                        <BellOff size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-[#1D1D1F] uppercase tracking-widest">Buzón vacío</p>
                                        <p className="text-[10px] font-bold text-[#1D1D1F]/30 uppercase tracking-tight">No hay actualizaciones en este momento.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-6 hover:bg-slate-50 transition-all cursor-pointer relative group",
                                                !notif.isRead && "bg-brand-blue/[0.02]"
                                            )}
                                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                                        >
                                            {!notif.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue" />
                                            )}
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110",
                                                    notif.isRead ? "bg-slate-100 text-slate-400" : "bg-white text-brand-blue border border-black/5"
                                                )}>
                                                    <Info size={16} />
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={cn(
                                                            "text-[12px] leading-tight tracking-tight uppercase",
                                                            notif.isRead ? "font-bold text-[#1D1D1F]/50" : "font-black text-[#1D1D1F]"
                                                        )}>
                                                            {notif.title}
                                                        </p>
                                                        <span className="text-[9px] font-bold text-[#1D1D1F]/20 flex items-center gap-1 mt-0.5 flex-shrink-0">
                                                            <Clock size={10} />
                                                            {formatDistance(new Date(notif.createdAt))}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-[11px] leading-relaxed tracking-tight",
                                                        notif.isRead ? "text-[#1D1D1F]/40" : "text-[#1D1D1F]/60"
                                                    )}>
                                                        {notif.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-black/5 text-center">
                            <button 
                                onClick={toggleOpen}
                                className="text-[10px] font-black text-[#1D1D1F]/20 hover:text-[#1D1D1F] transition-colors uppercase tracking-[0.3em]"
                            >
                                Cerrar Panel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
