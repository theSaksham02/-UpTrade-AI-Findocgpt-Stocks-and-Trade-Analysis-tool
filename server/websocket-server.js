// Uptrade WebSocket Server - VisualX Sentiment Engine
// Real-time market data aggregation and divergence detection

const WebSocket = require('ws');
const http = require('http');
const EventEmitter = require('events');

// Sentiment buffer for tracking
class CircularBuffer {
    constructor(size = 100) {
        this.buffer = [];
        this.maxSize = size;
    }

    push(item) {
        this.buffer.push(item);
        if (this.buffer.length > this.maxSize) {
            this.buffer.shift();
        }
    }

    get(count) {
        return this.buffer.slice(-count);
    }

    get length() {
        return this.buffer.length;
    }

    get last() {
        return this.buffer[this.buffer.length - 1];
    }
}

class UptradeServer extends EventEmitter {
    constructor(options = {}) {
        super();

        this.port = options.port || 8080;
        this.server = http.createServer();
        this.wss = new WebSocket.Server({
            server: this.server,
            perMessageDeflate: {
                zlibDeflateOptions: { chunkSize: 1024, memLevel: 7, level: 3 },
                clientNoContextTakeover: true,
                serverNoContextTakeover: true,
            },
        });

        this.clients = new Map(); // clientId -> { ws, subscriptions }
        this.sentimentBuffers = new Map(); // symbol -> CircularBuffer
        this.priceHistory = new Map(); // symbol -> CircularBuffer
        this.candleAggregators = new Map(); // symbol -> current incomplete candle

        // Supported symbols
        this.symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BTC', 'ETH', 'SPY'];

        // Initialize buffers
        this.symbols.forEach(symbol => {
            this.sentimentBuffers.set(symbol, new CircularBuffer(100));
            this.priceHistory.set(symbol, new CircularBuffer(100));
        });

        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateClientId();
            console.log(`Client connected: ${clientId}`);

            this.clients.set(clientId, {
                ws,
                subscriptions: new Set(),
                lastPing: Date.now(),
            });

            // Send connection acknowledgment
            ws.send(JSON.stringify({
                type: 'connected',
                clientId,
                symbols: this.symbols,
                timestamp: Date.now(),
            }));

            // Handle messages
            ws.on('message', (data) => this.handleMessage(clientId, data));
            ws.on('close', () => this.handleDisconnect(clientId));
            ws.on('error', (err) => console.error(`WS Error [${clientId}]:`, err));

            // Heartbeat
            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });
        });

        // Heartbeat interval
        this.heartbeatInterval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    handleMessage(clientId, data) {
        try {
            const msg = JSON.parse(data.toString());
            const client = this.clients.get(clientId);
            if (!client) return;

            switch (msg.type) {
                case 'subscribe':
                    this.handleSubscribe(client, msg);
                    break;

                case 'unsubscribe':
                    this.handleUnsubscribe(client, msg);
                    break;

                case 'ping':
                    client.ws.send(JSON.stringify({
                        type: 'pong',
                        time: Date.now(),
                    }));
                    break;

                case 'alert':
                    // Client-reported divergence, broadcast to all
                    this.broadcastToSymbol(msg.alert.symbol, {
                        type: 'alert',
                        data: msg.alert,
                    });
                    break;

                default:
                    console.warn(`Unknown message type: ${msg.type}`);
            }
        } catch (err) {
            console.error('Message handling error:', err);
        }
    }

    handleSubscribe(client, msg) {
        const { symbol, interval, channels = ['trade'] } = msg;
        const subKey = `${symbol}:${interval}`;
        client.subscriptions.add(subKey);

        console.log(`Client subscribed to ${subKey}`);

        // Send historical data
        this.sendHistoricalData(client.ws, symbol, interval);

        // Send current sentiment state
        const sentimentBuffer = this.sentimentBuffers.get(symbol);
        if (sentimentBuffer && sentimentBuffer.length > 0) {
            const recentSentiment = sentimentBuffer.get(10);
            client.ws.send(JSON.stringify({
                type: 'sentiment_history',
                symbol,
                data: recentSentiment,
            }));
        }
    }

    handleUnsubscribe(client, msg) {
        const { symbol, interval } = msg;
        const subKey = `${symbol}:${interval}`;
        client.subscriptions.delete(subKey);
        console.log(`Client unsubscribed from ${subKey}`);
    }

    sendHistoricalData(ws, symbol, interval) {
        // Generate demo historical data
        const bars = this.generateHistoricalBars(symbol, 500);

        ws.send(JSON.stringify({
            type: 'history',
            symbol,
            interval,
            data: bars,
        }));
    }

    generateHistoricalBars(symbol, count) {
        const basePrices = {
            AAPL: 189, MSFT: 378, GOOGL: 141, AMZN: 178,
            NVDA: 721, TSLA: 248, META: 475, BTC: 43250, ETH: 2285, SPY: 478,
        };

        const basePrice = basePrices[symbol] || 100;
        const bars = [];
        const now = Date.now();
        let price = basePrice * (0.85 + Math.random() * 0.1);

        for (let i = count; i >= 0; i--) {
            const time = Math.floor((now - i * 60000) / 1000); // 1-minute bars
            const volatility = 0.02;
            const change = price * volatility * (Math.random() - 0.48);

            const open = price;
            const close = price + change;
            const high = Math.max(open, close) * (1 + Math.random() * 0.005);
            const low = Math.min(open, close) * (1 - Math.random() * 0.005);
            const volume = Math.floor(Math.random() * 500000) + 50000;

            bars.push({ time, open, high, low, close, volume });
            price = close;
        }

        return bars;
    }

    // Simulate market data updates
    startMarketSimulation() {
        console.log('Starting market data simulation...');

        // Price updates every second
        this.priceInterval = setInterval(() => {
            this.symbols.forEach(symbol => {
                const priceBuffer = this.priceHistory.get(symbol);
                const lastPrice = priceBuffer?.last?.price || this.getBasePrice(symbol);

                const volatility = 0.001;
                const change = lastPrice * volatility * (Math.random() - 0.5);
                const newPrice = parseFloat((lastPrice + change).toFixed(2));

                const tick = {
                    time: Math.floor(Date.now() / 1000),
                    price: newPrice,
                    volume: Math.floor(Math.random() * 10000),
                };

                priceBuffer.push(tick);

                // Aggregate into candles
                const candle = this.aggregateCandle(symbol, tick);
                if (candle) {
                    this.broadcastToSymbol(symbol, {
                        type: 'candle',
                        symbol,
                        data: candle,
                    });
                }

                // Run divergence detection
                this.runDivergenceDetection(symbol);
            });
        }, 1000);

        // Sentiment updates every 5 seconds
        this.sentimentInterval = setInterval(() => {
            this.symbols.forEach(symbol => {
                const sentimentBuffer = this.sentimentBuffers.get(symbol);
                const lastSentiment = sentimentBuffer?.last?.score || 0;

                // Random walk for sentiment
                const change = 0.1 * (Math.random() - 0.5);
                const newScore = Math.max(-1, Math.min(1, lastSentiment + change));

                const sentiment = {
                    time: Math.floor(Date.now() / 1000),
                    score: parseFloat(newScore.toFixed(3)),
                    volume: Math.floor(Math.random() * 1000),
                    source: ['twitter', 'reddit', 'news'][Math.floor(Math.random() * 3)],
                };

                sentimentBuffer.push(sentiment);

                this.broadcastToSymbol(symbol, {
                    type: 'sentiment',
                    symbol,
                    data: sentiment,
                });
            });
        }, 5000);
    }

    getBasePrice(symbol) {
        const basePrices = {
            AAPL: 189, MSFT: 378, GOOGL: 141, AMZN: 178,
            NVDA: 721, TSLA: 248, META: 475, BTC: 43250, ETH: 2285, SPY: 478,
        };
        return basePrices[symbol] || 100;
    }

    aggregateCandle(symbol, tick) {
        if (!this.candleAggregators.has(symbol)) {
            this.candleAggregators.set(symbol, {
                time: tick.time,
                open: tick.price,
                high: tick.price,
                low: tick.price,
                close: tick.price,
                volume: tick.volume,
            });
            return null;
        }

        const candle = this.candleAggregators.get(symbol);
        const currentSecond = Math.floor(tick.time / 60) * 60; // 1-minute buckets
        const candleSecond = Math.floor(candle.time / 60) * 60;

        if (currentSecond === candleSecond) {
            // Update current candle
            candle.high = Math.max(candle.high, tick.price);
            candle.low = Math.min(candle.low, tick.price);
            candle.close = tick.price;
            candle.volume += tick.volume;
            return { ...candle, time: candleSecond };
        } else {
            // New candle period
            const completedCandle = { ...candle, time: candleSecond };
            this.candleAggregators.set(symbol, {
                time: tick.time,
                open: tick.price,
                high: tick.price,
                low: tick.price,
                close: tick.price,
                volume: tick.volume,
            });
            return completedCandle;
        }
    }

    runDivergenceDetection(symbol) {
        const sentimentBuffer = this.sentimentBuffers.get(symbol);
        const priceBuffer = this.priceHistory.get(symbol);

        if (!sentimentBuffer || sentimentBuffer.length < 10) return;
        if (!priceBuffer || priceBuffer.length < 10) return;

        const recentSentiment = sentimentBuffer.get(10);
        const recentPrices = priceBuffer.get(10);

        // Calculate trends
        const sentimentTrend = this.calculateTrend(recentSentiment.map(s => s.score));
        const priceTrend = this.calculateTrend(recentPrices.map(p => p.price));

        // Detect divergence: Sentiment crashing but price stable
        if (sentimentTrend < -0.15 && priceTrend > -0.02) {
            const alert = {
                id: `div-${Date.now()}-${symbol}`,
                symbol,
                type: 'LIQUIDITY_DIVERGENCE',
                severity: sentimentTrend < -0.3 ? 'critical' : 'high',
                timestamp: Date.now(),
                price: recentPrices[recentPrices.length - 1].price,
                sentiment: recentSentiment[recentSentiment.length - 1].score,
                priceTrend,
                sentimentTrend,
                message: `Liquidity divergence: Price +${(priceTrend * 100).toFixed(2)}%, Sentiment ${(sentimentTrend * 100).toFixed(1)}%`,
            };

            console.log(`ALERT: ${alert.message}`);

            this.broadcastToSymbol(symbol, {
                type: 'alert',
                data: alert,
            });
        }
    }

    calculateTrend(values) {
        const n = values.length;
        if (n < 2) return 0;

        const x = Array.from({ length: n }, (_, i) => i);
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((total, xi, i) => total + xi * values[i], 0);
        const sumXX = x.reduce((total, xi) => total + xi * xi, 0);

        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    broadcastToSymbol(symbol, message) {
        const messageStr = JSON.stringify(message);

        this.clients.forEach((client) => {
            for (const sub of client.subscriptions) {
                if (sub.startsWith(symbol + ':')) {
                    if (client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(messageStr);
                    }
                    break;
                }
            }
        });
    }

    handleDisconnect(clientId) {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
    }

    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Uptrade WebSocket Server listening on port ${this.port}`);
            this.startMarketSimulation();
        });
    }

    stop() {
        clearInterval(this.heartbeatInterval);
        clearInterval(this.priceInterval);
        clearInterval(this.sentimentInterval);
        this.wss.close();
        this.server.close();
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new UptradeServer({
        port: process.env.PORT || 8080,
    });
    server.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('Shutting down...');
        server.stop();
        process.exit(0);
    });
}

module.exports = UptradeServer;
