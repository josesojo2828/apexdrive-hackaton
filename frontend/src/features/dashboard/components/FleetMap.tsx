"use client";

import { Navigation2, Building2, Activity } from "lucide-react";
import { cn } from "@/utils/cn";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";

interface MapLocation {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: 'BUSINESS' | 'DRIVER' | 'CLIENT';
    status?: 'ONLINE' | 'OFFLINE';
}

interface FleetMapProps {
    locations: MapLocation[];
    className?: string;
    height?: string;
}

export default function FleetMap({ locations, className, height = "600px" }: FleetMapProps) {
    // Default center (Kinetic focus)
    const defaultCenter: [number, number] = [-67.3533, 9.9114];

    const viewport = locations.length > 0
        ? { center: [locations[0].lng, locations[0].lat] as [number, number], zoom: 14 }
        : { center: defaultCenter, zoom: 12 };

    return (
        <div className={cn("relative rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl shadow-black/[0.02] group bg-white", className)} style={{ height }}>
            <Map
                viewport={viewport}
                className="h-full w-full grayscale-[0.8] contrast-[1.2] brightness-[1.05]"
                theme="light"
            >
                {locations.map((loc) => (
                    <MapMarker key={loc.id} longitude={loc.lng} latitude={loc.lat}>
                        <MarkerContent>
                            <div className="relative group/marker cursor-pointer">
                                {loc.status === 'ONLINE' && (
                                    <div className={cn(
                                        "absolute -inset-4 rounded-full animate-ping opacity-0 group-hover/marker:opacity-100 duration-1000",
                                        loc.type === 'DRIVER' ? "bg-primary/20" : "bg-brand-blue/10"
                                    )} />
                                )}
                                <div className={cn(
                                    "relative w-12 h-12 rounded-[1.2rem] shadow-2xl flex items-center justify-center border transition-all duration-700 group-hover/marker:scale-125 group-hover/marker:rotate-6",
                                    loc.type === 'DRIVER'
                                        ? (loc.status === 'ONLINE' ? "bg-brand-blue border-white/20 text-white shadow-brand-blue/30" : "bg-black/10 border-transparent text-black/20")
                                        : "bg-white border-black/5 text-brand-blue shadow-lg"
                                )}>
                                    {loc.type === 'DRIVER' ? <Navigation2 size={20} className="italic" /> : <Building2 size={20} />}
                                </div>
                            </div>
                        </MarkerContent>
                        <MarkerPopup closeButton>
                            <div className="p-6 min-w-[240px] space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-[1rem] flex items-center justify-center shadow-inner",
                                        loc.type === 'DRIVER'
                                            ? (loc.status === 'ONLINE' ? "bg-brand-blue/5 text-brand-blue" : "bg-black/5 text-black/20")
                                            : "bg-primary/10 text-primary"
                                    )}>
                                        {loc.type === 'DRIVER' ? <Navigation2 size={20} /> : <Building2 size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[11px] font-black uppercase text-brand-blue tracking-tighter block">{loc.name}</span>
                                        <p className="text-[9px] font-black text-brand-blue/20 uppercase tracking-[0.2em] italic">Unidad_Activa // GPS</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-brand-blue/40 font-bold leading-relaxed italic">{loc.address}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] cursor-pointer hover:underline italic">Ver_Estado</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            loc.status === 'ONLINE' ? "bg-primary animate-pulse" : "bg-black/10"
                                        )} />
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            loc.status === 'ONLINE' ? "text-primary" : "text-black/30"
                                        )}>
                                            {loc.status === 'ONLINE' ? 'ACTIVO' : 'SINC_OUT'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                ))}

                <MapControls showLocate showZoom position="bottom-right" />

                {/* Editorial Overlays */}
                <div className="absolute top-8 left-8 z-[10] animate-fade-in">
                    <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-2xl shadow-black/[0.05] backdrop-blur-xl bg-white/80">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-[1rem] bg-brand-blue text-white flex items-center justify-center shadow-xl shadow-brand-blue/20">
                                <Activity size={24} className="italic" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-blue leading-none mb-2 italic">Mapa Realtime</h4>
                                <p className="text-[9px] font-black text-brand-blue/20 uppercase tracking-widest">{locations.length} unidades en transmisión</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 z-[10] hidden md:flex gap-4 animate-fade-in animation-delay-400">
                    <div className="flex items-center gap-8 bg-white/80 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-black/5 shadow-2xl shadow-black/[0.05]">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/30" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-blue/40 italic">Logística</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-blue/40 italic">Activos_Live</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-30">
                            <div className="w-2 h-2 rounded-full bg-black/20" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-blue/40 italic">Desconectados</span>
                        </div>
                    </div>
                </div>
            </Map>
        </div>
    );
}
