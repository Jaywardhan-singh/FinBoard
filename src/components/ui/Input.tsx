import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-300 dark:text-dark-300 text-gray-700 mb-2 transition-colors">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 bg-dark-900 dark:bg-dark-900 bg-gray-50 border ${
          error ? 'border-red-500' : 'border-dark-700 dark:border-dark-700 border-gray-300'
        } rounded-lg text-white dark:text-white text-gray-900 placeholder-dark-500 dark:placeholder-dark-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
