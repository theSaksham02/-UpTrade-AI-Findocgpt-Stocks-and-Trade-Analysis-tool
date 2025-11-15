"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Sparkles, TrendingUp, BarChart3, Loader2, Search, Zap } from "lucide-react"
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
      content: "👋 Hello! I'm your UpTrade AI Copilot. I can help you with:\n\n• Market analysis and insights\n• Stock recommendations\n• Portfolio optimization\n• Technical analysis\n• Economic indicators\n• News sentiment analysis\n\nWhat would you like to know?",
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

  const handleStockSelect = (stock: StockSuggestion) => {
    setInput(`Analyze ${stock.symbol} - ${stock.name}`)
    setShowSuggestions(false)
    setSearchQuery("")
    inputRef.current?.focus()
  }

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
    setSearchQuery("")
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      // Build conversation context
      const context = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Call the backend API for AI analysis with context
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
      
      // Validate response
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
      console.error("Error calling GPT API:", gptError)
      
      // Try HuggingFace sentiment analysis as fallback
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
            content: `📊 **Sentiment Analysis**\n\nSentiment: ${hfData.sentiment}\nScore: ${hfData.score?.toFixed(2) || 'N/A'}\nConfidence: ${hfData.confidence ? (hfData.confidence * 100).toFixed(1) + '%' : 'N/A'}\n\nBased on advanced NLP models. Ask me more questions!`,
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, assistantMessage])
          return
        }
      } catch (hfError) {
        console.error("HuggingFace also failed:", hfError)
      }
      
      // Final intelligent fallback
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `👋 I'm here to help with "${input}"!\n\n📊 **My Capabilities:**\n\n• **Stock Analysis**: Real-time quotes, charts, fundamentals\n• **Market Insights**: Trends, movers, sector performance\n• **Sentiment**: News & social media analysis\n• **Technical Analysis**: Indicators, patterns, signals\n• **Economic Data**: GDP, inflation, employment\n• **Forecasting**: AI-powered predictions\n\n💡 **Try asking:**\n"What's Apple's stock price?"\n"Analyze Tesla sentiment"\n"Compare Microsoft vs Google"\n"What's trending in tech stocks?"\n"Forecast NVIDIA for next week"\n"Show me the best dividend stocks"\n\n🚀 Powered by 13+ financial APIs and GPT-4. Ask me anything!`,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQueries = [
    { icon: TrendingUp, text: "What's trending today?", query: "What's trending in the market today?" },
    { icon: BarChart3, text: "Analyze AAPL stock", query: "Analyze AAPL stock performance" },
    { icon: Search, text: "Top tech stocks", query: "Show me top tech stocks" },
    { icon: Zap, text: "Economic indicators", query: "What are the key economic indicators?" }
  ]

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl z-50 transition-all duration-300 hover:scale-110"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        )}
      </Button>

      {/* Chat Sidebar */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-40 border-purple-200 dark:border-purple-900 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-t-lg">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-6 w-6" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold">UpTrade Copilot</h3>
                  <p className="text-xs text-purple-100">AI-Powered Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-purple-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar for stocks */}
          <div className="p-3 border-b border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-[#1F1F23]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks... (AAPL, TSLA, etc.)"
                className="pl-9 bg-white dark:bg-[#0F0F12] border-purple-200 dark:border-purple-900/50"
              />
              {showSuggestions && stockSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-[#1F1F23] border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                  {stockSuggestions.slice(0, 5).map((stock, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStockSelect(stock)}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-sm">{stock.symbol}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{stock.name}</div>
                      </div>
                      {stock.price && (
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">${stock.price}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-white dark:bg-[#0F0F12]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2F2F33]"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-purple-200" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#1F1F23] rounded-2xl px-4 py-3 border border-gray-200 dark:border-[#2F2F33]">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  💡 Suggested queries:
                </p>
                {suggestedQueries.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs h-auto py-2 px-3 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700"
                      onClick={() => {
                        setInput(item.query)
                        inputRef.current?.focus()
                      }}
                    >
                      <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item.text}</span>
                    </Button>
                  )
                })}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-[#1F1F23] bg-white dark:bg-[#0F0F12]">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about markets, stocks, analysis..."
                className="flex-1 bg-gray-50 dark:bg-[#1F1F23] border-gray-200 dark:border-[#2F2F33]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Powered by GPT & HuggingFace AI • Connected to 13+ APIs
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
