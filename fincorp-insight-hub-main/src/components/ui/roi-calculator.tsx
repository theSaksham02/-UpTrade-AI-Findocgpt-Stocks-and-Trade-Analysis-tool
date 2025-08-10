import { useState, useEffect, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Counter } from './counter';

interface ROIResult {
  currentCost: number;
  findocgptCost: number;
  savings: number;
  roi: number;
  breakEvenMonths: number;
}

export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(32);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [result, setResult] = useState<ROIResult | null>(null);

  const calculateROI = useCallback(() => {
    const annualHours = hoursPerWeek * 52;
    const currentCost = teamSize * annualHours * hourlyRate;
    const findocgptCost = teamSize * 2347 * 12; // Professional plan
    const savings = currentCost * 0.968 - findocgptCost; // 96.8% efficiency gain
    const roi = (savings / findocgptCost) * 100;
    const breakEvenMonths = Math.ceil(findocgptCost / (savings / 12));

    setResult({
      currentCost,
      findocgptCost,
      savings,
      roi,
      breakEvenMonths
    });
  }, [teamSize, hoursPerWeek, hourlyRate]);

  useEffect(() => {
    calculateROI();
  }, [calculateROI]);

  return (
    <div className="space-y-6">
      <Card className="card-enterprise">
        <CardHeader>
          <CardTitle className="text-gradient-primary">
            Calculate Your $2.3M Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                min="1"
                max="100"
                className="bg-muted/30 border-border focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">Hours/Week per Analyst</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                min="1"
                max="80"
                className="bg-muted/30 border-border focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="50"
                max="500"
                className="bg-muted/30 border-border focus:border-primary"
              />
            </div>
          </div>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border">
              <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-2xl font-bold text-destructive mb-1">
                  <Counter end={result.currentCost} prefix="$" className="text-destructive" />
                </div>
                <div className="text-sm text-muted-foreground">Current Annual Cost</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary mb-1">
                  <Counter end={result.findocgptCost} prefix="$" className="text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">FinDocGPT Cost</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="text-2xl font-bold text-secondary mb-1">
                  <Counter end={result.savings} prefix="$" className="text-secondary" />
                </div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-2xl font-bold text-accent-foreground mb-1">
                  <Counter end={result.roi} suffix="%" className="text-accent-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">ROI</div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="btn-hero flex-1">
              Start 30-Day Trial
            </Button>
            <Button variant="outline" className="btn-ghost flex-1">
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}