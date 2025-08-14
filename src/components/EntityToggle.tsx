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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, entityType: EntityType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && entityType === 'individual') {
        onChange(entityType);
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
        aria-describedby="entity-description"
      >
        <button
          type="button"
          onClick={() => onChange('individual')}
          onKeyDown={(e) => handleKeyDown(e, 'individual')}
          disabled={disabled}
          aria-pressed={value === 'individual'}
          aria-label="Individual entity type"
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     ${value === 'individual'
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
            aria-label="Company entity type (coming soon)"
            aria-describedby="company-tooltip"
            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-50
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Company
          </button>
          <div 
            id="company-tooltip"
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            role="tooltip"
            aria-hidden="true"
          >
            Coming soon
          </div>
        </div>
      </div>
      <div 
        id="entity-description"
        className="mt-2 text-xs text-gray-500"
        aria-live="polite"
      >
        Currently supporting individual entities only
      </div>
    </div>
  );
};
