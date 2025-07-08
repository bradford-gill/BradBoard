import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const textareaClasses = `
    block w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-800 disabled:text-gray-500 resize-vertical
    bg-gray-800 text-white placeholder-gray-400
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
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};