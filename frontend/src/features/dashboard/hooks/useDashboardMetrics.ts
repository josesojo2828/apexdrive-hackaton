"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/features/auth/services/authService";

export interface SessionData {
    id: string;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    }
}

export interface MetricsData {
    distribution: { hour: string; count: number }[];
    statuses: { status: string; count: number }[];
    timeSeries: { date: string; trips: number; revenue: number }[];
    businessSessions?: SessionData[];
    driverSessions?: SessionData[];
    topDrivers?: { id: string; name: string; trips: number; revenue: number }[];
    topBusinesses?: { id: string; name: string; trips: number; revenue: number }[];
}

export const useDashboardMetrics = (startDate?: string, endDate?: string) => {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const params = startDate && endDate ? { startDate, endDate } : {};
            const response = await apiClient.get('/dashboard/metrics', { params });
            const result = response.data?.body || response.data;
            setMetrics(result);
            setError(null);
        } catch (err) {
            console.error("Error fetching metrics:", err);
            setError("error.fetch_metrics");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return { metrics, loading, error, refresh: fetchMetrics };
};
