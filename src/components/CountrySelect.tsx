import React from 'react';
import type { CountryCode } from '../types/requirements';

interface CountrySelectProps {
  value: string;
  onChange: (country: CountryCode) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

// Country data with flags, names, and codes
const countries = [
  { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
  { code: 'ZAF', name: 'South Africa', flag: '🇿🇦' },
  // Add more countries as needed
];

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a country',
  label,
  disabled = false,
}) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-gray-800">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as CountryCode)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     transition-all duration-200 ease-out
                     hover:border-gray-400 hover:shadow-md
                     focus:shadow-lg focus:scale-[1.02]
                     disabled:hover:border-gray-300 disabled:hover:shadow-sm"
        >
          <option value="">{placeholder}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name} ({country.code})
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow with hover effect */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
