"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useAuctions, Auction, Bid } from "@/features/auctions/hooks/useAuctions";
import { Gavel, Clock, ArrowLeft, Users, Trophy, DollarSign, Activity, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SimpleCountdown } from "../page";

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getAuction, placeBid, socket } = useAuctions();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState("");
    const [bidding, setBidding] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getAuction(id);
                setAuction(data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, getAuction]);

    // WebSocket Listener for real-time bid updates on this specific auction
    useEffect(() => {
        if (!socket) return;
        
        socket.on(`auction:${id}:newBid`, ({ bid, auction: updatedAuction }: { bid: Bid, auction: Auction }) => {
            setAuction(prev => {
                if (!prev) return updatedAuction;
                return {
                    ...updatedAuction,
                    bids: [bid, ...(prev.bids || [])]
                }
            });
        });

        return () => {
            socket.off(`auction:${id}:newBid`);
        };
    }, [id, socket]);

    const handleBid = async () => {
        const amount = Number(bidAmount);
        if (!amount || amount <= Number(auction?.currentPrice || 0)) return;
        setBidding(true);
        try {
            await placeBid(id, amount);
            setBidAmount("");
        } finally {
            setBidding(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-brand-blue/20">Syncronizing Transmission...</div>;
    if (!auction) return <div className="p-20 text-center text-rose-500 text-[10px] font-black uppercase tracking-[0.5em]">Protocol Error: Not Found</div>;

    const isActive = auction.status === "ACTIVE";

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/auctions" className="inline-flex items-center gap-2 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] hover:text-black transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Hall
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em] font-mono">NODE_744 // {auction.id.substring(0, 8)}</span>
                    <div className={cn("px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest", isActive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-black/5 border-black/10 text-black/40")}>
                        {auction.status}
                    </div>
                </div>
            </div>

            {/* Split Layout: Info & Interaction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Col: Asset & Data (Simple Ficha) */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden p-10 flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-md bg-black/[0.04] text-[9px] font-black text-black/30 uppercase tracking-[0.3em]">Module // Ficha Técnica</div>
                            <h1 className="text-4xl font-black text-black italic tracking-tighter uppercase leading-none">{auction.car?.brand} <span className="text-black/5">{auction.car?.model}</span></h1>
                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-black/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Year</p>
                                    <p className="text-[14px] font-black text-black">{auction.car?.year}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Plate</p>
                                    <p className="text-[14px] font-black text-black italic">{auction.car?.plate}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Type</p>
                                    <p className="text-[14px] font-black text-black uppercase">{auction.car?.type}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-64 h-40 bg-black/[0.01] rounded-2xl border border-black/5 flex items-center justify-center p-4">
                            <img src={auction.car?.images?.[0] || ""} alt="" className="w-full h-full object-contain filter grayscale opacity-50 contrast-125" />
                        </div>
                    </div>

                    {/* Bid History (Simple List) */}
                    <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="px-8 py-5 border-b border-black/5 bg-black/[0.01] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-black/20" />
                                <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">Historical Feed</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-secondary" />
                                <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{auction.bids?.length || 0} Synced</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-black/5">
                            {auction.bids?.length > 0 ? (
                                auction.bids.map((bid, i) => (
                                    <div key={bid.id} className={cn("px-8 py-5 flex items-center justify-between group hover:bg-black/[0.01] transition-colors", i === 0 && "bg-black/[0.02]")}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white", i === 0 ? "bg-black" : "bg-black/[0.05] text-black/20")}>
                                                {bid.user?.firstName?.[0]}{bid.user?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-black uppercase">{bid.user?.firstName} {bid.user?.lastName}</p>
                                                <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("text-[18px] font-black italic tracking-tighter", i === 0 ? "text-black" : "text-black/40")}>$ {Number(bid.amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10 grayscale">
                                    <Gavel size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.8em]">No Transmissions Logged</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Current Live State & Interaction */}
                <div className="space-y-10">
                    <div className="bg-black text-white rounded-2xl shadow-xl overflow-hidden p-10 space-y-10 border border-white/5 relative">
                        
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Current Adjudication</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                </div>
                                <div className="text-6xl font-black italic tracking-tighter leading-none">$ {Number(auction.currentPrice).toLocaleString()}</div>
                                {auction.bids && auction.bids.length > 0 && (
                                    <div className="flex items-center gap-3 mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 w-fit">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                            <Users size={10} className="text-white" />
                                        </div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                            Last Transmission: <span className="text-secondary">{auction.bids[0].user?.firstName} {auction.bids[0].user?.lastName}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Starting At</p>
                                    <p className="text-[14px] font-black italic">$ {Number(auction.startingPrice).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Time Remaining</p>
                                    <SimpleCountdown endDate={auction.endDate} />
                                </div>
                            </div>
                        </div>

                        {isActive ? (
                             <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="grid gap-2">
                                     <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">Manual Input Injection</label>
                                     <div className="relative">
                                          <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                          <input 
                                             type="number"
                                             value={bidAmount}
                                             onChange={e => setBidAmount(e.target.value)}
                                             placeholder={`Min: $${(Number(auction.currentPrice) + 1).toLocaleString()}`}
                                             className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-5 py-4 text-[14px] font-black text-white outline-none focus:border-white/30 transition-all"
                                          />
                                     </div>
                                </div>
                                <button
                                    onClick={handleBid}
                                    disabled={bidding}
                                    className="w-full py-5 bg-white text-black hover:bg-white/90 transition-all rounded-xl text-[11px] font-black uppercase tracking-[0.5em] shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50"
                                >
                                    {bidding ? "Transmitting..." : "Place Sync Bid"}
                                </button>
                             </div>
                        ) : (
                            <div className="pt-10 border-t border-white/10 text-center space-y-4">
                                <Trophy size={48} className="mx-auto text-secondary opacity-50" />
                                <div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-1">Final Resolution</p>
                                    <p className="text-xl font-black italic uppercase tracking-tighter">
                                        {auction.winner ? `${auction.winner.firstName} ${auction.winner.lastName}` : "Closed / No Winner"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-8 space-y-6">
                         <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-black/10" />
                              <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">Event Timeline</h4>
                         </div>
                         <div className="space-y-4">
                              <div className="flex justify-between items-center text-[11px] font-bold text-black/60 uppercase">
                                   <span>Opened At</span>
                                   <span>{new Date(auction.startDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] font-bold text-black/60 uppercase">
                                   <span>Closing At</span>
                                   <span>{new Date(auction.endDate).toLocaleDateString()}</span>
                              </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
