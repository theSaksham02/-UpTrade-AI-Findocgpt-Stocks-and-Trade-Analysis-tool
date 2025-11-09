/**
 * PreviewItem Component - Corona Style
 * Activity/message preview card with icon, title, description, and timestamp
 */
import { LucideIcon } from 'lucide-react';
import { Clock } from 'lucide-react';

interface PreviewItemProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  time: string;
  onClick?: () => void;
}

export default function PreviewItem({ 
  icon: Icon, 
  iconColor = 'text-accent-blue',
  title, 
  description, 
  time,
  onClick 
}: PreviewItemProps) {
  return (
    <div 
      className="flex items-start gap-4 p-4 bg-primary-surface rounded-xl border border-border/30 hover:border-accent-purple/50 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-lg bg-primary-hover flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary group-hover:text-gradient transition-colors">
          {title}
        </p>
        <p className="text-sm text-text-muted mt-0.5">{description}</p>
      </div>
      <span className="text-xs text-text-muted whitespace-nowrap flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {time}
      </span>
    </div>
  );
}
