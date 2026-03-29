"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/api.client";

export interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    plate: string;
    type: string;
    status: "AVAILABLE" | "RENTED" | "IN_AUCTION" | "SOLD" | "MAINTENANCE";
    basePrice: number;
    images: string[];
    description?: string;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    ownerId?: string;
    createdAt: string;
    logs?: any[];
    rentals?: any[];
    auctions?: any[];
}

export function useCars(statusFilter?: string, isPublic = false) {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = isPublic ? "/cars/inventory" : "/cars";
            const params = statusFilter ? { status: statusFilter } : {};
            const { data } = await apiClient.get(endpoint, { params });
            setCars(data);
        } catch {
            setCars([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, isPublic]);

    useEffect(() => { fetchCars(); }, [fetchCars]);

    const createCar = async (carData: Partial<Car>) => {
        const { data } = await apiClient.post("/cars", carData);
        await fetchCars();
        return data;
    };

    const updateCar = async (id: string, carData: Partial<Car>) => {
        const { data } = await apiClient.put(`/cars/${id}`, carData);
        await fetchCars();
        return data;
    };

    const deleteCar = async (id: string) => {
        await apiClient.delete(`/cars/${id}`);
        await fetchCars();
    };

    const changeStatus = async (id: string, status: string) => {
        const { data } = await apiClient.put(`/cars/${id}/status`, { status });
        await fetchCars();
        return data;
    };

    const buyCar = async (id: string) => {
        const { data } = await apiClient.post(`/cars/${id}/buy`);
        await fetchCars();
        return data;
    };

    return { cars, loading, fetchCars, createCar, updateCar, deleteCar, changeStatus, buyCar };
}
