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
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    direction: Direction
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(direction);
      }
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div
        className="flex items-center space-x-3"
        // role="radiogroup"
        // aria-labelledby={label ? `${label.toLowerCase()}-label` : undefined}
        // aria-describedby="direction-description"
      >
        <button
          type="button"
          onClick={() => onChange('OUT')}
          onKeyDown={(e) => handleKeyDown(e, 'OUT')}
          disabled={disabled}
          // aria-pressed={value === 'OUT'}
          // aria-label="Outgoing transfer direction"
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-sumsub-500 focus:ring-offset-2
                     ${
                       value === 'OUT'
                         ? 'bg-sumsub-600 text-white shadow-medium hover:shadow-strong'
                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-soft'
                     } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-lift'}`}
        >
          OUT
        </button>
        <button
          type="button"
          onClick={() => onChange('IN')}
          onKeyDown={(e) => handleKeyDown(e, 'IN')}
          disabled={disabled}
          // aria-pressed={value === 'IN'}
          // aria-label="Incoming transfer direction"
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-sumsub-500 focus:ring-offset-2
                     ${
                       value === 'IN'
                         ? 'bg-sumsub-600 text-white shadow-white shadow-medium hover:shadow-strong'
                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-soft'
                     } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-lift'}`}
        >
          IN
        </button>
      </div>
      <div
        // id="direction-description"
        className="mt-3 text-sm text-gray-600 animate-slide-up"
        // aria-live="polite"
      >
        {value === 'OUT' ? 'Outgoing transfer' : 'Incoming transfer'}
      </div>
    </div>
  );
};
