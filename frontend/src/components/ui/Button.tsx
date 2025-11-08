import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'default', size = 'md', className = '', children, ...rest }) => {
  const sizeClasses = size === 'icon' ? 'w-8 h-8 p-0 inline-flex items-center justify-center' : 'px-3 py-2';
  const variantClasses = variant === 'ghost' ? 'bg-transparent hover:bg-primary-hover' : 'bg-gradient-purple text-white';

  return (
    <button {...rest} className={`${sizeClasses} ${variantClasses} rounded-lg ${className}`}>{children}</button>
  );
};

export default Button;
