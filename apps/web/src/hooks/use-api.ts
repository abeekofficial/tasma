import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions extends RequestInit {
  enabled?: boolean;
}

export function useApi<T>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(options?.enabled !== false);

  const fetchData = useCallback(async () => {
    if (options?.enabled === false) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      const res = await fetch(fullUrl, {
        ...options,
        credentials: options?.credentials || 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = (newData: T | ((prev: T | null) => T)) => {
    setData(prev => typeof newData === 'function' ? (newData as Function)(prev) : newData);
  };

  return { data, error, isLoading, mutate, refetch: fetchData };
}
