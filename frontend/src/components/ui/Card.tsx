/**
 * Enhanced Card Components - Corona Inspired
 * Building blocks for creating premium dashboard layouts.
 */
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
  hoverEffect?: 'scale' | 'glow' | 'none';
}

/**
 * Main premium card container.
 * Use this as the base for all content blocks.
 */
export function Card({ children, className = '', padding = 'default', hoverEffect = 'scale' }: CardProps) {
  const paddingClass = padding === 'default' ? 'p-6' : '';
  const hoverClass = {
    scale: 'hover:scale-105 transition-transform duration-300',
    glow: 'hover:shadow-glow transition-shadow duration-300',
    none: '',
  }[hoverEffect];

  return (
    <div className={`card-premium ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

/**
 * StatCard for displaying key metrics with an icon and trend indicator.
 */
export function StatCard({ title, value, change, isPositive, icon: Icon }: StatCardProps) {
  return (
    <Card hoverEffect="scale">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-text-muted font-medium mb-3">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gradient">{value}</p>
            <span className={`text-sm font-medium ${isPositive ? 'text-status-success' : 'text-status-danger'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isPositive ? 'bg-status-success/20' : 'bg-status-danger/20'
        }`}>
          <Icon className={`w-6 h-6 ${isPositive ? 'text-status-success' : 'text-status-danger'}`} />
        </div>
      </div>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'blue' | 'purple' | 'gold';
}

/**
 * QuickActionCard for navigation links within the dashboard.
 */
export function QuickActionCard({ title, description, icon: Icon, href, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: {
      border: 'hover:border-accent-blue/50',
      bg: 'bg-gradient-to-br from-primary-surface/80 to-accent-blue/5',
      gradient: 'bg-gradient-blue',
      icon: 'text-accent-blue',
      text: 'group-hover:text-gradient'
    },
    purple: {
      border: 'hover:border-accent-purple/50',
      bg: 'bg-gradient-to-br from-primary-surface/80 to-accent-purple/5',
      gradient: 'bg-gradient-purple',
      icon: 'text-accent-purple',
      text: 'group-hover:text-gradient'
    },
    gold: {
      border: 'hover:border-accent-gold/50',
      bg: 'bg-gradient-to-br from-primary-surface/80 to-accent-gold/5',
      gradient: 'bg-gradient-gold',
      icon: 'text-accent-gold',
      text: 'group-hover:text-gradient-gold'
    },
  };

  const selectedColor = colorClasses[color];

  return (
    <a href={href} className={`group relative p-6 border-2 border-border/50 rounded-xl transition-all duration-300 hover:shadow-premium hover:scale-105 overflow-hidden ${selectedColor.border} ${selectedColor.bg}`}>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${selectedColor.gradient}`} />
      <Icon className={`w-8 h-8 mb-3 group-hover:scale-110 transition-transform ${selectedColor.icon}`} />
      <h3 className={`font-semibold text-text-primary mb-2 transition-all ${selectedColor.text}`}>{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </a>
  );
}
