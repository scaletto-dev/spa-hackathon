/**
 * useAdmin Hook
 * Provides loading, error, and data states for admin API calls
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseAdminState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export interface UseAdminResult<T> extends UseAdminState<T> {
    execute: (...args: any[]) => Promise<T>;
    setData: (data: T | null) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

/**
 * Hook for managing async admin API calls
 * @param asyncFunction - The async function to execute (e.g., adminAPI.customers.getAll)
 * @returns State object with loading, error, data, and execute function
 */
export function useAdmin<T>(asyncFunction: (...args: any[]) => Promise<T>): UseAdminResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(
        async (...args: any[]) => {
            try {
                setLoading(true);
                setError(null);
                const result = await asyncFunction(...args);
                setData(result);
                return result;
            } catch (err: any) {
                const errorMessage = err?.message || 'An error occurred';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction]
    );

    const clearError = useCallback(() => setError(null), []);

    return {
        data,
        loading,
        error,
        execute,
        setData,
        setError,
        clearError,
    };
}

/**
 * Hook for managing paginated list data
 */
export function useAdminList<T>(
    asyncFunction: (page: number, limit: number, ...args: any[]) => Promise<any>
) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shouldFetch, setShouldFetch] = useState(true);

    const fetch = useCallback(
        async (...args: any[]) => {
            try {
                setLoading(true);
                setError(null);
                const response = await asyncFunction(page, limit, ...args);
                setData(response.data || []);
                setTotal(response.pagination?.total || 0);
                return response;
            } catch (err: any) {
                const errorMessage = err?.message || 'An error occurred';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction, page, limit]
    );

    const goToPage = useCallback((newPage: number) => {
        setPage(Math.max(1, newPage));
        setShouldFetch(true);
    }, []);

    const nextPage = useCallback(() => setPage((p) => p + 1), []);
    const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const setPageSize = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        setShouldFetch(true);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    // Auto-fetch when page or limit changes
    useEffect(() => {
        if (shouldFetch) {
            fetch();
            setShouldFetch(false);
        }
    }, [page, limit, shouldFetch, fetch]);

    return {
        data,
        total,
        page,
        limit,
        loading,
        error,
        fetch,
        goToPage,
        nextPage,
        prevPage,
        setPageSize,
        clearError,
    };
}

export default useAdmin;
