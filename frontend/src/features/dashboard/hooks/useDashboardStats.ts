import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/utils/api/api.client';

export interface DashboardStat {
    label: string;
    value: string;
    delta: string;
    icon: string;
    color: string;
}

export const useDashboardStats = (startDate?: string, endDate?: string) => {
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const params = startDate && endDate ? { startDate, endDate } : {};
            const response = await apiClient.get('/dashboard/stats', { params });
            const result = response.data?.body || response.data;
            setStats(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setStats([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, refresh: fetchStats };
};
