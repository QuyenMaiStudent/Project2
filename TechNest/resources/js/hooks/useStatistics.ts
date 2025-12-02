import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type StatisticsFilters = {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
    preset?: '7d' | '30d' | '90d';
};

export type StatisticsResponse = {
    filters: {
        start_date: string;
        end_date: string;
        group_by: 'day' | 'week' | 'month';
    };
    summary: {
        totalRevenue: number;
        ordersCount: number;
        averageOrderValue: number;
        newUsers: number;
    };
    revenue: {
        labels: string[];
        dataset: number[];
    };
    activity: {
        labels: string[];
        series: {
            name: string;
            data: number[];
        }[];
    };
};

export type UseStatisticsOptions = {
    initialFilters?: StatisticsFilters;
    initialData?: StatisticsResponse | null;
    endpoint?: string;
};

export const useStatistics = (options?: UseStatisticsOptions) => {
    const { initialFilters, initialData = null, endpoint = '/admin/statistics/data' } = options ?? {};
    const [filters, setFilters] = useState<StatisticsFilters>({
        preset: '30d',
        groupBy: 'day',
        ...initialFilters,
    });
    const [data, setData] = useState<StatisticsResponse | null>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const firstRunRef = useRef(true);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (filters.startDate) params.set('start_date', filters.startDate);
        if (filters.endDate) params.set('end_date', filters.endDate);
        if (filters.groupBy) params.set('group_by', filters.groupBy);
        if (filters.preset) params.set('preset', filters.preset);
        return params.toString();
    }, [filters]);

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${endpoint}?${queryString}`, {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const payload: StatisticsResponse = await response.json();
            setData(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [endpoint, queryString]);

    useEffect(() => {
        if (firstRunRef.current) {
            firstRunRef.current = false;
            if (initialData) {
                return;
            }
        }
        void fetchStatistics();
    }, [fetchStatistics, initialData]);

    const updateFilters = useCallback((partial: Partial<StatisticsFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...partial,
        }));
    }, []);

    return {
        data,
        loading,
        error,
        filters,
        updateFilters,
        refetch: fetchStatistics,
    };
};