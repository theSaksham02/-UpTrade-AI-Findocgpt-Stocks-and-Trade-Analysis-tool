/**
 * Preview Item Component - Corona Inspired
 * Used for creating lists of activities, messages, or notifications.
 */
import { ReactNode } from 'react';

interface PreviewItemProps {
  icon: React.ElementType;
  iconColor?: string;
  title: string;
  description: string;
  meta?: string;
  children?: ReactNode;
}

export function PreviewItem({ icon: Icon, iconColor = 'text-text-muted', title, description, meta, children }: PreviewItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-primary-surface rounded-xl border border-border/30 hover:border-accent-purple/50 transition-all group">
      <div className="w-10 h-10 rounded-lg bg-primary-hover flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary group-hover:text-gradient transition-colors">{title}</p>
        <p className="text-sm text-text-muted mt-0.5 truncate">{description}</p>
        {children}
      </div>
      {meta && (
        <span className="text-xs text-text-muted whitespace-nowrap pt-1">
          {meta}
        </span>
      )}
    </div>
  );
}
