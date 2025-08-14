import React from 'react';
import type { EntityType } from '../logic/useAppState';

interface EntityToggleProps {
  value: EntityType;
  onChange: (entityType: EntityType) => void;
  disabled?: boolean;
  label?: string;
}

export const EntityToggle: React.FC<EntityToggleProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Entity Type',
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
          onClick={() => onChange('individual')}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${
            value === 'individual'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Individual
        </button>
        <div className="relative">
          <button
            type="button"
            disabled={true}
            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
          >
            Company
          </button>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Coming soon
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Currently supporting individual entities only
      </div>
    </div>
  );
};
