// Uptrade Decision Intelligence Engine - Type Definitions

export interface OHLCV {
    time: number;  // Unix timestamp
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface SentimentData {
    time: number;
    score: number;        // -1 to 1
    volume: number;       // Mention count
    source: 'twitter' | 'reddit' | 'news' | 'sec';
    raw?: number;         // Raw unsmoothed score
}

export interface DivergenceAlert {
    id: string;
    symbol: string;
    type: 'LIQUIDITY_DIVERGENCE' | 'SENTIMENT_CRASH' | 'VOLUME_ANOMALY' | 'PRICE_SENTIMENT_GAP';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
    price: number;
    sentiment: number;
    message: string;
    priceTrend?: number;
    sentimentTrend?: number;
}

export interface ChartConfig {
    id: string;
    symbol: string;
    interval: string;
    layout: 'main' | 'secondary' | 'tertiary';
    showSentiment?: boolean;
    showVolume?: boolean;
}

export interface WebSocketMessage {
    type: 'connected' | 'candle' | 'sentiment' | 'alert' | 'history' | 'pong' | 'subscribe' | 'unsubscribe';
    symbol?: string;
    interval?: string;
    data?: OHLCV | SentimentData | DivergenceAlert | OHLCV[];
    clientId?: string;
    channels?: string[];
}

export interface SubscriptionRequest {
    type: 'subscribe' | 'unsubscribe';
    symbol: string;
    interval: string;
    channels: ('trade' | 'sentiment' | 'divergence')[];
}

export interface MarkerData {
    time: number;
    position: 'aboveBar' | 'belowBar' | 'inBar';
    color: string;
    shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
    text: string;
    size: number;
}

// TradeX Comparison Types
export interface ComparisonMetric {
    name: string;
    symbol1Value: number;
    symbol2Value: number;
    winner: 'symbol1' | 'symbol2' | 'tie';
    weight: number;
    category: 'fundamental' | 'technical' | 'sentiment' | 'risk';
}

export interface ComparisonResult {
    symbol1: string;
    symbol2: string;
    overallWinner: string;
    score1: number;
    score2: number;
    metrics: ComparisonMetric[];
    timestamp: number;
}

// VisualX Sentiment Types
export interface SentimentScore {
    symbol: string;
    composite: number;      // -1 to 1
    twitter: number;
    reddit: number;
    news: number;
    historical: number[];   // Last 24 hours hourly
    trend: 'rising' | 'falling' | 'stable';
    volume: number;
    lastUpdated: number;
}

// TradeSphere Backtesting Types
export interface BacktestConfig {
    strategy: string;
    symbol: string;
    startDate: string;
    endDate: string;
    initialCapital: number;
    positionSize: number;
    stopLoss?: number;
    takeProfit?: number;
}

export interface BacktestResult {
    config: BacktestConfig;
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
    trades: BacktestTrade[];
}

export interface BacktestTrade {
    entryTime: number;
    exitTime: number;
    entryPrice: number;
    exitPrice: number;
    side: 'long' | 'short';
    pnl: number;
    pnlPercent: number;
}

// Connection state
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Chart state
export interface ChartState {
    symbol: string;
    interval: string;
    lastPrice: number;
    lastSentiment: number;
    isLoading: boolean;
    error?: string;
}
