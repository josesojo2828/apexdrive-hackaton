"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

export interface MapLocation {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: 'BUSINESS' | 'DRIVER' | 'CLIENT';
    status?: 'ONLINE' | 'OFFLINE';
}

export const useFleetLocations = () => {
    const { user, token } = useAuthStore();
    const [locations, setLocations] = useState<MapLocation[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user || !token) return;

        const newSocket = io("/tracking", {
            path: "/socket.io",
            query: { 
                userId: user.id,
                role: user.role || 'ADMIN'
            },
            transports: ['websocket']
        });

        setSocket(newSocket);

        newSocket.on("initialFleetState", (drivers: any[]) => {
            console.log("[WS_DEBUG]: Received initialFleetState", drivers);
            const mapped = drivers
                .map(d => ({
                    id: d.id,
                    name: `${d.firstName} ${d.lastName}`,
                    address: d.isOnline ? 'Chofer Activo' : 'Última ubicación conocida',
                    lat: parseFloat(d.latitude),
                    lng: parseFloat(d.longitude),
                    type: 'DRIVER' as const,
                    status: (d.isOnline ? 'ONLINE' : 'OFFLINE') as 'ONLINE' | 'OFFLINE'
                }))
                .filter(d => {
                    const valid = !isNaN(d.lat) && !isNaN(d.lng);
                    if (!valid) console.warn(`[WS_DEBUG]: Invalid coordinates for driver ${d.id}`, d);
                    return valid;
                });
            console.log("[WS_DEBUG]: Mapped locations", mapped);
            setLocations(mapped);
        });

        newSocket.on("locationUpdated", (data: any) => {
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            
            if (isNaN(lat) || isNaN(lng)) return;

            setLocations(prev => {
                const index = prev.findIndex(l => l.id === data.userId);
                if (index !== -1) {
                    const newLocs = [...prev];
                    newLocs[index] = {
                        ...newLocs[index],
                        lat,
                        lng,
                        status: 'ONLINE' // If we get an update, they are online
                    };
                    return newLocs;
                } else {
                    return [...prev, {
                        id: data.userId,
                        name: data.name,
                        address: 'Chofer Activo',
                        lat,
                        lng,
                        type: 'DRIVER',
                        status: 'ONLINE'
                    }];
                }
            });
        });

        newSocket.on("driverStatusChanged", (data: any) => {
            setLocations(prev => {
                const index = prev.findIndex(l => l.id === data.userId);
                if (index !== -1) {
                    const newLocs = [...prev];
                    newLocs[index] = {
                        ...newLocs[index],
                        status: data.status,
                        address: data.status === 'ONLINE' ? 'Chofer Activo' : 'Última ubicación conocida'
                    };
                    return newLocs;
                }
                return prev;
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, token]);

    return { locations, loading: false };
};
