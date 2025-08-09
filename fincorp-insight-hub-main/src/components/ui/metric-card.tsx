import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Counter } from './counter';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function MetricCard({
  title,
  value,
  prefix = '',
  suffix = '',
  description,
  icon,
  trend = 'neutral',
  trendValue,
  className,
  variant = 'default'
}: MetricCardProps) {
  const variantStyles = {
    default: 'card-metric',
    primary: 'card-metric border-primary/30 hover:border-primary/50',
    secondary: 'card-metric border-secondary/30 hover:border-secondary/50',
    accent: 'card-metric border-accent/30 hover:border-accent/50'
  };

  const trendStyles = {
    up: 'text-secondary',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={cn(variantStyles[variant], 'group', className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="text-primary group-hover:text-primary-glow transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight">
          <Counter 
            end={value}
            prefix={prefix}
            suffix={suffix}
            className="text-foreground"
          />
        </div>
        
        {trendValue && (
          <div className={cn("text-xs font-medium flex items-center gap-1", trendStyles[trend])}>
            {trend === 'up' && '↗'}
            {trend === 'down' && '↘'}
            {trend === 'neutral' && '→'}
            {trendValue}
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}