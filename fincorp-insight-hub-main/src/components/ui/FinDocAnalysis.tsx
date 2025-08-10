import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  MessageSquare,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

interface QuestionResponse {
  answer: string;
  response_time: number;
  accuracy: number;
  sources: number;
  confidence: number;
}

interface SentimentResponse {
  sentiment: string;
  confidence: number;
  processing_time: number;
  sentiment_score: number;
}

interface StockAnalysisResponse {
  symbol: string;
  name: string;
  current_price: number;
  return_percent: number;
  volatility: number;
  market_cap?: string;
  pe_ratio?: number;
  sentiment?: any;
  processing_time: number;
  historical_data?: any[];
}

interface StockComparisonResponse {
  stock1: StockAnalysisResponse;
  stock2: StockAnalysisResponse;
  winner: string;
  performance_difference: number;
  processing_time: number;
}

const FinDocAnalysis = () => {
  // Q&A State
  const [question, setQuestion] = useState('');
  const [qaResponse, setQaResponse] = useState<QuestionResponse | null>(null);
  const [qaLoading, setQaLoading] = useState(false);

  // Sentiment Analysis State
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResponse, setSentimentResponse] = useState<SentimentResponse | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // Stock Analysis State
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalysisResponse | null>(null);
  const [stockLoading, setStockLoading] = useState(false);

  // Stock Comparison State
  const [stock1Symbol, setStock1Symbol] = useState('');
  const [stock2Symbol, setStock2Symbol] = useState('');
  const [stockComparison, setStockComparison] = useState<StockComparisonResponse | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // API Functions
  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setQaLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      if (!response.ok) throw new Error('Failed to get answer');
      
      const data = await response.json();
      setQaResponse(data);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setQaLoading(false);
    }
  };

  const analyzeSentiment = async () => {
    if (!sentimentText.trim()) return;
    
    setSentimentLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentimentText })
      });
      
      if (!response.ok) throw new Error('Failed to analyze sentiment');
      
      const data = await response.json();
      setSentimentResponse(data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setSentimentLoading(false);
    }
  };

  const analyzeStock = async () => {
    if (!stockSymbol.trim()) return;
    
    setStockLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stock/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: stockSymbol.toUpperCase(), period: '1y' })
      });
      
      if (!response.ok) throw new Error('Failed to analyze stock');
      
      const data = await response.json();
      setStockAnalysis(data);
    } catch (error) {
      console.error('Error analyzing stock:', error);
    } finally {
      setStockLoading(false);
    }
  };

  const compareStocks = async () => {
    if (!stock1Symbol.trim() || !stock2Symbol.trim()) return;
    
    setComparisonLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stock/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbol1: stock1Symbol.toUpperCase(), 
          symbol2: stock2Symbol.toUpperCase(), 
          period: '1y' 
        })
      });
      
      if (!response.ok) throw new Error('Failed to compare stocks');
      
      const data = await response.json();
      setStockComparison(data);
    } catch (error) {
      console.error('Error comparing stocks:', error);
    } finally {
      setComparisonLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black p-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            FinDocGPT Analysis Suite
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            AI-powered financial document analysis, sentiment insights, and investment strategy tools
          </p>
        </div>

        <Tabs defaultValue="qa" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Q&A System
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Sentiment Analysis
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Stock Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Comparison
            </TabsTrigger>
          </TabsList>

          {/* Q&A Tab */}
          <TabsContent value="qa">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Financial Document Q&A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-white">Ask a question about financial documents</Label>
                  <Textarea
                    id="question"
                    placeholder="e.g., What is the FY2018 capital expenditure amount for 3M?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button 
                  onClick={askQuestion} 
                  disabled={qaLoading || !question.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {qaLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Ask Question'
                  )}
                </Button>

                {qaResponse && (
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Answer</span>
                        </div>
                        <p className="text-white">{qaResponse.answer}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{qaResponse.response_time}s</div>
                            <div className="text-sm text-white/70">Response Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{qaResponse.accuracy}%</div>
                            <div className="text-sm text-white/70">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{qaResponse.sources}</div>
                            <div className="text-sm text-white/70">Sources</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pink-400">{(qaResponse.confidence * 100).toFixed(1)}%</div>
                            <div className="text-sm text-white/70">Confidence</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Financial Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sentiment-text" className="text-white">Enter financial text to analyze</Label>
                  <Textarea
                    id="sentiment-text"
                    placeholder="e.g., The company's quarterly earnings exceeded expectations with strong revenue growth..."
                    value={sentimentText}
                    onChange={(e) => setSentimentText(e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button 
                  onClick={analyzeSentiment} 
                  disabled={sentimentLoading || !sentimentText.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {sentimentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Sentiment...
                    </>
                  ) : (
                    'Analyze Sentiment'
                  )}
                </Button>

                {sentimentResponse && (
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${
                              sentimentResponse.sentiment === 'POSITIVE' ? 'bg-green-600' :
                              sentimentResponse.sentiment === 'NEGATIVE' ? 'bg-red-600' : 'bg-yellow-600'
                            }`}
                          >
                            {sentimentResponse.sentiment}
                          </Badge>
                          <span className="text-white/70">
                            Processing time: {sentimentResponse.processing_time}s
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">
                              {(sentimentResponse.confidence * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-white/70">Confidence</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">
                              {sentimentResponse.sentiment_score.toFixed(2)}
                            </div>
                            <div className="text-sm text-white/70">Sentiment Score</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Analysis Tab */}
          <TabsContent value="stock">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Individual Stock Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stock-symbol" className="text-white">Stock Symbol</Label>
                  <Input
                    id="stock-symbol"
                    placeholder="e.g., AAPL"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button 
                  onClick={analyzeStock} 
                  disabled={stockLoading || !stockSymbol.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {stockLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Stock...
                    </>
                  ) : (
                    'Analyze Stock'
                  )}
                </Button>

                {stockAnalysis && (
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{stockAnalysis.name} ({stockAnalysis.symbol})</h3>
                          <p className="text-white/70">Processing time: {stockAnalysis.processing_time}s</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">${stockAnalysis.current_price}</div>
                            <div className="text-sm text-white/70">Current Price</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${stockAnalysis.return_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stockAnalysis.return_percent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-white/70">1Y Return</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">{stockAnalysis.volatility.toFixed(2)}%</div>
                            <div className="text-sm text-white/70">Volatility</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {stockAnalysis.pe_ratio ? stockAnalysis.pe_ratio.toFixed(1) : 'N/A'}
                            </div>
                            <div className="text-sm text-white/70">P/E Ratio</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Comparison Tab */}
          <TabsContent value="comparison">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Stock Comparison Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock1" className="text-white">Stock 1</Label>
                    <Input
                      id="stock1"
                      placeholder="e.g., AAPL"
                      value={stock1Symbol}
                      onChange={(e) => setStock1Symbol(e.target.value)}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock2" className="text-white">Stock 2</Label>
                    <Input
                      id="stock2"
                      placeholder="e.g., MSFT"
                      value={stock2Symbol}
                      onChange={(e) => setStock2Symbol(e.target.value)}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <Button 
                  onClick={compareStocks} 
                  disabled={comparisonLoading || !stock1Symbol.trim() || !stock2Symbol.trim()}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  {comparisonLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing Stocks...
                    </>
                  ) : (
                    'Compare Stocks'
                  )}
                </Button>

                {stockComparison && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className="bg-green-600 text-lg px-4 py-2">
                        Winner: {stockComparison.winner}
                      </Badge>
                      <p className="text-white/70 mt-2">
                        Performance difference: {stockComparison.performance_difference.toFixed(2)}%
                      </p>
                      <p className="text-white/70">
                        Processing time: {stockComparison.processing_time}s
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Stock 1 */}
                      <Card className="bg-white/5 border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white text-center">
                            {stockComparison.stock1.name} ({stockComparison.stock1.symbol})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-center">
                            <div>
                              <span className="text-2xl font-bold text-green-400">
                                ${stockComparison.stock1.current_price}
                              </span>
                              <div className="text-sm text-white/70">Current Price</div>
                            </div>
                            <div>
                              <span className={`text-xl font-bold ${stockComparison.stock1.return_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stockComparison.stock1.return_percent.toFixed(2)}%
                              </span>
                              <div className="text-sm text-white/70">1Y Return</div>
                            </div>
                            <div>
                              <span className="text-lg font-bold text-yellow-400">
                                {stockComparison.stock1.volatility.toFixed(2)}%
                              </span>
                              <div className="text-sm text-white/70">Volatility</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Stock 2 */}
                      <Card className="bg-white/5 border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white text-center">
                            {stockComparison.stock2.name} ({stockComparison.stock2.symbol})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-center">
                            <div>
                              <span className="text-2xl font-bold text-green-400">
                                ${stockComparison.stock2.current_price}
                              </span>
                              <div className="text-sm text-white/70">Current Price</div>
                            </div>
                            <div>
                              <span className={`text-xl font-bold ${stockComparison.stock2.return_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stockComparison.stock2.return_percent.toFixed(2)}%
                              </span>
                              <div className="text-sm text-white/70">1Y Return</div>
                            </div>
                            <div>
                              <span className="text-lg font-bold text-yellow-400">
                                {stockComparison.stock2.volatility.toFixed(2)}%
                              </span>
                              <div className="text-sm text-white/70">Volatility</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinDocAnalysis;
