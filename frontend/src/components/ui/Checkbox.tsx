import React from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onCheckedChange?: (...args: any[]) => void;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onCheckedChange, className = '', ...rest }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) onCheckedChange(e.target.checked);
    if (rest.onChange) rest.onChange(e);
  };

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={`w-4 h-4 rounded-sm border border-border/30 bg-primary-surface ${className}`}
    />
  );
};

export default Checkbox;
