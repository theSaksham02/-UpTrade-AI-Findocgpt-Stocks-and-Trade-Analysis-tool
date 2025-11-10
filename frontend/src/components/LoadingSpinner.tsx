/**
 * Loading Spinner Component
 * Used across the app for loading states
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-accent-purple border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-white/70 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0D0219]/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Error Alert Component
 */
interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorAlert({ error, onRetry, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-status-danger/10 border border-status-danger/30 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-status-danger mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-white font-semibold mb-1">Error</h4>
            <p className="text-white/70 text-sm">{error}</p>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-accent-purple hover:brightness-110 text-white text-sm font-semibold rounded-lg transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Empty State Component
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-white/40">{icon}</div>}
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-white/60 text-sm mb-4 max-w-md">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-accent-purple hover:brightness-110 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default LoadingSpinner;
