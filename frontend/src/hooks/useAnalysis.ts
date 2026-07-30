import { useState } from 'react';
import type { AnalysisResult } from '../types';
import { analyzeLogEntry } from '../services/api';

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (logText: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeLogEntry(logText);
      setResult(data);
    } catch {
      setError('Failed to analyze log entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, result, loading, error, clear };
};
