"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Menu, ArrowRight, Home, ShoppingBag, Shield, Gavel } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Logo } from "../atoms/Logo";

interface HeaderProps {
    variant?: "light" | "dark";
}

export const Header = ({ variant = "light" }: HeaderProps) => {
    const { isAuthenticated, user } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDark = variant === "dark";

    const navLinks = [
        { href: "/store", label: "Tienda", icon: <ShoppingBag size={14}/> },
        { href: "/subastas", label: "Subastas", icon: <Gavel size={14}/> },
        { href: "/", label: "Inicio", icon: <Home size={14}/> },
    ];

    return (
        <>
            <nav className={cn(
                "fixed w-full top-0 z-50 px-6 md:px-10 py-6 md:py-8 backdrop-blur-3xl border-b",
                isDark 
                    ? "bg-black/60 border-white/5" 
                    : "bg-white/40 border-black/5"
            )}>
                <div className="max-w-[1900px] mx-auto flex items-center justify-between">
                    {/* Minimalist Navigation Left - Desktop */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.5em] transition-colors",
                                    isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logo (Shield + Text) */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 group">
                        <Logo className="w-8 h-8" variant={isDark ? 'dark' : 'light'} />
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.8em] leading-none mb-1 group-hover:tracking-[1.2em] transition-all duration-700",
                                isDark ? "text-white" : "text-black"
                            )}>Apex</span>
                            <span className={cn(
                                "text-[7px] font-black uppercase tracking-widest opacity-20",
                                isDark ? "text-white" : "text-black"
                            )}>Velocity</span>
                        </div>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 md:gap-10">
                         <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn(
                                "text-[9px] font-black uppercase tracking-[0.5em] transition-all flex items-center gap-3",
                                isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                            )}
                         >
                             {isMenuOpen ? "CERRAR" : "MENÚ"} 
                             <Menu size={14} className={cn(
                                "transition-transform", 
                                isDark ? "text-white/10" : "text-black/10",
                                isMenuOpen && "rotate-90"
                             )} />
                         </button>
                         
                         <div className={cn("hidden md:block w-[1px] h-4", isDark ? "bg-white/5" : "bg-black/5")} />
                         
                         <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                             <div className="flex items-center gap-4 group">
                                 <div className={cn(
                                     "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg",
                                     isDark ? "bg-white text-black shadow-white/5" : "bg-black text-white shadow-black/10",
                                     "group-hover:scale-110"
                                 )}>
                                     <User size={14} />
                                 </div>
                                 <span className={cn(
                                     "hidden md:block text-[8px] font-black uppercase tracking-[0.3em] transition-colors",
                                     isDark ? "text-white" : "text-black",
                                     "group-hover:text-primary"
                                 )}>
                                     {isAuthenticated ? (user?.firstName || 'Acceso') : 'Ingresar'}
                                 </span>
                             </div>
                         </Link>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Dim Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />
                        
                        {/* Sidebar */}
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[500px] z-50 bg-black/95 backdrop-blur-3xl border-l border-white/5 flex flex-col pt-40 px-10 md:px-16"
                        >
                            <div className="flex flex-col gap-10">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                    >
                                        <Link 
                                            href={link.href} 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group relative block"
                                        >
                                            <div className="flex items-center gap-6 py-3 border-b border-white/5 group-hover:border-primary/50 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:text-black transition-all group-hover:scale-110">
                                                    {link.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white group-hover:text-primary transition-colors">
                                                        {link.label}
                                                    </h3>
                                                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Protocolo-Link-0{i+1}</p>
                                                </div>
                                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                                
                                {isAuthenticated && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Link 
                                            href="/dashboard" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group relative block"
                                        >
                                            <div className="flex items-center gap-6 py-4 border-b border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center group-hover:scale-110 transition-all">
                                                    <Shield size={12}/>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-primary">
                                                        Escritorio
                                                    </h3>
                                                    <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">Acceso Seguro a Consola</p>
                                                </div>
                                                <ArrowRight className="ml-auto opacity-100 text-primary" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                            {/* Sidebar Footer Info */}
                            <div className="mt-auto py-12 space-y-8">
                                <div className="space-y-2 opacity-20 group">
                                     <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Próximo Lanzamiento</p>
                                     <p className="text-[9px] font-medium text-white italic">Apex Velocity "Ghost Series" 2026</p>
                                </div>
                                <h4 className="text-[5vw] font-black italic uppercase tracking-tighter leading-none select-none italic serif text-white opacity-5">Navegación</h4>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
