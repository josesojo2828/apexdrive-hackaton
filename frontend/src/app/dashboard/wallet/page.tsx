"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wallet as WalletIcon, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Clock, 
    Gavel, 
    Car, 
    ChevronRight,
    Search,
    Filter,
    CreditCard,
    TrendingUp
} from 'lucide-react';

const TRANSACTIONS = [
    { id: '1', type: 'RENTAL_PAYMENT', amount: 1250.00, status: 'COMPLETED', date: 'Oct 24, 2024', ref: 'Porsche 911 GT3 RS', color: '#007AFF' },
    { id: '2', type: 'AUCTION_BID_ESCROW', amount: 5000.00, status: 'ACTIVE', date: 'Oct 25, 2024', ref: 'Ferrari Purosangue Bidding', color: '#FFD700' },
    { id: '3', type: 'WALLET_TOPUP', amount: 10000.00, status: 'COMPLETED', date: 'Oct 22, 2024', ref: 'Bank Transfer', color: '#34C759' },
    { id: '4', type: 'RENTAL_PAYMENT', amount: 850.00, status: 'COMPLETED', date: 'Oct 20, 2024', ref: 'Lamborghini Revuelto', color: '#007AFF' },
    { id: '5', type: 'AUCTION_REFUND', amount: 3000.00, status: 'REFUNDED', date: 'Oct 18, 2024', ref: 'Lost Bid - Audi RS6', color: '#FF3B30' },
];

const ACTIVE_BIDS = [
    { id: 'b1', car: 'Ferrari Purosangue', currentBid: 245000, userBid: 240000, timeLeft: '2h 15m', status: 'OUTBID' },
    { id: 'b2', car: 'Mclaren 750S', currentBid: 185000, userBid: 185000, timeLeft: '5h 40m', status: 'WINNING' },
];

export default function WalletPage() {
    const [filter, setFilter] = useState('ALL');

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-6xl font-black italic tracking-tighter text-[#1D1D1F] uppercase leading-none">
                        APEX <span className="text-[#007AFF]">WALLET</span>
                    </h1>
                    <p className="text-[#86868B] font-medium mt-2">Manage your luxury fleet transactions and escrowed bids.</p>
                </motion.div>

                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                        <ArrowUpRight size={18} /> TOP UP BALANCE
                    </button>
                    <button className="px-6 py-3 border-2 border-[#1D1D1F] text-[#1D1D1F] rounded-full font-bold text-sm hover:bg-[#1D1D1F]/5 transition-colors">
                        WITHDRAW
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Balance Card Section */}
                <motion.div 
                    className="lg:col-span-4 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-[#1D1D1F] rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[320px] flex flex-col justify-between group">
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#007AFF]/20 blur-[100px] rounded-full group-hover:bg-[#007AFF]/30 transition-colors" />
                        
                        <div className="flex justify-between items-start relative z-10">
                            <WalletIcon size={32} />
                            <CreditCard size={32} className="opacity-20" />
                        </div>

                        <div className="relative z-10">
                            <p className="text-sm font-medium opacity-50 uppercase tracking-widest mb-1">TOTAL BALANCE</p>
                            <h2 className="text-5xl font-black tracking-tighter">$425,890.00</h2>
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <p className="text-xs font-medium opacity-30 uppercase">ACCOUNT HOLDER</p>
                                <p className="text-sm font-bold">JAMES SMITH</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium opacity-30 uppercase">VALID THRU</p>
                                <p className="text-sm font-bold">12 / 28</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-white rounded-[2.5rem] border border-[#F5F5F7] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#1D1D1F]">Monthly Spending</p>
                                <p className="text-xs text-[#86868B]">+12.5% from last month</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#86868B]">Rentals</span>
                                <span className="font-bold text-[#1D1D1F]">$12,400</span>
                            </div>
                            <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                                <div className="h-full bg-[#007AFF]" style={{ width: '65%' }} />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#86868B]">Auctions</span>
                                <span className="font-bold text-[#1D1D1F]">$45,000</span>
                            </div>
                            <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                                <div className="h-full bg-[#1D1D1F]" style={{ width: '35%' }} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Transactions & Bids Section */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Active Bids Preview */}
                    <motion.div 
                        className="bg-white rounded-[2.5rem] border border-[#F5F5F7] p-8 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <Gavel size={24} className="text-[#FFD700]" />
                                <h3 className="text-xl font-black italic tracking-tight text-[#1D1D1F]">ESCROW BIDS</h3>
                            </div>
                            <span className="text-xs font-bold text-[#86868B] bg-[#F5F5F7] px-3 py-1 rounded-full uppercase">Live Updates</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ACTIVE_BIDS.map((bid) => (
                                <div key={bid.id} className="p-5 rounded-[1.5rem] bg-[#F5F5F7] border border-[#1D1D1F]/5 group cursor-pointer hover:border-[#007AFF]/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-bold text-[#86868B] uppercase mb-1">{bid.car}</p>
                                            <p className="text-2xl font-black italic tracking-tighter">${bid.currentBid.toLocaleString()}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-black ${
                                            bid.status === 'WINNING' ? 'bg-[#34C759] text-white' : 'bg-[#FF3B30] text-white'
                                        }`}>
                                            {bid.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-[#86868B]">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {bid.timeLeft}</span>
                                        <span className="font-bold text-[#1D1D1F]">Your Bid: ${bid.userBid.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Transaction List */}
                    <motion.div 
                        className="bg-white rounded-[2.5rem] border border-[#F5F5F7] p-8 shadow-sm flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <h3 className="text-xl font-black italic tracking-tight text-[#1D1D1F]">TRANSACTION HISTORY</h3>
                            
                            <div className="flex items-center gap-2 p-1 bg-[#F5F5F7] rounded-full">
                                {['ALL', 'RENTALS', 'AUCTIONS'].map((item) => (
                                    <button 
                                        key={item}
                                        onClick={() => setFilter(item)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                                            filter === item ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B]'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {TRANSACTIONS.map((tx) => (
                                <div key={tx.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-[#F5F5F7] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${tx.color}15`, color: tx.color }}>
                                            {tx.type === 'RENTAL_PAYMENT' && <Car size={20} />}
                                            {tx.type === 'AUCTION_BID_ESCROW' && <Gavel size={20} />}
                                            {tx.type === 'WALLET_TOPUP' && <ArrowDownLeft size={20} />}
                                            {tx.type === 'AUCTION_REFUND' && <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1D1D1F]">{tx.ref}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black uppercase text-[#86868B]">{tx.type.replace(/_/g, ' ')}</span>
                                                <span className="w-1 h-1 rounded-full bg-[#D2D2D7]" />
                                                <span className="text-[10px] font-medium text-[#86868B]">{tx.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black tracking-tighter ${
                                            tx.type === 'WALLET_TOPUP' || tx.type === 'AUCTION_REFUND' ? 'text-[#34C759]' : 'text-[#1D1D1F]'
                                        }`}>
                                            {tx.type === 'WALLET_TOPUP' || tx.type === 'AUCTION_REFUND' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-black text-[#86868B] uppercase">{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-4 border-2 border-[#F5F5F7] rounded-2xl text-[10px] font-black text-[#86868B] uppercase hover:bg-[#F5F5F7] transition-all flex items-center justify-center gap-2">
                            VIEW FULL STATEMENT <ChevronRight size={14} />
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
