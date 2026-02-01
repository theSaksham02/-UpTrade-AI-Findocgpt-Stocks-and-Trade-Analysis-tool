'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { WebSocketMessage, ConnectionStatus, SubscriptionRequest } from '@/types/uptrade'

interface UseWebSocketOptions {
    onMessage?: (message: WebSocketMessage) => void
    reconnectInterval?: number
    maxReconnectAttempts?: number
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
    const ws = useRef<WebSocket | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
    const reconnectTimeout = useRef<NodeJS.Timeout>()
    const reconnectAttempts = useRef(0)
    const messageQueue = useRef<object[]>([])

    const {
        onMessage,
        reconnectInterval = 3000,
        maxReconnectAttempts = 10
    } = options

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return

        setConnectionStatus('connecting')

        try {
            ws.current = new WebSocket(url)

            ws.current.onopen = () => {
                setConnectionStatus('connected')
                reconnectAttempts.current = 0
                console.log('WebSocket connected')

                // Send queued messages
                while (messageQueue.current.length > 0) {
                    const msg = messageQueue.current.shift()
                    if (msg) ws.current?.send(JSON.stringify(msg))
                }
            }

            ws.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data)
                    setLastMessage(message)
                    onMessage?.(message)
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err)
                }
            }

            ws.current.onclose = (event) => {
                setConnectionStatus('disconnected')
                console.log('WebSocket disconnected:', event.code, event.reason)

                // Attempt reconnection with exponential backoff
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    const delay = reconnectInterval * Math.pow(2, reconnectAttempts.current)
                    reconnectTimeout.current = setTimeout(() => {
                        reconnectAttempts.current++
                        connect()
                    }, Math.min(delay, 30000)) // Max 30 second delay
                }
            }

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error)
                setConnectionStatus('error')
            }
        } catch (err) {
            console.error('Failed to create WebSocket:', err)
            setConnectionStatus('error')
        }
    }, [url, onMessage, reconnectInterval, maxReconnectAttempts])

    // Initial connection
    useEffect(() => {
        connect()

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current)
            }
            ws.current?.close()
        }
    }, [connect])

    // Send message function
    const sendMessage = useCallback((message: object) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message))
        } else {
            // Queue message for when connection is restored
            messageQueue.current.push(message)
            console.warn('WebSocket not ready, message queued')
        }
    }, [])

    // Subscribe to symbol
    const subscribe = useCallback((request: SubscriptionRequest) => {
        sendMessage({
            type: 'subscribe',
            ...request,
        })
    }, [sendMessage])

    // Unsubscribe from symbol
    const unsubscribe = useCallback((symbol: string, interval: string) => {
        sendMessage({
            type: 'unsubscribe',
            symbol,
            interval,
        })
    }, [sendMessage])

    // Ping for keepalive
    const ping = useCallback(() => {
        sendMessage({ type: 'ping', time: Date.now() })
    }, [sendMessage])

    // Reconnect manually
    const reconnect = useCallback(() => {
        ws.current?.close()
        reconnectAttempts.current = 0
        connect()
    }, [connect])

    return {
        connectionStatus,
        lastMessage,
        sendMessage,
        subscribe,
        unsubscribe,
        ping,
        reconnect,
        isConnected: connectionStatus === 'connected',
    }
}

export default useWebSocket
