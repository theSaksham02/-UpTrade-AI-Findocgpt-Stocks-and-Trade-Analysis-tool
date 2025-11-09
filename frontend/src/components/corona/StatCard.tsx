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
  gradient?: 'blue' | 'purple' | 'gold' | 'success' | 'danger';
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon: Icon,
  gradient = 'blue'
}: StatCardProps) {
  const gradientClasses = {
    blue: 'bg-gradient-blue',
    purple: 'bg-gradient-purple',
    gold: 'bg-gradient-gold',
    success: 'bg-status-success',
    danger: 'bg-status-danger'
  };

  const iconBgClasses = {
    blue: 'bg-accent-blue/20',
    purple: 'bg-accent-purple/20',
    gold: 'bg-accent-gold/20',
    success: 'bg-status-success/20',
    danger: 'bg-status-danger/20'
  };

  const iconColorClasses = {
    blue: 'text-accent-blue',
    purple: 'bg-accent-purple',
    gold: 'text-accent-gold',
    success: 'text-status-success',
    danger: 'text-status-danger'
  };

  return (
    <div className="card-premium group hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-text-muted font-medium text-sm mb-3">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gradient">{value}</p>
            {change && (
              <span className={`text-sm font-medium ${isPositive ? 'text-status-success' : 'text-status-danger'}`}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClasses[gradient]} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[gradient]}`} />
        </div>
      </div>
      <div className={`h-1.5 ${gradientClasses[gradient]} rounded-full shadow-glow`} />
    </div>
  );
}
