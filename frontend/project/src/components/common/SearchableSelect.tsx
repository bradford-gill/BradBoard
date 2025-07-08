import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
            focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
            bg-gray-800 cursor-pointer border-gray-600 hover:border-gray-500
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            {isOpen ? (
              <div className="flex items-center flex-1">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-white placeholder-gray-400"
                  placeholder="Search..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <span className={`block truncate ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}
            
            <div className="flex items-center space-x-1">
              {selectedOption && selectedOption.value && (
                <button
                  onClick={clearSelection}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  tabIndex={-1}
                >
                  <X className="h-3 w-3 text-gray-500 hover:text-gray-300" />
                </button>
              )}
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer text-sm transition-all duration-150
                    ${index === highlightedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    ${option.value === value ? 'bg-blue-700 text-white font-medium' : ''}
                  `}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};