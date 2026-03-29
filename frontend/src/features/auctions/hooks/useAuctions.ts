"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/api.client";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export interface Bid {
    id: string;
    amount: string | number;
    userId: string;
    user?: { firstName: string; lastName: string };
    createdAt: string;
}

export interface Auction {
    id: string;
    carId: string;
    car?: { brand: string; model: string; year: number; type: string; plate: string; images?: string[] };
    startingPrice: string | number;
    currentPrice: string | number;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "UPCOMING" | "RESOLVED" | "CLOSED" | "CANCELLED";
    winnerId?: string;
    winner?: { firstName: string; lastName: string };
    bids: Bid[];
}

export function useAuctions() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    const fetchAuctions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get("/auctions");
            setAuctions(data);
        } catch {
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuctions();
        
        const s = io(SOCKET_URL);
        setSocket(s);

        s.on("auction:listRefresh", () => {
            fetchAuctions();
        });

        s.on("auction:update", ({ auctionId }) => {
            fetchAuctions();
        });

        return () => {
            s.disconnect();
        };
    }, [fetchAuctions]);

    const getAuction = useCallback(async (id: string) => {
        const { data } = await apiClient.get(`/auctions/${id}`);
        return data as Auction;
    }, []);

    const createAuction = useCallback(async (carId: string, startingPrice?: number, startDate?: string, endDate?: string, status: string = 'ACTIVE') => {
        const { data } = await apiClient.post("/auctions", { 
            carId, 
            startingPrice, 
            startDate: startDate || new Date().toISOString(), 
            endDate, 
            status 
        });
        return data;
    }, []);

    const placeBid = useCallback(async (auctionId: string, amount: number) => {
        const { data } = await apiClient.post(`/auctions/${auctionId}/bid`, { amount });
        return data;
    }, []);

    const closeAuction = useCallback(async (auctionId: string) => {
        const { data } = await apiClient.put(`/auctions/${auctionId}/close`);
        return data;
    }, []);

    const updateAuction = useCallback(async (id: string, payload: any) => {
        const { data } = await apiClient.put(`/auctions/${id}`, payload);
        return data;
    }, []);

    return { 
        auctions, 
        loading, 
        fetchAuctions, 
        getAuction, 
        createAuction, 
        placeBid, 
        closeAuction, 
        updateAuction,
        socket 
    };
}
