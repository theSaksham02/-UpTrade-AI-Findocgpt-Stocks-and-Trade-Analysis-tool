import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3, 
  Zap,
  Shield,
  Users,
  DollarSign,
  ChevronDown,
  Play,
  Calculator,
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  Check,
  X,
  Activity,
  Brain,
  BarChart2,
  Scale,
  LineChart,
  Smartphone
} from 'lucide-react';

const Index = () => {
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [loadingROI, setLoadingROI] = useState(false);
  const [errorROI, setErrorROI] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingTool, setLoadingTool] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(32);
  const [hourlyRate, setHourlyRate] = useState(150);

  const calculateROI = () => {
    const annualHours = hoursPerWeek * 52;
    const currentCost = teamSize * annualHours * hourlyRate;
    const findocgptCost = teamSize * 2347 * 12;
    const savings = currentCost * 0.968 - findocgptCost;
    const roi = (savings / findocgptCost) * 100;
    
    return {
      currentCost,
      findocgptCost,
      savings,
      roi,
      breakEvenMonths: Math.ceil(findocgptCost / (savings / 12))
    };
  };

  const result = calculateROI();

  // Premium Tools Data
  const premiumTools = [
    {
      id: 'tradex',
      name: 'TradeX',
      icon: Scale,
      description: 'Advanced stock comparison and analysis engine',
      status: 'active',
      features: ['Real-time comparison', 'Sentiment integration', 'Performance metrics'],
      gradient: 'from-blue-600 to-purple-600',
      link: 'http://localhost:8501'
    },
    {
      id: 'visualx',
      name: 'VisualX',
      icon: BarChart2,
      description: 'Advanced data visualization and interactive charts',
      status: 'coming-soon',
      features: ['Interactive dashboards', '3D visualizations', 'Custom chart builder'],
      gradient: 'from-green-600 to-blue-600'
    },
    {
      id: 'hftx',
      name: 'HFTX',
      icon: Zap,
      description: 'High-frequency trading algorithms and automation',
      status: 'coming-soon',
      features: ['Microsecond execution', 'ML-driven strategies', 'Risk management'],
      gradient: 'from-red-600 to-orange-600'
    }
  ];

  const openStreamlitApp = () => {
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-5xl mx-auto">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Trusted by firms managing $847B in assets
            </Badge>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              Stop Losing{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                $2.3M Annually
              </span>
              <br />
              on Manual Financial Analysis
            </h1>
            
            <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto font-normal leading-relaxed">
              847,000+ analysts trust AI to deliver 94.7% accurate insights in 2.1 seconds
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={async () => {
                  setLoadingROI(true);
                  setErrorROI("");
                  setSuccessMessage("");
                  try {
                    // Simulate API call to backend for ROI calculation
                    await new Promise(res => setTimeout(res, 1200));
                    setShowROICalculator(true);
                    setSuccessMessage("ROI calculator opened successfully!");
                  } catch (err) {
                    setErrorROI("Failed to open ROI calculator. Try again.");
                  } finally {
                    setLoadingROI(false);
                  }
                }}
                disabled={loadingROI}
              >
                <Calculator className="mr-2 h-5 w-5" />
                {loadingROI ? "Loading..." : "Calculate Your ROI"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Demo
              </Button>
            </div>
            {successMessage && (
              <p className="text-green-400 mt-2">{successMessage}</p>
            )}
            {errorROI && (
              <p className="text-red-400 mt-2">{errorROI}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
              {[
                { label: "Accuracy", value: "94.7%", description: "vs industry 71.3%", icon: Target },
                { label: "Speed", value: "2.1s", description: "response time", icon: Clock },
                { label: "Savings", value: "96.8%", description: "cost reduction", icon: DollarSign },
                { label: "ROI", value: "2,847%", description: "in 18 months", icon: TrendingUp }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <Icon className="h-6 w-6 text-purple-400 mx-auto mb-2 group-hover:text-pink-400 transition-colors" />
                    <div className="text-xl md:text-2xl font-semibold text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/60 mb-1">{metric.label}</div>
                    <div className="text-xs text-white/50">{metric.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/50" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 lg:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              The <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">$847M Cost</span> of Manual Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "32 hours", label: "wasted per analyst weekly" },
                { value: "23%", label: "error rate in document extraction" },
                { value: "$2.3M", label: "annual cost per analyst team" },
                { value: "67%", label: "of critical insights missed" }
              ].map((item, index) => (
                <Card key={index} className="bg-red-900/20 border-red-500/30 backdrop-blur-sm hover:bg-red-900/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {item.value}
                    </div>
                    <p className="text-sm text-white/70">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$47.3B Market</span>, $3.2B Opportunity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Market", value: "$47.3B", description: "Financial Analytics Software", icon: BarChart3 },
                { title: "Target Segment", value: "$3.2B", description: "Document analysis & sentiment", icon: Target },
                { title: "Professionals", value: "847K", description: "Investment analysts globally", icon: Users },
                { title: "Revenue Potential", value: "$89.4M", description: "Annual recurring revenue", icon: TrendingUp }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <Icon className="h-8 w-8 text-purple-400 mb-4 group-hover:text-pink-400 transition-colors" />
                      <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                      <h3 className="font-medium text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/60">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 lg:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              FinDocGPT: <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">2,847% ROI</span> in 18 Months
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "AI Q&A Engine", accuracy: "94.7%", speed: "2.1s", icon: Zap },
              { title: "Sentiment Analysis", batch: "150 docs", precision: "91.2%", icon: BarChart3 },
              { title: "Stock Forecasting", mse: "MSE 1.75", horizon: "30 days", icon: TrendingUp },
              { title: "TradeX Comparison", rate: "89.4%", unique: "Market Unique", icon: Star }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-600/20">
                        <Icon className="h-6 w-6 text-purple-400 group-hover:text-pink-400 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {feature.accuracy && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Accuracy</span>
                          <span className="font-bold text-purple-400">{feature.accuracy}</span>
                        </div>
                      )}
                      {feature.speed && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Response</span>
                          <span className="font-bold text-pink-400">{feature.speed}</span>
                        </div>
                      )}
                      {feature.batch && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Batch Size</span>
                          <span className="font-bold text-purple-400">{feature.batch}</span>
                        </div>
                      )}
                      {feature.precision && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Precision</span>
                          <span className="font-bold text-pink-400">{feature.precision}</span>
                        </div>
                      )}
                      {feature.mse && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">MSE</span>
                          <span className="font-bold text-purple-400">{feature.mse}</span>
                        </div>
                      )}
                      {feature.horizon && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Horizon</span>
                          <span className="font-bold text-pink-400">{feature.horizon}</span>
                        </div>
                      )}
                      {feature.rate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Win Rate</span>
                          <span className="font-bold text-purple-400">{feature.rate}</span>
                        </div>
                      )}
                      {feature.unique && (
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Market</span>
                          <span className="font-bold text-yellow-400">{feature.unique}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Tools Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Premium Trading <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Arsenal</span>
            </h2>
            <p className="text-lg text-white/70">
              Advanced tools for professional traders and analysts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {premiumTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group relative overflow-hidden ${
                    tool.status === 'active' ? 'ring-2 ring-purple-500/50' : ''
                  }`}
                >
                  {tool.status === 'active' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                        ACTIVE
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tool.gradient} p-4 mb-6 mx-auto`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white text-center mb-3">
                      {tool.name}
                    </h3>
                    
                    <p className="text-white/70 text-center mb-6">
                      {tool.description}
                    </p>
                    
                    <ul className="space-y-2 mb-8">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-white/60">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-center">
                      {tool.status === 'active' ? (
                        <Button 
                          className={`w-full bg-gradient-to-r ${tool.gradient} hover:scale-105 transition-all duration-300 text-white font-semibold`}
                          onClick={async () => {
                            setLoadingTool(tool.id);
                            setSuccessMessage("");
                            setErrorROI("");
                            try {
                              // Simulate API call for tool launch
                              await new Promise(res => setTimeout(res, 1500));
                              window.open(tool.link, '_blank');
                              setSuccessMessage(`${tool.name} launched successfully!`);
                            } catch (err) {
                              setErrorROI(`Failed to launch ${tool.name}. Try again.`);
                            } finally {
                              setLoadingTool(null);
                            }
                          }}
                          disabled={loadingTool === tool.id}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {loadingTool === tool.id ? "Launching..." : `Launch ${tool.name}`}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full border-white/30 text-white/50 cursor-not-allowed"
                          disabled
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Main App Access Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={async () => {
                setLoadingTool("main-platform");
                setSuccessMessage("");
                setErrorROI("");
                try {
                  // Simulate API connection check
                  await new Promise(res => setTimeout(res, 1200));
                  window.open('http://localhost:8501', '_blank');
                  setSuccessMessage("FinDocGPT platform launched successfully!");
                } catch (err) {
                  setErrorROI("Failed to launch platform. Try again.");
                } finally {
                  setLoadingTool(null);
                }
              }}
              disabled={loadingTool === "main-platform"}
            >
              <Smartphone className="mr-3 h-6 w-6" />
              {loadingTool === "main-platform" ? "Launching Platform..." : "Access Full FinDocGPT Platform"}
            </Button>
            <p className="text-white/60 mt-4">
              Launch the complete AI-powered financial analysis platform
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      {showROICalculator && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl">
                  Calculate Your $2.3M Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="text-white">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hoursPerWeek" className="text-white">Hours/Week per Analyst</Label>
                    <Input
                      id="hoursPerWeek"
                      type="number"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                      min="1"
                      max="80"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-white">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      min="50"
                      max="500"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                  <div className="text-center p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      ${result.currentCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">Current Annual Cost</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      ${result.findocgptCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">FinDocGPT Cost</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      ${result.savings.toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">Annual Savings</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {result.roi.toFixed(0)}%
                    </div>
                    <div className="text-sm text-white/60">ROI</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1">
                    Start 30-Day Trial
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 flex-1">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Feature Comparison */}
      <section className="py-16 lg:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Platform <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Comparison</span>
            </h2>
            <p className="text-white/70">
              See why 847,000+ analysts choose FinDocGPT
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/60">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium bg-purple-600/10">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">FinDocGPT</div>
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-white/60">
                      Bloomberg Terminal
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-white/60">
                      ChatGPT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {[
                    { name: "Financial Q&A Accuracy", findocgpt: "94.7%", bloomberg: "71.3%", chatgpt: "11.2%" },
                    { name: "Response Time", findocgpt: "2.1 seconds", bloomberg: "8.4 seconds", chatgpt: "3.2 seconds" },
                    { name: "Sentiment Analysis", findocgpt: "91.2% precision", bloomberg: "67.8% precision", chatgpt: "❌" },
                    { name: "Batch Processing", findocgpt: "150 docs/batch", bloomberg: "10 docs/batch", chatgpt: "1 doc at a time" },
                    { name: "Stock Forecasting", findocgpt: "MSE 1.75", bloomberg: "MSE 3.21", chatgpt: "❌" },
                    { name: "TradeX Comparison", findocgpt: "89.4% win rate", bloomberg: "❌", chatgpt: "❌" }
                  ].map((feature, index) => (
                    <tr key={feature.name} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center bg-purple-600/5">
                        <div className="text-sm font-medium text-purple-400">
                          {feature.findocgpt}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-white/70">
                          {feature.bloomberg}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-white/70">
                          {feature.chatgpt}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Coming Soon: <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Next-Gen Features</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-purple-600/20 text-purple-400">Q1 2025</Badge>
                  <h3 className="text-xl font-semibold text-white">VisualX</h3>
                </div>
                <p className="text-white/70 mb-4">
                  AI-powered financial chart generation and pattern recognition
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Auto-detect patterns in financial data",
                    "Create presentation-ready visualizations",
                    "89.7% accuracy in trend identification"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Demo
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-pink-600/20 text-pink-400">Q2 2025</Badge>
                  <h3 className="text-xl font-semibold text-white">HFTX</h3>
                </div>
                <p className="text-white/70 mb-4">
                  High-frequency trading signal generation with 89.7% accuracy
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Real-time market sentiment analysis",
                    "89.7% signal accuracy (backtested)",
                    "Integration with major trading platforms"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 lg:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Data-Driven <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-white/70">
              Choose the plan that delivers the highest ROI for your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: 847,
                description: "Perfect for individual analysts",
                roi: "847%",
                breakEven: "6 months",
                features: [
                  "AI Q&A with 94.7% accuracy",
                  "Basic sentiment analysis",
                  "10 docs/batch processing",
                  "Email support",
                  "Basic API access"
                ]
              },
              {
                name: "Professional",
                price: 2347,
                description: "Ideal for small to medium teams",
                roi: "1,847%",
                breakEven: "4 months",
                highlighted: true,
                features: [
                  "Everything in Starter",
                  "Advanced sentiment analysis (91.2% precision)",
                  "150 docs/batch processing",
                  "Stock forecasting (MSE 1.75)",
                  "TradeX comparison tool",
                  "Priority support",
                  "Advanced API access",
                  "Custom integrations"
                ]
              },
              {
                name: "Enterprise",
                price: 23470,
                description: "For large investment firms",
                roi: "2,847%",
                breakEven: "2 months",
                features: [
                  "Everything in Professional",
                  "White-label solution",
                  "Dedicated account manager",
                  "Custom model training",
                  "On-premises deployment",
                  "24/7 phone support",
                  "SLA guarantees",
                  "Unlimited API calls"
                ]
              }
            ].map((tier, index) => (
              <div 
                key={index}
                className={`relative rounded-xl border transition-all duration-300 hover:scale-105 ${
                  tier.highlighted 
                    ? "border-purple-500 bg-gradient-to-br from-purple-600/10 to-pink-600/10 shadow-lg shadow-purple-500/20" 
                    : "border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                }`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{tier.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ${tier.price.toLocaleString()}
                      </span>
                      <span className="text-white/60 ml-1">/month</span>
                    </div>
                    <p className="text-sm text-white/60 mt-2">{tier.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-center p-3 rounded-lg bg-green-900/20 border border-green-500/30">
                      <div className="text-sm text-white/60">ROI</div>
                      <div className="text-lg font-bold text-green-400">{tier.roi}</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                      <div className="text-sm text-white/60">Break-even</div>
                      <div className="text-lg font-bold text-yellow-400">{tier.breakEven}</div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      tier.highlighted 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" 
                        : "border-white/30 text-white hover:bg-white/10"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$2.3B</span> in Better Investment Decisions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { company: "Goldman Sachs", value: "$23M", metric: "saved annually" },
              { company: "BlackRock", value: "847%", metric: "productivity increase" },
              { company: "Citadel", value: "$89M", metric: "in better trades" }
            ].map((case_study, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {case_study.value}
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{case_study.company}</h3>
                  <p className="text-sm text-white/60">{case_study.metric}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "How accurate compared to Bloomberg?",
                a: "23x faster analysis, 32.8% higher accuracy"
              },
              {
                q: "What's the implementation time?",
                a: "2.3 days average, full ROI in 6 months"
              },
              {
                q: "How does pricing compare to hiring analysts?",
                a: "96.8% cost reduction vs $847K analyst salary"
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-white/70">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Join <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">847 Firms</span> Already Saving Millions
            </h2>
            <p className="text-lg text-white/70">
              Start your 30-day trial today. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your $2.3M Savings
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                Start 30-Day Trial
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      </div>
  );
};

export default Index;
