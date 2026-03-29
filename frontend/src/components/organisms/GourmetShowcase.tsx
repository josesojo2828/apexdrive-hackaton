import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Star, Clock, Flame, ChevronRight } from "lucide-react";
import Image from "next/image";

export const GourmetShowcase = () => {
    const featuredItems = [
        {
            id: 1,
            name: "Arepas de Perico Gourmet",
            chef: "Chef Andreína",
            price: "8.50",
            rating: "4.9",
            time: "15 min",
            image: "/images/hero-1.png",
            badge: "Top Ventas"
        },
        {
            id: 2,
            name: "Pabellón Premium",
            chef: "Chef Roberto",
            price: "12.00",
            rating: "5.0",
            time: "25 min",
            image: "/images/hero-2.png",
            badge: "Lento & Suave"
        },
        {
            id: 3,
            name: "Cachapas Especiales",
            chef: "Chef María",
            price: "10.00",
            rating: "4.8",
            time: "20 min",
            image: "/images/hero-3.png",
            badge: "Calientitas"
        }
    ];

    return (
        <section className="py-24 px-4 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                            <Flame className="w-3 h-3" /> Selección de la Semana
                        </div>
                        <Typography variant="H1" className="text-brand-blue dark:text-white !md:text-6xl max-w-xl leading-tight">
                            Lo mejor de nuestra cocina <br/> <span className="text-orange-500 italic font-serif lowercase">recién hecho</span> para ti
                        </Typography>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black text-brand-blue/60 dark:text-white/60 hover:text-orange-500 transition-colors group">
                        Ver todo el menú <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredItems.map((item) => (
                        <GlassCard key={item.id} className="group p-0 overflow-hidden border-none shadow-2xl bg-transparent">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute top-4 left-4">
                                     <div className="px-3 py-1 rounded-full bg-brand-sky text-brand-blue text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {item.badge}
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {item.rating}
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                                            <Clock className="w-3 h-3" /> {item.time}
                                        </div>
                                    </div>
                                    <Typography variant="H3" className="text-white !text-2xl drop-shadow-lg">
                                        {item.name}
                                    </Typography>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 backdrop-blur-3xl border border-white/10 border-t-0 rounded-b-[2rem]">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold text-xs">
                                            {item.chef[5]}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Preparado por</div>
                                            <div className="text-xs font-bold text-brand-blue dark:text-white uppercase">{item.chef}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-orange-500">${item.price}</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};
