/**
 * PremiumBanner Component - Corona Style
 * Eye-catching gradient banner for announcements and promotions
 */
import { X } from 'lucide-react';
import { useState } from 'react';

interface PremiumBannerProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  onClose?: () => void;
  dismissible?: boolean;
}

export default function PremiumBanner({ 
  title, 
  description, 
  buttonText = "Get Started",
  buttonHref = "#",
  onClose,
  dismissible = true 
}: PremiumBannerProps) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="card-premium bg-gradient-to-r from-accent-purple/20 via-accent-blue/20 to-accent-pink/20 border border-accent-purple/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-cyber opacity-5 animate-gradient" />
      
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6 flex-1">
          <div className="hidden sm:block w-20 h-20 rounded-xl bg-gradient-blue flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-3xl">✨</span>
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gradient mb-1">{title}</h4>
            {description && (
              <p className="text-sm text-text-secondary">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={buttonHref}
            className="btn-gradient px-6 py-2 text-sm font-semibold rounded-lg hover:scale-105 transition-transform shadow-glow"
          >
            {buttonText}
          </a>
          
          {dismissible && (
            <button 
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center text-text-muted hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
