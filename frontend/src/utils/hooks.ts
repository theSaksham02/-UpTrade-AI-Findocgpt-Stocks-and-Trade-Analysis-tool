/**
 * Custom React Hooks for UpTrade AI API
 * Provides easy-to-use hooks for all API endpoints with loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, NewsArticle, StockQuote, SentimentResult, Entity } from './api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for sentiment analysis
 */
export function useSentimentAnalysis(texts: string[], autoFetch = true): UseApiResult<{
  results: SentimentResult[];
  average_sentiment: number;
  overall_sentiment: string;
}> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!texts || texts.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.analyzeSentiment(texts);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  }, [texts]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for news with sentiment analysis
 */
export function useNewsSentiment(query: string = 'stock market', limit: number = 10, autoFetch = true): UseApiResult<{
  articles: NewsArticle[];
  sentiment_analysis: any;
  count: number;
}> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.analyzeNewsSentiment(query, limit);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [query, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for stock quote
 */
export function useStockQuote(symbol: string, autoFetch = true): UseApiResult<StockQuote> {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getStockQuote(symbol);
      if (response.data) {
        setData(response.data as StockQuote);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock quote');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for company overview
 */
export function useCompanyOverview(symbol: string, autoFetch = true): UseApiResult<any> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getCompanyOverview(symbol);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company overview');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for entity extraction
 */
export function useEntityExtraction(text: string, autoFetch = false): UseApiResult<{
  entities: Entity[];
  entities_by_type: Record<string, Entity[]>;
  total_count: number;
}> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!text) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.extractEntities(text);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract entities');
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for document Q&A
 */
export function useDocumentQA(question: string, context: string, autoFetch = false): UseApiResult<{
  question: string;
  answer: string;
  confidence: number;
}> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!question || !context) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.answerQuestion(question, context);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to answer question');
    } finally {
      setLoading(false);
    }
  }, [question, context]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for comprehensive company analysis
 */
export function useCompanyAnalysis(symbol: string, autoFetch = true): UseApiResult<any> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.analyzeCompany(symbol);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze company');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for news fetching
 */
export function useNews(query: string = 'stock market', limit: number = 10, autoFetch = true): UseApiResult<{
  articles: NewsArticle[];
  count: number;
  query: string;
}> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getNews(query, limit);
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [query, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for API health check
 */
export function useApiHealth(): UseApiResult<any> {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.healthCheck();
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API health check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
