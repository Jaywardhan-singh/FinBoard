import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
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
      <select
        className={`w-full px-4 py-2 bg-dark-900 dark:bg-dark-900 bg-gray-50 border ${
          error ? 'border-red-500' : 'border-dark-700 dark:border-dark-700 border-gray-300'
        } rounded-lg text-white dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
