/**
 * API Client for UpTrade AI Backend
 * Handles all API requests with error handling and type safety
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || 'Request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // ============================================================================
  // Health & Info
  // ============================================================================

  async healthCheck() {
    return this.request('/api/health');
  }

  async getModelsInfo() {
    return this.request('/api/models/info');
  }

  // ============================================================================
  // Sentiment Analysis
  // ============================================================================

  async analyzeSentiment(texts: string[]) {
    return this.request('/api/sentiment', {
      method: 'POST',
      body: JSON.stringify({ texts }),
    });
  }

  // ============================================================================
  // Document Q&A
  // ============================================================================

  async answerQuestion(question: string, context: string) {
    return this.request('/api/document-qa', {
      method: 'POST',
      body: JSON.stringify({ question, context }),
    });
  }

  // ============================================================================
  // Entity Extraction
  // ============================================================================

  async extractEntities(text: string) {
    return this.request('/api/extract-entities', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // ============================================================================
  // Market Data
  // ============================================================================

  async getNews(query: string = 'stock market', limit: number = 10) {
    return this.request('/api/news', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
  }

  async getStockQuote(symbol: string) {
    return this.request(`/api/stock/quote`, {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });
  }

  async getCompanyOverview(symbol: string) {
    return this.request(`/api/stock/overview/${symbol}`);
  }

  async getSecFilings(ticker: string, filingType: string = '10-K') {
    return this.request(`/api/sec-filings/${ticker}?filing_type=${filingType}`);
  }

  // ============================================================================
  // Combined Analysis
  // ============================================================================

  async analyzeNewsSentiment(query: string = 'stock market', limit: number = 10) {
    return this.request('/api/analyze-news-sentiment', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
  }

  async analyzeCompany(symbol: string) {
    return this.request(`/api/analyze-company?symbol=${symbol}`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  score: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  published_at: string;
  image_url?: string;
  sentiment?: string;
  sentiment_score?: number;
  sentiment_confidence?: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: string;
  volume: number;
  latest_trading_day: string;
  open: number;
  high: number;
  low: number;
  previous_close: number;
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
  start: number;
  end: number;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  market_cap: string;
  pe_ratio: string;
  dividend_yield: string;
  eps: string;
  '52_week_high': string;
  '52_week_low': string;
}

export default apiClient;
