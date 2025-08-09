import { Button } from './button';
import { Badge } from './badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  roi: string;
  breakEven: string;
}

interface PricingCardProps {
  tier: PricingTier;
  className?: string;
}

export function PricingCard({ tier, className }: PricingCardProps) {
  return (
    <div 
      className={cn(
        "relative rounded-xl border transition-all duration-300 hover:scale-105",
        tier.highlighted 
          ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-primary" 
          : "card-enterprise",
        className
      )}
    >
      {tier.highlighted && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}

      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold text-gradient-primary">
              ${tier.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground ml-1">/{tier.period}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="text-sm text-muted-foreground">ROI</div>
            <div className="text-lg font-bold text-secondary">{tier.roi}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-sm text-muted-foreground">Break-even</div>
            <div className="text-lg font-bold text-accent-foreground">{tier.breakEven}</div>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          className={cn(
            "w-full",
            tier.highlighted ? "btn-hero" : "btn-ghost"
          )}
        >
          {tier.price === 0 ? "Start Free Trial" : "Get Started"}
        </Button>
      </div>
    </div>
  );
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 847,
    period: "month",
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
    period: "month",
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
    period: "month",
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
];

export function PricingSection() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gradient-primary">
          Data-Driven Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that delivers the highest ROI for your team. 
          All plans include our 30-day money-back guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <PricingCard key={index} tier={tier} />
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>All prices in USD. Enterprise+ with VisualX and HFTX available Q1 2025.</p>
      </div>
    </div>
  );
}