# WebSocket /ws/tickers - Real-Time Ticker Stream

## Overview

The `/ws/tickers` endpoint provides real-time stock ticker updates via WebSocket. Subscribe to multiple symbols and receive instant quotes.

## Quick Start

### JavaScript/Browser

```javascript
// Connect to ticker stream
const ws = new WebSocket('ws://localhost:8000/ws/tickers');

// Handle connection
ws.onopen = () => {
    console.log('Connected to ticker stream');
    
    // Subscribe to symbols
    ws.send(JSON.stringify({
        type: 'subscribe',
        symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA']
    }));
};

// Handle messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'connection':
            console.log('Welcome:', data.message);
            break;
            
        case 'subscribed':
            console.log('Subscribed to:', data.symbols);
            break;
            
        case 'quote':
            console.log(`${data.symbol}: $${data.data.price} (${data.data.change_percent}%)`);
            updateTickerUI(data.symbol, data.data);
            break;
            
        case 'error':
            console.error('Error:', data.message);
            break;
    }
};

// Handle errors
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Handle close
ws.onclose = () => {
    console.log('Disconnected from ticker stream');
};
```

### React Hook

```typescript
import { useEffect, useState, useCallback } from 'react';

interface TickerData {
    symbol: string;
    price: number;
    change: number;
    change_percent: number;
    [key: string]: any;
}

export function useTickerStream(symbols: string[]) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const [tickers, setTickers] = useState<Map<string, TickerData>>(new Map());
    
    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8000/ws/tickers');
        
        websocket.onopen = () => {
            setConnected(true);
            setWs(websocket);
            
            // Subscribe to symbols
            websocket.send(JSON.stringify({
                type: 'subscribe',
                symbols: symbols
            }));
        };
        
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'quote' || data.type === 'quote_update') {
                setTickers(prev => {
                    const next = new Map(prev);
                    next.set(data.symbol, data.data);
                    return next;
                });
            }
        };
        
        websocket.onclose = () => {
            setConnected(false);
        };
        
        return () => {
            websocket.close();
        };
    }, [symbols.join(',')]);
    
    const subscribe = useCallback((newSymbols: string[]) => {
        if (ws && connected) {
            ws.send(JSON.stringify({
                type: 'subscribe',
                symbols: newSymbols
            }));
        }
    }, [ws, connected]);
    
    const unsubscribe = useCallback((symbolsToRemove: string[]) => {
        if (ws && connected) {
            ws.send(JSON.stringify({
                type: 'unsubscribe',
                symbols: symbolsToRemove
            }));
        }
    }, [ws, connected]);
    
    return { 
        connected, 
        tickers: Object.fromEntries(tickers),
        subscribe,
        unsubscribe
    };
}

// Usage in component
function TickerBoard() {
    const { connected, tickers, subscribe, unsubscribe } = useTickerStream([
        'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'
    ]);
    
    return (
        <div>
            <h2>Live Tickers {connected ? '🟢' : '🔴'}</h2>
            {Object.entries(tickers).map(([symbol, data]) => (
                <div key={symbol}>
                    <strong>{symbol}</strong>: ${data.price}
                    <span style={{ color: data.change >= 0 ? 'green' : 'red' }}>
                        {data.change >= 0 ? '↑' : '↓'} {data.change_percent}%
                    </span>
                </div>
            ))}
            
            <button onClick={() => subscribe(['NFLX', 'NVDA'])}>
                Add More Tickers
            </button>
        </div>
    );
}
```

### Vue 3 Composable

```typescript
import { ref, onMounted, onUnmounted, Ref } from 'vue';

interface TickerData {
    symbol: string;
    price: number;
    change: number;
    change_percent: number;
}

export function useTickerStream(initialSymbols: string[]) {
    const ws: Ref<WebSocket | null> = ref(null);
    const connected = ref(false);
    const tickers: Ref<Record<string, TickerData>> = ref({});
    const subscriptions = ref<string[]>([]);
    
    const connect = () => {
        const websocket = new WebSocket('ws://localhost:8000/ws/tickers');
        
        websocket.onopen = () => {
            connected.value = true;
            ws.value = websocket;
            
            // Subscribe to initial symbols
            subscribe(initialSymbols);
        };
        
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'subscribed':
                    subscriptions.value = data.symbols;
                    break;
                    
                case 'quote':
                case 'quote_update':
                    tickers.value[data.symbol] = data.data;
                    break;
            }
        };
        
        websocket.onclose = () => {
            connected.value = false;
        };
        
        return websocket;
    };
    
    const subscribe = (symbols: string[]) => {
        if (ws.value && connected.value) {
            ws.value.send(JSON.stringify({
                type: 'subscribe',
                symbols: symbols
            }));
        }
    };
    
    const unsubscribe = (symbols: string[]) => {
        if (ws.value && connected.value) {
            ws.value.send(JSON.stringify({
                type: 'unsubscribe',
                symbols: symbols
            }));
        }
    };
    
    onMounted(() => {
        ws.value = connect();
    });
    
    onUnmounted(() => {
        ws.value?.close();
    });
    
    return {
        connected,
        tickers,
        subscriptions,
        subscribe,
        unsubscribe
    };
}

// Usage in component
/*
<script setup lang="ts">
import { useTickerStream } from './composables/useTickerStream';

const { connected, tickers, subscribe, unsubscribe } = useTickerStream([
    'AAPL', 'MSFT', 'GOOGL'
]);
</script>

<template>
    <div>
        <h2>Live Tickers <span v-if="connected">🟢</span><span v-else>🔴</span></h2>
        <div v-for="(data, symbol) in tickers" :key="symbol">
            <strong>{{ symbol }}</strong>: ${{ data.price }}
            <span :style="{ color: data.change >= 0 ? 'green' : 'red' }">
                {{ data.change >= 0 ? '↑' : '↓' }} {{ data.change_percent }}%
            </span>
        </div>
    </div>
</template>
*/
```

## Message Protocol

### Client → Server Messages

#### Subscribe to Symbols
```json
{
    "type": "subscribe",
    "symbols": ["AAPL", "MSFT", "GOOGL"]
}
```

**Response:**
```json
{
    "type": "subscribed",
    "symbols": ["AAPL", "MSFT", "GOOGL"],
    "message": "Subscribed to 3 symbol(s)",
    "timestamp": "2025-11-11T12:00:00Z"
}
```

Then immediately receive quotes:
```json
{
    "type": "quote",
    "symbol": "AAPL",
    "data": {
        "symbol": "AAPL",
        "price": 269.43,
        "change": 0.97,
        "change_percent": 0.36,
        "volume": 12345678,
        "high": 270.50,
        "low": 268.00
    },
    "timestamp": "2025-11-11T12:00:01Z"
}
```

#### Unsubscribe from Symbols
```json
{
    "type": "unsubscribe",
    "symbols": ["MSFT"]
}
```

**Response:**
```json
{
    "type": "unsubscribed",
    "symbols": ["AAPL", "GOOGL"],
    "message": "Now subscribed to 2 symbol(s)",
    "timestamp": "2025-11-11T12:00:05Z"
}
```

#### Check Current Subscriptions
```json
{
    "type": "get_subscriptions"
}
```

**Response:**
```json
{
    "type": "subscriptions",
    "symbols": ["AAPL", "GOOGL"],
    "count": 2,
    "timestamp": "2025-11-11T12:00:10Z"
}
```

#### Ping (Keepalive)
```json
{
    "type": "ping"
}
```

**Response:**
```json
{
    "type": "pong",
    "subscribed_count": 2,
    "timestamp": "2025-11-11T12:00:15Z"
}
```

### Server → Client Messages

#### Connection Established
```json
{
    "type": "connection",
    "status": "connected",
    "endpoint": "/ws/tickers",
    "message": "Connected to ticker stream",
    "timestamp": "2025-11-11T12:00:00Z"
}
```

#### Keepalive (Auto-sent every 30 seconds)
```json
{
    "type": "keepalive",
    "subscribed_count": 2,
    "timestamp": "2025-11-11T12:00:30Z"
}
```

#### Error Message
```json
{
    "type": "error",
    "symbol": "INVALID",
    "message": "Failed to get quote: Symbol not found",
    "timestamp": "2025-11-11T12:00:00Z"
}
```

## Advanced Usage

### Automatic Quote Refresh

By default, quotes are sent immediately upon subscription. To enable automatic periodic updates, uncomment the auto-refresh code in `beast_fastapi_server.py` (line ~620).

### Rate Limiting

The server limits auto-refresh to 5 symbols at a time to prevent API rate limiting. Subscribe to more symbols, but only the first 5 will auto-refresh.

### Connection Management

```javascript
class TickerStreamManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.tickers = new Map();
    }
    
    connect() {
        this.ws = new WebSocket('ws://localhost:8000/ws/tickers');
        
        this.ws.onopen = () => {
            console.log('Connected');
            this.reconnectAttempts = 0;
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected');
            this.reconnect();
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }
    
    subscribe(symbols) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                symbols: symbols
            }));
        }
    }
    
    unsubscribe(symbols) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'unsubscribe',
                symbols: symbols
            }));
        }
    }
    
    handleMessage(data) {
        switch(data.type) {
            case 'quote':
            case 'quote_update':
                this.tickers.set(data.symbol, data.data);
                this.onTickerUpdate?.(data.symbol, data.data);
                break;
                
            case 'subscribed':
                this.onSubscribed?.(data.symbols);
                break;
                
            case 'error':
                this.onError?.(data);
                break;
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Usage
const manager = new TickerStreamManager();
manager.onTickerUpdate = (symbol, data) => {
    console.log(`${symbol}: $${data.price}`);
};
manager.connect();
manager.subscribe(['AAPL', 'MSFT', 'GOOGL']);
```

## Performance Tips

1. **Limit Subscriptions**: Subscribe only to symbols you're actively displaying (max 20-30)
2. **Batch Operations**: Subscribe to multiple symbols in one message instead of individual calls
3. **Cleanup**: Always unsubscribe when leaving a view/component
4. **Connection Pooling**: Reuse one WebSocket connection for all ticker subscriptions
5. **Error Handling**: Implement reconnection logic with exponential backoff

## Troubleshooting

### Connection Refused
```bash
# Ensure server is running
python beast_fastapi_server.py
```

### 403 Forbidden
Server must have the `/ws/tickers` endpoint implemented (now fixed!)

### No Quotes Received
Check that symbols are valid and subscription was confirmed:
```javascript
ws.send(JSON.stringify({ type: 'get_subscriptions' }));
```

### Connection Drops
Implement keepalive pings every 20-25 seconds:
```javascript
setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
    }
}, 20000);
```

## Complete Example

See `test_websocket_fixed.py` for a complete working example of connecting to `/ws/tickers` and subscribing to symbols.

## Summary

✅ **Endpoint**: `ws://localhost:8000/ws/tickers`  
✅ **Purpose**: Real-time stock ticker streaming  
✅ **Features**: Subscribe/unsubscribe, instant quotes, keepalive  
✅ **Message Types**: subscribe, unsubscribe, ping, get_subscriptions  
✅ **Response Types**: connection, subscribed, quote, pong, error, keepalive  
✅ **Status**: Fully implemented and tested
