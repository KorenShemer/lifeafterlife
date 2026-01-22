'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchInput({ 
  placeholder = 'Search...', 
  onSearch,
  className = '' 
}: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}