"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/api.client";
import { Car } from "./useCars";

export function useCarDetail(id: string) {
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCar = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/cars/${id}`);
            setCar(data);
        } catch {
            setCar(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchCar(); }, [fetchCar]);

    return { car, loading, fetchCar };
}
