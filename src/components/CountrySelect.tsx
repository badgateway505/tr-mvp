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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CountryCode)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name} ({country.code})
          </option>
        ))}
      </select>
    </div>
  );
};
