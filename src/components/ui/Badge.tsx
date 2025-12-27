import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-dark-700 text-dark-300',
    primary: 'bg-primary-600/20 text-primary-400',
    secondary: 'bg-dark-700 text-dark-300',
    success: 'bg-green-600/20 text-green-400',
    warning: 'bg-yellow-600/20 text-yellow-400',
    danger: 'bg-red-600/20 text-red-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};
