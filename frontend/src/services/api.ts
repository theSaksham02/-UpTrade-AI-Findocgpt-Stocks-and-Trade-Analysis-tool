/**
 * API Service Layer
 * Connects React frontend to FastAPI backend
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const stocksAPI = {
  getPrice: (symbol: string) => 
    apiClient.get(`/stocks/${symbol}/price`),
  
  getQuote: (symbol: string) => 
    apiClient.get(`/stocks/${symbol}/quote`),
  
  getHistoricalData: (symbol: string, period: string = '1y') =>
    apiClient.get(`/stocks/${symbol}/historical`, { params: { period } }),
  
  getTechnicalIndicators: (symbol: string) =>
    apiClient.get(`/stocks/${symbol}/technical`),
  
  search: (query: string) =>
    apiClient.get('/stocks/search', { params: { query } }),
};

export const newsAPI = {
  getNews: (symbol?: string, limit: number = 20) =>
    apiClient.get('/news', { params: { symbol, limit } }),
  
  getMarketNews: (limit: number = 20) =>
    apiClient.get('/news/market', { params: { limit } }),
};

export const sentimentAPI = {
  analyzeSentiment: (symbol: string) =>
    apiClient.get(`/sentiment/${symbol}`),
  
  getBulkSentiment: (symbols: string[]) =>
    apiClient.post('/sentiment/bulk', { symbols }),
};

export const forecastAPI = {
  getForecast: (symbol: string, days: number = 7) =>
    apiClient.get(`/forecast/${symbol}`, { params: { days } }),
  
  getMultipleForecast: (symbols: string[], days: number = 7) =>
    apiClient.post('/forecast/bulk', { symbols, days }),
};

export const portfolioAPI = {
  getPortfolio: (portfolioId: string) =>
    apiClient.get(`/portfolio/${portfolioId}`),
  
  createPortfolio: (data: any) =>
    apiClient.post('/portfolio', data),
  
  addPosition: (portfolioId: string, data: any) =>
    apiClient.post(`/portfolio/${portfolioId}/positions`, data),
  
  optimize: (portfolioId: string) =>
    apiClient.post(`/portfolio/${portfolioId}/optimize`),
  
  getMetrics: (portfolioId: string) =>
    apiClient.get(`/portfolio/${portfolioId}/metrics`),
};

export const tradingAPI = {
  getPaperAccount: () =>
    apiClient.get('/trading/paper/account'),
  
  getPositions: () =>
    apiClient.get('/trading/paper/positions'),
  
  getOrders: () =>
    apiClient.get('/trading/paper/orders'),
  
  placeOrder: (data: any) =>
    apiClient.post('/trading/paper/orders', data),
  
  cancelOrder: (orderId: string) =>
    apiClient.delete(`/trading/paper/orders/${orderId}`),
  
  getTradeHistory: () =>
    apiClient.get('/trading/paper/history'),
  
  resetAccount: () =>
    apiClient.post('/trading/paper/reset'),
};

export const filingsAPI = {
  getFilings: (symbol: string, filingType?: string) =>
    apiClient.get(`/filings/${symbol}`, { params: { filing_type: filingType } }),
  
  getFilingContent: (symbol: string, accessionNumber: string) =>
    apiClient.get(`/filings/${symbol}/${accessionNumber}`),
  
  analyzeFilings: (symbol: string, filingType: string) =>
    apiClient.post('/filings/analyze', { symbol, filing_type: filingType }),
};

export const socialAPI = {
  getSocialSentiment: (symbol: string) =>
    apiClient.get(`/social/${symbol}/sentiment`),
  
  getTrendingStocks: () =>
    apiClient.get('/social/trending'),
};

export const qaAPI = {
  askQuestion: (question: string, symbol?: string) =>
    apiClient.post('/qa/ask', { question, symbol }),
  
  getDocuments: (symbol: string) =>
    apiClient.get(`/qa/documents/${symbol}`),
};

// Health check
export const healthCheck = () => 
  axios.get(`${API_BASE_URL}/health`);

export default apiClient;
