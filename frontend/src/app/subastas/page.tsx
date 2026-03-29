"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { useAuctions, Auction } from "@/features/auctions/hooks/useAuctions";
import { useAuthStore } from "@/store/useAuthStore";
import { Gavel, Clock, Users, ArrowRight, TrendingUp, ShieldCheck, Timer } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Reuse the SimpleCountdown from the dashboard
function SimpleCountdown({ endDate }: { endDate: string }) {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const tick = () => {
            const diff = new Date(endDate).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft("Finalizada"); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            if (d > 0) setTimeLeft(`${d}d ${h}h`);
            else setTimeLeft(`${h}h ${m}m ${s}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    return (
        <div className={cn("inline-flex items-center gap-2 font-mono text-[10px] font-black tracking-tight px-4 py-2 rounded-full", 
            timeLeft === "Finalizada" ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary")}>
            <Timer size={12} className={cn(timeLeft !== "Finalizada" && "animate-pulse")} />
            {timeLeft}
        </div>
    );
}

export default function AuctionsPublicPage() {
    const { auctions, loading } = useAuctions();
    const { isAuthenticated } = useAuthStore();
    const [filter, setFilter] = useState<"ACTIVE" | "UPCOMING" | "RESOLVED">("ACTIVE");

    const filtered = auctions.filter(a => a.status === filter);

    return (
        <div className="min-h-screen bg-[#FDFDFD] selection:bg-primary selection:text-black">
            <Header variant="dark" />

            <main className="pt-48 pb-32 px-10 max-w-[1900px] mx-auto">
                <div className="mb-20 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] text-black">
                        Subastas
                    </h1>
                    <div className="flex items-center gap-4">
                         {(["ACTIVE", "UPCOMING", "RESOLVED"] as const).map(t => (
                             <button 
                                key={t} 
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                    filter === t ? "bg-black text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
                                )}
                             >
                                 {t === "ACTIVE" ? "En Vivo" : t === "UPCOMING" ? "Próximas" : "Finalizadas"}
                             </button>
                         ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                         {[1, 2, 3, 4].map(i => (
                             <div key={i} className="h-[600px] bg-black/5 rounded-[3rem] animate-pulse" />
                         ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-40 text-center border-2 border-dashed border-black/5 rounded-[4rem] space-y-6">
                         <Gavel size={48} className="mx-auto text-black/5" />
                         <p className="text-[12px] font-black text-black/20 uppercase tracking-[0.5em]">No hay subastas en este estado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                         <AnimatePresence mode="popLayout">
                             {filtered.map((auction, idx) => (
                                 <AuctionPublicCard 
                                    key={auction.id} 
                                    auction={auction} 
                                    index={idx} 
                                    isAuthenticated={isAuthenticated} 
                                 />
                             ))}
                         </AnimatePresence>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function AuctionPublicCard({ auction, index, isAuthenticated }: { auction: Auction; index: number; isAuthenticated: boolean }) {
    const highestBid = auction.bids?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col bg-white rounded-[3rem] p-4 border border-black/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700"
        >
            {/* Visual Header */}
            <div className="relative aspect-[4/5] bg-[#F1F1F3] rounded-[2.5rem] overflow-hidden mb-8 border border-black/[0.03]">
                {auction.car?.images?.[0] ? (
                    <img
                        src={auction.car.images[0]}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt={auction.car?.model}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-300">
                        <Gavel size={40} className="text-white/5" />
                    </div>
                )}

                {/* Status Overlays */}
                <div className="absolute top-6 left-6 flex flex-col gap-3 items-start">
                     <SimpleCountdown endDate={auction.endDate} />
                     <div className="px-5 py-2 bg-black/80 backdrop-blur-xl rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                          <Users size={12} className="text-primary" />
                          {auction.bids?.length || 0} Pujas Realizadas
                     </div>
                </div>

                {/* Auction Badge */}
                <div className="absolute top-6 right-6">
                     <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black shadow-xl shadow-primary/20 rotate-12 group-hover:rotate-0 transition-all">
                          <TrendingUp size={18} />
                     </div>
                </div>
            </div>

            {/* Information */}
            <div className="px-4 space-y-6 pb-4">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={10} className="text-primary" />
                            <p className="text-[8px] font-black text-black/30 uppercase tracking-[0.2em]">Live // Verificado</p>
                        </div>
                        <h3 className="text-3xl font-black text-black tracking-tighter uppercase italic leading-none">
                            {auction.car?.brand} <span className="text-black/20">{auction.car?.model}</span>
                        </h3>
                    </div>

                    <div className="flex justify-between items-end p-6 bg-black rounded-3xl text-white">
                         <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-primary">Oferta Actual</p>
                              <p className="text-3xl font-black italic serif tracking-tighter leading-none">
                                  ${Number(auction.currentPrice).toLocaleString()}
                              </p>
                         </div>
                         <div className="text-right">
                              <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Base</p>
                              <p className="text-xs font-bold text-white/40 italic">${Number(auction.startingPrice).toLocaleString()}</p>
                         </div>
                    </div>
                </div>

                <div className="pt-2">
                    {isAuthenticated ? (
                        <Link href={`/dashboard/auctions/${auction.id}`} className="block">
                            <button className="w-full py-5 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all shadow-xl shadow-primary/10 active:scale-95 flex items-center justify-center gap-4 group/btn">
                                pujar ahora <Gavel size={14} className="group-hover/btn:rotate-45 transition-transform" />
                            </button>
                        </Link>
                    ) : (
                        <div className="space-y-4">
                             <Link href="/login" className="block">
                                <button className="w-full py-5 bg-white border border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-4 group/btn">
                                    iniciar sesión para pujar <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                             </Link>
                             <p className="text-[9px] text-center font-bold text-black/20 uppercase tracking-widest italic">Solo modo visualización activo</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
