"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import MapLibreGL from "maplibre-gl";

interface MapPickerProps {
    lat?: number;
    lng?: number;
    onChange: (coords: { lat: number; lng: number }) => void;
    className?: string;
}

export default function MapPicker({ lat = 9.9114, lng = -67.3533, onChange, className }: MapPickerProps) {
    const [position, setPosition] = useState({ lat, lng });
    const [viewport, setViewport] = useState({
        center: [lng, lat] as [number, number],
        zoom: 14
    });

    useEffect(() => {
        if (lat !== position.lat || lng !== position.lng) {
            setPosition({ lat, lng });
            setViewport(prev => ({ ...prev, center: [lng, lat] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng]);

    const handleMapClick = (e: MapLibreGL.MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        const newPos = { lat, lng };
        setPosition(newPos);
        onChange(newPos);
    };

    const handleLocate = (coords: { longitude: number; latitude: number }) => {
        const newPos = { lat: coords.latitude, lng: coords.longitude };
        setPosition(newPos);
        onChange(newPos);
        setViewport({
            center: [coords.longitude, coords.latitude],
            zoom: 16
        });
    };

    return (
        <div className={cn("relative rounded-2xl overflow-hidden border border-slate-200  group h-[300px] w-full", className)}>
            <Map
                viewport={viewport}
                onViewportChange={(v) => setViewport(v)}
                onClick={handleMapClick}
                className="h-full w-full"
            >
                <MapMarker longitude={position.lng} latitude={position.lat}>
                    <MarkerContent>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-brand-blue/20 rounded-full animate-ping group-hover:bg-brand-blue/40" />
                            <div className="relative w-10 h-10 bg-white  rounded-2xl shadow-2xl flex items-center justify-center border-2 border-brand-blue transform -translate-y-5 transition-transform group-hover:scale-110">
                                <MapPin className="text-brand-blue" size={24} />
                            </div>
                        </div>
                    </MarkerContent>
                </MapMarker>

                <MapControls
                    showLocate
                    onLocate={handleLocate}
                    position="bottom-right"
                />

                <div className="absolute bottom-4 left-4 right-14 z-[10]">
                    <div className="bg-white/80  backdrop-blur-md p-3 rounded-xl border border-white  shadow-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-sky/10 flex items-center justify-center text-brand-sky">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">gps coordinates</p>
                                <p className="text-[10px] font-bold font-mono">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
                            </div>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Ready</span>
                    </div>
                </div>
            </Map>
        </div>
    );
}
