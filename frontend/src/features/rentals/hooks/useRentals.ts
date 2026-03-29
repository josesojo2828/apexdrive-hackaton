"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/api.client";

export interface Rental {
    id: string;
    carId: string;
    car?: { brand: string; model: string; year: number; type: string; plate: string; imageUrl?: string };
    userId: string;
    user?: { firstName: string; lastName: string };
    startDate: string;
    endDate: string;
    totalAmount: number;
    paidAmount: number;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    createdAt: string;
}

export function useRentals() {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchMyRentals = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get("/rentals/my-rentals");
            setRentals(data);
        } catch { setRentals([]); } finally { setLoading(false); }
    }, []);

    const fetchAllRentals = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get("/rentals");
            setRentals(data);
        } catch { setRentals([]); } finally { setLoading(false); }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await apiClient.get("/rentals/stats");
            setStats(data);
        } catch { setStats(null); }
    }, []);

    const createRental = useCallback(async (carId: string, userId: string | null, startDate: string, endDate: string, dailyRate: number, paidAmount?: number) => {
        const { data } = await apiClient.post("/rentals", { carId, userId, startDate, endDate, dailyRate, paidAmount });
        return data;
    }, []);

    const addPayment = useCallback(async (id: string, amount: number) => {
        const { data } = await apiClient.post(`/rentals/${id}/payment`, { amount });
        return data;
    }, []);

    const updateStatus = useCallback(async (id: string, status: string) => {
        const { data } = await apiClient.put(`/rentals/${id}/status`, { status });
        return data;
    }, []);

    return { 
        rentals, 
        stats,
        loading, 
        fetchMyRentals, 
        fetchAllRentals, 
        fetchStats,
        createRental, 
        updateStatus,
        addPayment
    };
}
