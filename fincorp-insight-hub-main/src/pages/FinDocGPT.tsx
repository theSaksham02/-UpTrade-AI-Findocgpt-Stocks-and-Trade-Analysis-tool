import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/ui/metric-card';
import { Counter } from '@/components/ui/counter';
import { ROICalculator } from '@/components/ui/roi-calculator';
import { FeatureComparison } from '@/components/ui/feature-comparison';
import { PricingSection } from '@/components/ui/pricing-card';
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
  Star
} from 'lucide-react';

export default function FinDocGPT() {
  const [showROICalculator, setShowROICalculator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-primary/20 animate-pulse-glow">
              Trusted by firms managing $847B in assets
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              Stop Losing{' '}
              <span className="text-gradient-primary">$2.3M Annually</span>
              {' '}on Manual Financial Analysis
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              <Counter end={847} suffix="K" className="text-primary" />+ analysts trust AI to deliver{' '}
              <Counter end={94.7} suffix="%" className="text-secondary" /> accurate insights in{' '}
              <Counter end={2.1} suffix=" seconds" className="text-accent" />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-hero text-lg px-8 py-6"
                onClick={() => setShowROICalculator(true)}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your ROI
              </Button>
              <Button size="lg" variant="outline" className="btn-ghost text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <MetricCard
                title="Accuracy"
                value={94.7}
                suffix="%"
                icon={<Target className="h-5 w-5" />}
                variant="primary"
              />
              <MetricCard
                title="Response Time"
                value={2.1}
                suffix="s"
                icon={<Clock className="h-5 w-5" />}
                variant="secondary"
              />
              <MetricCard
                title="Cost Reduction"
                value={96.8}
                suffix="%"
                icon={<DollarSign className="h-5 w-5" />}
                variant="accent"
              />
              <MetricCard
                title="ROI"
                value={2847}
                suffix="%"
                icon={<TrendingUp className="h-5 w-5" />}
                variant="primary"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold">
              The <span className="text-gradient-primary">$847M Cost</span> of Manual Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-metric border-destructive/20 hover:border-destructive/40">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">
                    <Counter end={32} suffix=" hours" />
                  </div>
                  <p className="text-sm text-muted-foreground">wasted per analyst weekly</p>
                </CardContent>
              </Card>
              
              <Card className="card-metric border-destructive/20 hover:border-destructive/40">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">
                    <Counter end={23} suffix="%" />
                  </div>
                  <p className="text-sm text-muted-foreground">error rate in document extraction</p>
                </CardContent>
              </Card>
              
              <Card className="card-metric border-destructive/20 hover:border-destructive/40">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">
                    <Counter end={2.3} prefix="$" suffix="M" />
                  </div>
                  <p className="text-sm text-muted-foreground">annual cost per analyst team</p>
                </CardContent>
              </Card>
              
              <Card className="card-metric border-destructive/20 hover:border-destructive/40">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">
                    <Counter end={67} suffix="%" />
                  </div>
                  <p className="text-sm text-muted-foreground">of critical insights missed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-gradient-primary">$47.3B Market</span>, $3.2B Opportunity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Market"
                value={47.3}
                prefix="$"
                suffix="B"
                description="Financial Analytics Software"
                icon={<BarChart3 className="h-5 w-5" />}
                variant="primary"
              />
              <MetricCard
                title="Target Segment"
                value={3.2}
                prefix="$"
                suffix="B"
                description="Document analysis & sentiment"
                icon={<Target className="h-5 w-5" />}
                variant="secondary"
              />
              <MetricCard
                title="Professionals"
                value={847}
                suffix="K"
                description="Investment analysts globally"
                icon={<Users className="h-5 w-5" />}
                variant="accent"
              />
              <MetricCard
                title="Revenue Potential"
                value={89.4}
                prefix="$"
                suffix="M"
                description="Annual recurring revenue"
                icon={<TrendingUp className="h-5 w-5" />}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold">
              FinDocGPT: <span className="text-gradient-primary">2,847% ROI</span> in 18 Months
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">AI Q&A Engine</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className="font-bold text-primary">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response</span>
                    <span className="font-bold text-secondary">2.1s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold">Sentiment Analysis</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Batch Size</span>
                    <span className="font-bold text-primary">150 docs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Precision</span>
                    <span className="font-bold text-secondary">91.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Stock Forecasting</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">MSE</span>
                    <span className="font-bold text-primary">1.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Horizon</span>
                    <span className="font-bold text-secondary">30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">TradeX Comparison</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="font-bold text-primary">89.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market</span>
                    <span className="font-bold text-accent">Unique</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <FeatureComparison />
        </div>
      </section>

      {/* ROI Calculator */}
      {showROICalculator && (
        <section className="py-16 lg:py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <ROICalculator />
          </div>
        </section>
      )}

      {/* Coming Soon Features */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold">
              Coming Soon: <span className="text-gradient-primary">Next-Gen Features</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-enterprise">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/10 text-primary">Q1 2025</Badge>
                  <h3 className="text-xl font-semibold">VisualX</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  AI-powered financial chart generation and pattern recognition
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Auto-detect patterns in financial data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Create presentation-ready visualizations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">89.7% accuracy in trend identification</span>
                  </li>
                </ul>
                <Button variant="outline" className="btn-ghost">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Demo
                </Button>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-secondary/10 text-secondary">Q2 2025</Badge>
                  <h3 className="text-xl font-semibold">HFTX</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  High-frequency trading signal generation with 89.7% accuracy
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Real-time market sentiment analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">89.7% signal accuracy (backtested)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Integration with major trading platforms</span>
                  </li>
                </ul>
                <Button variant="outline" className="btn-ghost">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <PricingSection />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-gradient-primary">$2.3B</span> in Better Investment Decisions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-enterprise">
              <CardContent className="p-8 text-center">
                <div className="text-3xl font-bold text-gradient-primary mb-2">
                  <Counter end={23} prefix="$" suffix="M" />
                </div>
                <h3 className="font-semibold mb-2">Goldman Sachs</h3>
                <p className="text-sm text-muted-foreground">Annual savings through automated analysis</p>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-8 text-center">
                <div className="text-3xl font-bold text-gradient-secondary mb-2">
                  <Counter end={847} suffix="%" />
                </div>
                <h3 className="font-semibold mb-2">BlackRock</h3>
                <p className="text-sm text-muted-foreground">Productivity increase in research teams</p>
              </CardContent>
            </Card>
            
            <Card className="card-enterprise">
              <CardContent className="p-8 text-center">
                <div className="text-3xl font-bold text-gradient-accent mb-2">
                  <Counter end={89} prefix="$" suffix="M" />
                </div>
                <h3 className="font-semibold mb-2">Citadel</h3>
                <p className="text-sm text-muted-foreground">Better trades through AI insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold">
              Join <span className="text-gradient-primary">847 Firms</span> Already Saving Millions
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your 30-day trial today. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-hero text-lg px-8 py-6">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your $2.3M Savings
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-6">
                Start 30-Day Trial
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
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
}