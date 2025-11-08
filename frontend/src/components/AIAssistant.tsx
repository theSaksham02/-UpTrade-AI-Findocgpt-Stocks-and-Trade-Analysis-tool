import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, BarChart3, Newspaper, Wallet, X, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  widgets?: string[];
}

interface AIAssistantProps {
  onClose?: () => void;
  isFloating?: boolean;
}

const SUGGESTED_QUERIES = [
  { icon: TrendingUp, text: "What's the price of AAPL?", query: "price of AAPL" },
  { icon: BarChart3, text: "Generate forecast for TSLA", query: "forecast TSLA 30 days" },
  { icon: Newspaper, text: "Latest news on NVDA", query: "news and sentiment for NVDA" },
  { icon: Wallet, text: "Show my portfolio", query: "show my portfolio" },
];

export default function AIAssistant({ onClose, isFloating = false }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI financial assistant. I can help you with:\n\n• Stock prices and quotes\n• Price forecasts and predictions\n• News and sentiment analysis\n• Portfolio tracking\n• Trading insights\n\nWhat would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuery = async (query: string) => {
    setInput(query);
    await handleSend(query);
  };

  const handleSend = async (queryText?: string) => {
    const query = queryText || input.trim();
    if (!query || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI endpoint
      const response = await axios.post('http://localhost:8000/api/v1/ai/query', {
        query: query,
        context: messages.map(m => m.content).slice(-5),
      });

      const data = response.data;

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        data: data.data,
        widgets: data.widgets,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('AI query error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble processing that request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerClass = isFloating
    ? "fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50"
    : "w-full h-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-blue-100">Ask me anything about markets</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user'
                ? 'bg-blue-600'
                : 'bg-gradient-to-br from-purple-600 to-blue-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {/* Display data if available */}
              {message.data && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  {Array.isArray(message.data) && message.data.map((item: any, idx: number) => (
                    <div key={idx} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.ticker}</span>
                        <span className="font-mono text-sm">${item.price?.toFixed(2)}</span>
                      </div>
                      <div className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change_percent?.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-slate-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries (only show when no user messages) */}
      {messages.filter(m => m.type === 'user').length === 0 && (
        <div className="px-4 pb-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 mb-2 mt-3">Suggested queries:</p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_QUERIES.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuery(suggestion.query)}
                className="flex items-center gap-2 p-2 text-left text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              >
                <suggestion.icon className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-slate-700 dark:text-slate-300">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about stocks, forecasts, news..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
