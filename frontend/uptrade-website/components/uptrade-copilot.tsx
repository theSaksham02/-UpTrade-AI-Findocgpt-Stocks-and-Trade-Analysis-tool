"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Sparkles, TrendingUp, Search, Loader2, BarChart3, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface StockSuggestion {
  symbol: string
  name: string
  price?: number
}

export default function UptradeCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Welcome to UpTrade AI Copilot! I'm powered by GPT-4 and HuggingFace.\n\n🚀 I can help you with:\n\n• Real-time stock analysis & quotes\n• Market sentiment from news & social media\n• Technical indicators & patterns\n• Portfolio recommendations\n• Economic data & forecasts\n• Anomaly detection & alerts\n\n💡 Try asking:\n\"What's AAPL's current price?\"\n\"Analyze sentiment for Tesla\"\n\"Compare MSFT vs GOOGL\"\n\"Show me trending tech stocks\"",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stockSuggestions, setStockSuggestions] = useState<StockSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search for stocks as user types
  useEffect(() => {
    if (searchQuery.length < 2) {
      setStockSuggestions([])
      setShowSuggestions(false)
      return
    }

    const searchStocks = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stocks/search?query=${searchQuery}`)
        if (response.ok) {
          const data = await response.json()
          setStockSuggestions(data.results || [])
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Error searching stocks:", error)
      }
    }

    const debounce = setTimeout(searchStocks, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setSearchQuery("")
    setShowSuggestions(false)

    try {
      // Build conversation context from recent messages
      const context = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Try GPT analysis first with context
      const response = await fetch("http://localhost:8000/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: input,
          context: context 
        }),
      })

      const data = await response.json()
      
      // Check if response is valid
      if (data && (data.analysis || data.message)) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.analysis || data.message || "I've analyzed your query!",
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (gptError) {
      console.error("Analysis error:", gptError)
      
      // Fallback to HuggingFace sentiment analysis
      try {
        const hfResponse = await fetch("http://localhost:8000/api/ai/sentiment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        })

        const hfData = await hfResponse.json()
        
        if (hfData && hfData.sentiment) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `📊 **Sentiment Analysis**\n\nSentiment: ${hfData.sentiment}\nScore: ${hfData.score?.toFixed(2) || 'N/A'}\nConfidence: ${hfData.confidence ? (hfData.confidence * 100).toFixed(1) + '%' : 'N/A'}\n\nThis analysis uses advanced NLP models. Would you like more detailed insights?`,
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          throw new Error("Invalid sentiment response")
        }
      } catch (hfError) {
        console.error("Sentiment error:", hfError)
        
        // Final intelligent fallback
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `👋 I'm here to help with "${input}"!\n\n📊 **What I Can Do:**\n\n• **Stock Analysis**: Get real-time quotes, charts, and fundamentals\n• **Market Insights**: Track trending stocks and market movements\n• **Sentiment Analysis**: Analyze news and social media sentiment\n• **Technical Analysis**: RSI, MACD, moving averages, and more\n• **Comparisons**: Compare multiple stocks side-by-side\n• **Forecasting**: AI-powered price predictions\n\n💡 **Quick Examples:**\n"What's Apple's stock price?"\n"Analyze Tesla sentiment"\n"Compare MSFT vs GOOGL"\n"What's trending in tech?"\n"Forecast NVDA for next week"\n\n🚀 I'm connected to 13+ financial APIs and powered by advanced AI. Try asking me anything about stocks or markets!`,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockSelect = (stock: StockSuggestion) => {
    setInput(`Analyze ${stock.symbol} - ${stock.name}`)
    setShowSuggestions(false)
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQueries = [
    { icon: TrendingUp, text: "What's trending today?", query: "What are the top trending stocks today?" },
    { icon: BarChart3, text: "Analyze AAPL stock", query: "Provide detailed analysis of AAPL stock" },
    { icon: Search, text: "Best tech stocks", query: "What are the best tech stocks to buy now?" },
    { icon: Zap, text: "Market sentiment", query: "What's the overall market sentiment today?" }
  ]

  return (
    <>
      {/* Floating Action Button with Aurora glow */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl z-50 transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none"
        size="icon"
        style={{
          boxShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)'
        }}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <div className="relative">
            <Sparkles className="h-7 w-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        )}
      </Button>

      {/* Chat Sidebar with Aurora theme */}
      {isOpen && (
        <Card className="fixed bottom-28 right-8 w-[420px] h-[650px] shadow-2xl z-40 border-purple-500/30 flex flex-col animate-in slide-in-from-right duration-300 backdrop-blur-xl bg-black/90"
          style={{
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.3), 0 20px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-5 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                  <Sparkles className="h-7 w-7 relative animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">UpTrade Copilot</h3>
                  <p className="text-xs text-purple-100">GPT-4 + HuggingFace AI</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar for stocks */}
          <div className="p-3 border-b border-purple-500/20 bg-zinc-900/80 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks... (AAPL, TSLA, etc.)"
                className="pl-9 bg-zinc-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
              {showSuggestions && stockSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-zinc-800/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto">
                  {stockSuggestions.slice(0, 5).map((stock, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStockSelect(stock)}
                      className="w-full text-left px-3 py-2 hover:bg-purple-500/20 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-white text-sm">{stock.symbol}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{stock.name}</div>
                      </div>
                      {stock.price && (
                        <div className="text-xs text-purple-400 font-mono">${stock.price}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-gradient-to-b from-zinc-900/80 to-black/90">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20"
                        : "bg-zinc-800/80 backdrop-blur-sm text-white border border-purple-500/20"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-purple-200" : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-purple-400 mb-3">
                  💡 Try these queries:
                </p>
                {suggestedQueries.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs h-auto py-3 px-3 bg-zinc-800/50 border-purple-500/30 text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200 hover:scale-105"
                      onClick={() => {
                        setInput(item.query)
                        inputRef.current?.focus()
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2 flex-shrink-0 text-purple-400" />
                      <span>{item.text}</span>
                    </Button>
                  )
                })}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/20 bg-zinc-900/90 backdrop-blur-sm">
            <div className="flex gap-2 mb-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about stocks, markets, or analysis..."
                className="flex-1 bg-zinc-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/20"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-gray-400">
              <span className="text-purple-400 font-semibold">Powered by GPT-4 & HuggingFace</span> • Connected to 13+ APIs
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
