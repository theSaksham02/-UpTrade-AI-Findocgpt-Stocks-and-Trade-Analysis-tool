import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  findocgpt: boolean | string;
  bloomberg: boolean | string;
  chatgpt: boolean | string;
}

const features: Feature[] = [
  {
    name: "Financial Q&A Accuracy",
    findocgpt: "94.7%",
    bloomberg: "71.3%",
    chatgpt: "11.2%"
  },
  {
    name: "Response Time",
    findocgpt: "2.1 seconds",
    bloomberg: "8.4 seconds",
    chatgpt: "3.2 seconds"
  },
  {
    name: "Sentiment Analysis",
    findocgpt: "91.2% precision",
    bloomberg: "67.8% precision",
    chatgpt: false
  },
  {
    name: "Batch Processing",
    findocgpt: "150 docs/batch",
    bloomberg: "10 docs/batch",
    chatgpt: "1 doc at a time"
  },
  {
    name: "Stock Forecasting",
    findocgpt: "MSE 1.75",
    bloomberg: "MSE 3.21",
    chatgpt: false
  },
  {
    name: "TradeX Comparison",
    findocgpt: "89.4% win rate",
    bloomberg: false,
    chatgpt: false
  },
  {
    name: "Real-time Updates",
    findocgpt: true,
    bloomberg: true,
    chatgpt: false
  },
  {
    name: "API Integration",
    findocgpt: true,
    bloomberg: "Limited",
    chatgpt: "Basic"
  }
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-secondary" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground" />
    );
  }
  return <span className="text-sm font-medium">{value}</span>;
}

export function FeatureComparison() {
  return (
    <div className="card-enterprise overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xl font-semibold text-gradient-primary">
          Platform Comparison
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          See why 847,000+ analysts choose FinDocGPT
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Feature
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium bg-primary/5">
                <div className="text-gradient-primary font-semibold">FinDocGPT</div>
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">
                Bloomberg Terminal
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">
                ChatGPT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {features.map((feature, index) => (
              <tr 
                key={feature.name}
                className={cn(
                  "hover:bg-muted/20 transition-colors duration-200",
                  index % 2 === 0 ? "bg-muted/5" : ""
                )}
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {feature.name}
                </td>
                <td className="px-6 py-4 text-center bg-primary/5">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.findocgpt} />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.bloomberg} />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.chatgpt} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}