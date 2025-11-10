/**
 * StatCard Component - Corona Style
 * Premium stat card with icon, value, and trend indicator
 */
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  gradient?: 'purple' | 'gold' | 'success' | 'danger';
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon: Icon,
  gradient = 'purple'
}: StatCardProps) {
  const gradientClasses = {
    purple: 'bg-gradient-purple',
    gold: 'bg-accent-gold',
    success: 'bg-status-success',
    danger: 'bg-status-danger'
  };

  const iconBgClasses = {
    purple: 'bg-accent-purple/20',
    gold: 'bg-accent-gold/20',
    success: 'bg-status-success/20',
    danger: 'bg-status-danger/20'
  };

  const iconColorClasses = {
    purple: 'text-accent-purple',
    gold: 'text-accent-gold',
    success: 'text-status-success',
    danger: 'text-status-danger'
  };

  return (
    <div className="card-premium group transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-text-muted font-medium text-sm mb-3">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-accent-purple">{value}</p>
            {change && (
              <span className={`text-sm font-medium ${isPositive ? 'text-status-success' : 'text-status-danger'}`}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClasses[gradient]} transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[gradient]}`} />
        </div>
      </div>
      <div className={`h-1.5 ${gradientClasses[gradient]} rounded-full`} />
    </div>
  );
}
