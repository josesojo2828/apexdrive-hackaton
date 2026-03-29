"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { useCars } from "@/features/cars/hooks/useCars";
import { Search, Filter, ShoppingBag, ArrowRight, Gauge, Fuel, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function StorePage() {
    const { cars, loading, buyCar } = useCars(undefined, true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("TODOS");
    
    // Purchase State
    const [selectedCar, setSelectedCar] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [txHash, setTxHash] = useState("");

    const categories = ["TODOS", "SPORTS", "HYBRID", "ELECTRIC", "CLASSIC"];

    const filtered = cars.filter(car => {
        const matchesSearch = car.brand.toLowerCase().includes(search.toLowerCase()) || 
                             car.model.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "TODOS" || car.type === category;
        return matchesSearch && matchesCategory;
    });

    const handlePurchase = async () => {
        if (!selectedCar) return;
        setIsProcessing(true);
        try {
            await buyCar(selectedCar.id);
            setTxHash(Math.random().toString(36).substring(7).toUpperCase());
            setIsSuccess(true);
        } catch (error) {
            console.error("Purchase failed", error);
            alert("Error al procesar la compra. Verifica tu conexión.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] selection:bg-black selection:text-white text-[#1D1D1F]">
            <Header variant="dark" />

            <main className="pt-48 pb-32 px-10 max-w-[1900px] mx-auto">
                {/* Simplified Intro - AS REQUESTED: Only Title */}
                <div className="mb-20">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] text-[#1D1D1F]">
                        Inventario
                    </h1>
                </div>

                {/* Technical Control Bar (Filters) */}
                <div className="sticky top-40 z-40 flex flex-col xl:flex-row items-center gap-4 bg-white/80 backdrop-blur-xl border border-black/5 p-3 rounded-[2rem] shadow-sm mb-16">
                    <div className="relative flex-1 w-full group">
                        <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar modelo o marca..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-black/[0.02] border-none rounded-2xl text-[11px] font-bold text-black placeholder:text-black/10 focus:outline-none focus:ring-1 focus:ring-black/5 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 p-1 overflow-x-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={cn(
                                    "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                                    category === cat
                                        ? "bg-black text-white shadow-xl shadow-black/10"
                                        : "bg-white text-black/30 hover:bg-black/5 hover:text-black"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="hidden xl:flex items-center gap-2 border-l border-black/5 pl-4 ml-2">
                        <button className="p-4 text-black/20 hover:text-black transition-colors">
                            <Filter size={14} />
                        </button>
                    </div>
                </div>

                {/* Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-[480px] bg-black/5 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((car, idx) => (
                                <CarStoreCard 
                                    key={car.id} 
                                    car={car} 
                                    index={idx} 
                                    onBuy={() => setSelectedCar(car)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="py-40 text-center border-2 border-dashed border-black/5 rounded-[4rem]">
                        <ShoppingBag size={48} className="mx-auto text-black/5 mb-6" />
                        <p className="text-[12px] font-black text-black/20 uppercase tracking-[0.5em]">Inventory Empty // Search Again</p>
                    </div>
                )}
            </main>

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedCar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-md" 
                            onClick={() => !isProcessing && setSelectedCar(null)}
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative w-full max-w-xl bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-black/5"
                        >
                            {isSuccess ? (
                                <div className="p-12 text-center space-y-8 py-20">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Asset Secured</h2>
                                        <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.2em]">Transaction Hash: {txHash}</p>
                                    </div>
                                    <p className="text-[13px] font-medium text-black/60 max-w-sm mx-auto">La transferencia de propiedad ha sido procesada exitosamente. El activo ahora forma parte de tu colección privada.</p>
                                    <button 
                                        onClick={() => {
                                            setSelectedCar(null);
                                            setIsSuccess(false);
                                        }}
                                        className="px-10 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-colors"
                                    >
                                        Explorar Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="p-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.4em]">Checkout // Module</p>
                                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Finalizar Adquisición</h2>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedCar(null)}
                                            className="p-3 text-black/20 hover:text-black transition-colors"
                                        >
                                            <Zap size={20} />
                                        </button>
                                    </div>

                                    <div className="bg-black text-white rounded-[2rem] p-8 flex items-center justify-between">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Vehicle Asset</p>
                                                <p className="text-xl font-black italic uppercase">{selectedCar.brand} {selectedCar.model}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Contract Amount</p>
                                                <p className="text-2xl font-black italic tracking-tighter text-emerald-400">${selectedCar.basePrice?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="w-40 h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                                            <img src={selectedCar.images?.[0]} className="w-full h-full object-cover filter grayscale" alt="" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-5 bg-black/[0.02] rounded-2xl border border-black/5">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                <ShieldCheck size={20} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.1em]">Apex Secure Transaction</p>
                                                <p className="text-[9px] text-black/30 uppercase tracking-widest font-bold">Encrypted End-to-End // Low Latency</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePurchase}
                                            disabled={isProcessing}
                                            className={cn(
                                                "w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4",
                                                isProcessing 
                                                ? "bg-black/5 text-black/20 cursor-not-allowed" 
                                                : "bg-[#1D1D1F] text-white hover:bg-black shadow-xl shadow-black/10 active:scale-95"
                                            )}
                                        >
                                            {isProcessing ? (
                                                <>Processing Transmision <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity }}>...</motion.span></>
                                            ) : (
                                                <>Confirmar Adquisición <ArrowRight size={16} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

function CarStoreCard({ car, index, onBuy }: { car: any; index: number; onBuy: () => void }) {
    const handleBuyClick = (e: React.MouseEvent) => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Redirect happens via standard Link or manual routing
            return;
        }
        e.preventDefault();
        onBuy();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col"
        >
            {/* Visual Container */}
            <div className="relative aspect-[4/5] bg-[#F1F1F3] rounded-[2.5rem] overflow-hidden mb-6 border border-black/[0.03] transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10">
                {car.images?.[0] ? (
                    <img
                        src={car.images[0]}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={`${car.brand} ${car.model}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={40} className="text-black/5" />
                    </div>
                )}

                {/* Type Badge Overlay */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-[0.2em] text-black shadow-sm">
                        {car.type}
                    </span>
                </div>

                {/* Technical Specs Overlay (Appears on hover) */}
                <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-center justify-between text-white shadow-2xl">
                        <TechnicalPoint icon={<Gauge size={12} />} label="KM" value={car.mileage?.toLocaleString() || "0"} />
                        <div className="w-[1px] h-6 bg-white/10" />
                        <TechnicalPoint icon={<Fuel size={12} />} label="Fuel" value={car.fuelType?.slice(0, 3) || "GAS"} />
                        <div className="w-[1px] h-6 bg-white/10" />
                        <TechnicalPoint icon={<Zap size={12} />} label="Year" value={car.year} />
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div className="px-2 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={10} className="text-emerald-500" />
                            <p className="text-[8px] font-black text-black/30 uppercase tracking-[0.2em]">Verified // Prototype</p>
                        </div>
                        <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tighter uppercase italic leading-none group-hover:text-blue-600 transition-colors">
                            {car.brand} <span className="text-black/20 group-hover:text-black/40 transition-colors">{car.model}</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-black/10 tracking-widest leading-none mb-1 uppercase">Price_Market</p>
                        <p className="text-xl font-black text-[#1D1D1F] tracking-tighter italic">${car.basePrice?.toLocaleString()}</p>
                    </div>
                </div>

                <HydratedActions car={car} onBuy={onBuy} />
            </div>
        </motion.div>
    );
}

function HydratedActions({ car, onBuy }: { car: any; onBuy: () => void }) {
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBuyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onBuy();
    };

    if (!mounted || !_hasHydrated) {
        return (
            <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-4 opacity-0">
                <div className="w-full py-4 bg-white border border-black/10 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="pt-4 border-t border-black/5">
            {isAuthenticated ? (
                <button 
                    onClick={handleBuyClick}
                    className="w-full py-4 bg-[#1D1D1F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                    Adquirir Ahora <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            ) : (
                <Link href={`/login`} className="flex-1 w-full">
                    <button className="w-full py-4 bg-white border border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 group/btn">
                        Conectarse <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </Link>
            )}
        </div>
    );
}

function TechnicalPoint({ icon, label, value }: { icon: any; label: string; value: any }) {
    return (
        <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
            <div className="text-white/40">{icon}</div>
            <div className="flex flex-col items-center">
                <span className="text-[6px] font-black text-white/30 tracking-widest">{label}</span>
                <span className="text-[10px] font-black tracking-tight uppercase leading-none">{value}</span>
            </div>
        </div>
    );
}

