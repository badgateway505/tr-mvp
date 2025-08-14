import React from 'react';
import { normalizeField } from '../logic/fieldNormalization';

interface FieldPillProps {
  field: string;
  isMatched?: boolean;
  onHover?: (field: string, isHovering: boolean) => void;
  className?: string;
}

export const FieldPill: React.FC<FieldPillProps> = ({
  field,
  isMatched = false,
  onHover,
  className = ''
}) => {
  const normalizedField = normalizeField(field);
  const isComboField = normalizedField.isCombo;

  const handleMouseEnter = () => {
    onHover?.(field, true);
  };

  const handleMouseLeave = () => {
    onHover?.(field, false);
  };

  const baseClasses = [
    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out',
    'cursor-default select-none'
  ];

  if (isComboField) {
    baseClasses.push(
      'bg-gradient-to-r from-blue-50 to-indigo-50',
      'border-2 border-blue-200 text-blue-800',
      'hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100'
    );
  } else {
    baseClasses.push(
      'bg-white border text-gray-700',
      isMatched 
        ? 'border-green-300 hover:border-green-400 hover:bg-green-50' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    );
  }

  // Add hover effects for matched fields
  if (isMatched) {
    baseClasses.push('hover:scale-105 hover:border-dashed');
  } else {
    baseClasses.push('hover:scale-105');
  }

  return (
    <span
      className={`${baseClasses.join(' ')} ${className}`}
      title={isComboField ? `Combined field: ${field}` : field}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {field}
    </span>
  );
};
