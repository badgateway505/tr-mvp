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
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => onChange('OUT')}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${
            value === 'OUT'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          OUT
        </button>
        <button
          type="button"
          onClick={() => onChange('IN')}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${
            value === 'IN'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          IN
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {value === 'OUT' ? 'Outgoing transfer' : 'Incoming transfer'}
      </div>
    </div>
  );
};
