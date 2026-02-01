// Technical Indicators for Lightweight Charts
// Implements common trading indicators

import { Time } from 'lightweight-charts'
import { Bar } from './market-data-service'

// Simple Moving Average (SMA)
export function calculateSMA(data: Bar[], period: number): { time: Time; value: number }[] {
    const result: { time: Time; value: number }[] = []

    for (let i = period - 1; i < data.length; i++) {
        let sum = 0
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close
        }
        result.push({
            time: data[i].time,
            value: parseFloat((sum / period).toFixed(2)),
        })
    }

    return result
}

// Exponential Moving Average (EMA)
export function calculateEMA(data: Bar[], period: number): { time: Time; value: number }[] {
    const result: { time: Time; value: number }[] = []
    const multiplier = 2 / (period + 1)

    // Start with SMA for first EMA value
    let sum = 0
    for (let i = 0; i < period; i++) {
        sum += data[i].close
    }
    let ema = sum / period

    result.push({
        time: data[period - 1].time,
        value: parseFloat(ema.toFixed(2)),
    })

    // Calculate EMA for remaining values
    for (let i = period; i < data.length; i++) {
        ema = (data[i].close - ema) * multiplier + ema
        result.push({
            time: data[i].time,
            value: parseFloat(ema.toFixed(2)),
        })
    }

    return result
}

// Relative Strength Index (RSI)
export function calculateRSI(data: Bar[], period: number = 14): { time: Time; value: number }[] {
    const result: { time: Time; value: number }[] = []

    if (data.length < period + 1) return result

    let gains = 0
    let losses = 0

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
        const change = data[i].close - data[i - 1].close
        if (change > 0) {
            gains += change
        } else {
            losses += Math.abs(change)
        }
    }

    let avgGain = gains / period
    let avgLoss = losses / period

    // First RSI value
    const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss
    result.push({
        time: data[period].time,
        value: parseFloat((100 - (100 / (1 + firstRS))).toFixed(2)),
    })

    // Calculate RSI for remaining values
    for (let i = period + 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close
        const gain = change > 0 ? change : 0
        const loss = change < 0 ? Math.abs(change) : 0

        avgGain = (avgGain * (period - 1) + gain) / period
        avgLoss = (avgLoss * (period - 1) + loss) / period

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
        const rsi = 100 - (100 / (1 + rs))

        result.push({
            time: data[i].time,
            value: parseFloat(rsi.toFixed(2)),
        })
    }

    return result
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(
    data: Bar[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
): {
    macd: { time: Time; value: number }[]
    signal: { time: Time; value: number }[]
    histogram: { time: Time; value: number; color: string }[]
} {
    const fastEMA = calculateEMA(data, fastPeriod)
    const slowEMA = calculateEMA(data, slowPeriod)

    const macd: { time: Time; value: number }[] = []

    // Calculate MACD line
    const startIndex = slowPeriod - fastPeriod
    for (let i = 0; i < slowEMA.length; i++) {
        const fastValue = fastEMA[i + startIndex]?.value
        const slowValue = slowEMA[i]?.value

        if (fastValue !== undefined && slowValue !== undefined) {
            macd.push({
                time: slowEMA[i].time,
                value: parseFloat((fastValue - slowValue).toFixed(4)),
            })
        }
    }

    // Calculate Signal line (EMA of MACD)
    const signal: { time: Time; value: number }[] = []
    const multiplier = 2 / (signalPeriod + 1)

    if (macd.length >= signalPeriod) {
        let sum = 0
        for (let i = 0; i < signalPeriod; i++) {
            sum += macd[i].value
        }
        let ema = sum / signalPeriod

        signal.push({
            time: macd[signalPeriod - 1].time,
            value: parseFloat(ema.toFixed(4)),
        })

        for (let i = signalPeriod; i < macd.length; i++) {
            ema = (macd[i].value - ema) * multiplier + ema
            signal.push({
                time: macd[i].time,
                value: parseFloat(ema.toFixed(4)),
            })
        }
    }

    // Calculate Histogram
    const histogram: { time: Time; value: number; color: string }[] = []
    const signalStartIndex = signalPeriod - 1

    for (let i = 0; i < signal.length; i++) {
        const macdValue = macd[i + signalStartIndex]?.value
        const signalValue = signal[i]?.value

        if (macdValue !== undefined && signalValue !== undefined) {
            const histValue = macdValue - signalValue
            histogram.push({
                time: signal[i].time,
                value: parseFloat(histValue.toFixed(4)),
                color: histValue >= 0 ? '#089981' : '#f23645',
            })
        }
    }

    return { macd, signal, histogram }
}

// Bollinger Bands
export function calculateBollingerBands(
    data: Bar[],
    period: number = 20,
    stdDev: number = 2
): {
    upper: { time: Time; value: number }[]
    middle: { time: Time; value: number }[]
    lower: { time: Time; value: number }[]
} {
    const middle = calculateSMA(data, period)
    const upper: { time: Time; value: number }[] = []
    const lower: { time: Time; value: number }[] = []

    for (let i = period - 1; i < data.length; i++) {
        // Calculate standard deviation
        let sum = 0
        const sma = middle[i - (period - 1)].value

        for (let j = 0; j < period; j++) {
            sum += Math.pow(data[i - j].close - sma, 2)
        }
        const sd = Math.sqrt(sum / period)

        upper.push({
            time: data[i].time,
            value: parseFloat((sma + stdDev * sd).toFixed(2)),
        })

        lower.push({
            time: data[i].time,
            value: parseFloat((sma - stdDev * sd).toFixed(2)),
        })
    }

    return { upper, middle, lower }
}

// Volume Weighted Average Price (VWAP)
export function calculateVWAP(data: Bar[]): { time: Time; value: number }[] {
    const result: { time: Time; value: number }[] = []
    let cumulativeVolume = 0
    let cumulativeTP_Volume = 0

    for (let i = 0; i < data.length; i++) {
        const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
        const volume = data[i].volume || 0

        cumulativeTP_Volume += typicalPrice * volume
        cumulativeVolume += volume

        const vwap = cumulativeVolume > 0 ? cumulativeTP_Volume / cumulativeVolume : typicalPrice

        result.push({
            time: data[i].time,
            value: parseFloat(vwap.toFixed(2)),
        })
    }

    return result
}

// Average True Range (ATR)
export function calculateATR(data: Bar[], period: number = 14): { time: Time; value: number }[] {
    const result: { time: Time; value: number }[] = []

    if (data.length < period + 1) return result

    // Calculate True Range for each bar
    const trueRanges: number[] = []

    for (let i = 1; i < data.length; i++) {
        const high = data[i].high
        const low = data[i].low
        const prevClose = data[i - 1].close

        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        )
        trueRanges.push(tr)
    }

    // First ATR is simple average
    let sum = 0
    for (let i = 0; i < period; i++) {
        sum += trueRanges[i]
    }
    let atr = sum / period

    result.push({
        time: data[period].time,
        value: parseFloat(atr.toFixed(4)),
    })

    // Smoothed ATR for remaining values
    for (let i = period; i < trueRanges.length; i++) {
        atr = (atr * (period - 1) + trueRanges[i]) / period
        result.push({
            time: data[i + 1].time,
            value: parseFloat(atr.toFixed(4)),
        })
    }

    return result
}

// Indicator configuration
export const INDICATORS = {
    SMA: {
        name: 'Simple Moving Average',
        shortName: 'SMA',
        defaultPeriod: 20,
        color: '#2962FF',
    },
    EMA: {
        name: 'Exponential Moving Average',
        shortName: 'EMA',
        defaultPeriod: 20,
        color: '#FF9800',
    },
    RSI: {
        name: 'Relative Strength Index',
        shortName: 'RSI',
        defaultPeriod: 14,
        color: '#9C27B0',
        overlay: false,
    },
    MACD: {
        name: 'MACD',
        shortName: 'MACD',
        overlay: false,
    },
    BB: {
        name: 'Bollinger Bands',
        shortName: 'BB',
        defaultPeriod: 20,
        color: '#607D8B',
    },
    VWAP: {
        name: 'Volume Weighted Average Price',
        shortName: 'VWAP',
        color: '#795548',
    },
    ATR: {
        name: 'Average True Range',
        shortName: 'ATR',
        defaultPeriod: 14,
        overlay: false,
    },
} as const

export type IndicatorType = keyof typeof INDICATORS
