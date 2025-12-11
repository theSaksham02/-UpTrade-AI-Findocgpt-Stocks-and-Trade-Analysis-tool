/**
 * Stock API Client
 * Connects to the FastAPI backend for real-time stock data
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  name?: string;
  timestamp?: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  image?: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type?: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  employees: number;
  website: string;
  ceo?: string;
}

export interface StockAnalysis {
  symbol: string;
  quote: StockQuote;
  company: CompanyInfo;
  recommendation: string;
  targetPrice: number;
  sentiment: number;
  signals: string[];
}

// API Functions

/**
 * Get real-time stock quote
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/quote/${symbol.toUpperCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    // Return fallback data
    return {
      symbol: symbol.toUpperCase(),
      price: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      open: 0,
      previousClose: 0,
      volume: 0,
    };
  }
}

/**
 * Get historical OHLCV data
 */
export async function getHistoricalData(
  symbol: string,
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL' = '1M'
): Promise<HistoricalData[]> {
  try {
    // Map 'ALL' to '5Y' for the API
    const apiPeriod = period === 'ALL' ? '5Y' : period;
    const response = await fetch(`${API_BASE_URL}/stock/historical/${symbol.toUpperCase()}?period=${apiPeriod}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
    const data = await response.json();
    // The API returns { symbol, period, data: [...] }
    return data.data || data || [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

/**
 * Get stock-specific news
 */
export async function getStockNews(symbol: string, limit: number = 10): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/stock/${symbol.toUpperCase()}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news for ${symbol}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching stock news:', error);
    return [];
  }
}

/**
 * Get market news
 */
export async function getMarketNews(query: string = 'stock market', limit: number = 20): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/market?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch market news');
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    return [];
  }
}

/**
 * Search for US stocks
 */
export async function searchUSStocks(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search/stocks?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search stocks');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    // Return common US stocks as fallback
    const commonStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity' },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity' },
      { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Equity' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Equity' },
    ];
    return commonStocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

/**
 * Get company information
 */
export async function getCompanyInfo(symbol: string): Promise<CompanyInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/company/${symbol.toUpperCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch company info for ${symbol}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

/**
 * Get comprehensive stock analysis (BEAST MODE)
 */
export async function getStockAnalysis(symbol: string): Promise<StockAnalysis | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/analysis/${symbol.toUpperCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis for ${symbol}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock analysis:', error);
    return null;
  }
}

/**
 * Get batch quotes for multiple stocks
 */
export async function getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(symbols.map(s => s.toUpperCase())),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch batch quotes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    return {};
  }
}

/**
 * Get stock rating/recommendations
 */
export async function getStockRating(symbol: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/rating/${symbol.toUpperCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rating for ${symbol}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock rating:', error);
    return null;
  }
}

/**
 * Compare multiple stocks
 */
export async function compareStocks(symbols: string[]): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/compare/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(symbols.map(s => s.toUpperCase())),
    });
    if (!response.ok) {
      throw new Error('Failed to compare stocks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error comparing stocks:', error);
    return null;
  }
}

/**
 * Get sentiment analysis for a stock
 */
export async function getSentimentAnalysis(symbol: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/sentiment/stock/${symbol.toUpperCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment for ${symbol}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    return { score: 0, label: 'neutral' };
  }
}
