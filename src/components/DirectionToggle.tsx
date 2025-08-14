import React from 'react';
import type { Direction } from '../logic/useAppState';

interface DirectionToggleProps {
  value: Direction;
  onChange: (direction: Direction) => void;
  disabled?: boolean;
  label?: string;
}

export const DirectionToggle: React.FC<DirectionToggleProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Direction',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, direction: Direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(direction);
      }
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div 
        className="flex items-center space-x-4"
        role="radiogroup"
        aria-labelledby={label ? `${label.toLowerCase()}-label` : undefined}
        aria-describedby="direction-description"
      >
        <button
          type="button"
          onClick={() => onChange('OUT')}
          onKeyDown={(e) => handleKeyDown(e, 'OUT')}
          disabled={disabled}
          aria-pressed={value === 'OUT'}
          aria-label="Outgoing transfer direction"
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     ${value === 'OUT'
                       ? 'bg-blue-600 text-white shadow-md'
                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                     } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          OUT
        </button>
        <button
          type="button"
          onClick={() => onChange('IN')}
          onKeyDown={(e) => handleKeyDown(e, 'IN')}
          disabled={disabled}
          aria-pressed={value === 'IN'}
          aria-label="Incoming transfer direction"
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     ${value === 'IN'
                       ? 'bg-blue-600 text-white shadow-md'
                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                     } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          IN
        </button>
      </div>
      <div 
        id="direction-description"
        className="mt-2 text-xs text-gray-500"
        aria-live="polite"
      >
        {value === 'OUT' ? 'Outgoing transfer' : 'Incoming transfer'}
      </div>
    </div>
  );
};
