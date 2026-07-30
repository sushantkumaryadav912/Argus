import { useCallback, useEffect, useState } from 'react';
import type { DashboardStats } from '../types';
import { getDashboardStats } from '../services/api';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getDashboardStats()
      .then((data) => {
        if (!ignore) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Failed to load dashboard metrics.');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { stats, loading, error, refresh: fetchStats };
};
