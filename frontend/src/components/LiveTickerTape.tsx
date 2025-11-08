import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface TickerData {
  ticker: string;
  price: number;
  change: number;
  change_percent: number;
  timestamp: string;
}

const DEFAULT_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

export default function LiveTickerTape() {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_TICKERS);
  const [isAddingTicker, setIsAddingTicker] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws/tickers');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Subscribe to tickers
        ws.send(JSON.stringify({
          type: 'subscribe',
          tickers: watchlist
        }));
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'ticker_update') {
          setTickers(prev => {
            const index = prev.findIndex(t => t.ticker === message.ticker);
            const newData = {
              ticker: message.ticker,
              ...message.data
            };
            
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = newData;
              return updated;
            } else {
              return [...prev, newData];
            }
          });
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current = ws;
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [watchlist]);

  const addTicker = () => {
    if (newTicker && !watchlist.includes(newTicker.toUpperCase())) {
      const ticker = newTicker.toUpperCase();
      setWatchlist(prev => [...prev, ticker]);
      
      // Subscribe to new ticker
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          tickers: [...watchlist, ticker]
        }));
      }
      
      setNewTicker('');
      setIsAddingTicker(false);
    }
  };

  const removeTicker = (ticker: string) => {
    setWatchlist(prev => prev.filter(t => t !== ticker));
    setTickers(prev => prev.filter(t => t.ticker !== ticker));
    
    // Unsubscribe from ticker
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        ticker: ticker
      }));
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="relative h-14 overflow-hidden">
        {/* Connection Status */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-slate-400 font-medium">
            {isConnected ? 'LIVE' : 'CONNECTING...'}
          </span>
        </div>

        {/* Ticker Tape */}
        <div 
          ref={tickerRef}
          className="absolute left-32 right-20 top-1/2 -translate-y-1/2 overflow-hidden"
        >
          <div className="flex gap-6 animate-scroll whitespace-nowrap">
            {/* Duplicate for seamless loop */}
            {[...tickers, ...tickers].map((ticker, index) => (
              <div
                key={`${ticker.ticker}-${index}`}
                className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group"
              >
                <span className="font-bold text-sm text-slate-200">
                  {ticker.ticker}
                </span>
                <span className="font-mono text-sm text-white">
                  ${ticker.price.toFixed(2)}
                </span>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  ticker.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {ticker.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{ticker.change >= 0 ? '+' : ''}{ticker.change_percent.toFixed(2)}%</span>
                </div>
                
                {/* Remove button (hidden by default, shown on hover) */}
                <button
                  onClick={() => removeTicker(ticker.ticker)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  title="Remove ticker"
                >
                  <X className="w-3 h-3 text-slate-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Ticker Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          {isAddingTicker ? (
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
              <input
                type="text"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addTicker()}
                placeholder="TICKER"
                className="bg-transparent text-white text-sm w-20 outline-none placeholder-slate-500"
                autoFocus
              />
              <button
                onClick={addTicker}
                className="text-green-400 hover:text-green-300 text-xs font-semibold"
              >
                ADD
              </button>
              <button
                onClick={() => {
                  setIsAddingTicker(false);
                  setNewTicker('');
                }}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              ADD TICKER
            </button>
          )}
        </div>
      </div>

      {/* CSS for scrolling animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
