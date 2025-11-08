import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = '', ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={`px-3 py-2 rounded-lg border border-border/30 bg-primary-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple ${className}`}
    />
  );
});

Input.displayName = 'Input';

export default Input;
