import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  const selectClasses = `
    block w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-800 disabled:text-gray-500
    appearance-none bg-gray-800 text-white pr-8
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 hover:border-gray-500'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={selectClasses} {...props}>
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};