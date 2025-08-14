import React from 'react';
import { normalizeField } from '../logic/fieldNormalization';

interface FieldPillProps {
  field: string;
  isMatched?: boolean;
  onHover?: (field: string, isHovering: boolean) => void;
  className?: string;
  fieldPairings?: Map<string, string[]> | undefined;
  isApplicantSide?: boolean | undefined;
}

export const FieldPill: React.FC<FieldPillProps> = ({
  field,
  isMatched = false,
  onHover,
  className = '',
  fieldPairings,
  isApplicantSide
}) => {
  const normalizedField = normalizeField(field);
  const isComboField = normalizedField.isCombo;

  const handleMouseEnter = () => {
    onHover?.(field, true);
    
    // Highlight matching fields on the other side
    if (fieldPairings && fieldPairings.has(field)) {
      // This will be handled by the parent component through CSS classes
      // We could also emit a custom event here if needed
    }
  };

  const handleMouseLeave = () => {
    onHover?.(field, false);
  };

  const baseClasses = [
    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out',
    'cursor-default select-none field-pill-hover'
  ];

  if (isComboField) {
    baseClasses.push(
      'field-combo text-blue-800'
    );
  } else {
    baseClasses.push(
      'bg-white border text-gray-700',
      isMatched 
        ? 'field-matched' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    );
  }

  // Add hover effects for matched fields
  if (isMatched) {
    baseClasses.push('hover:scale-105 hover:border-dashed');
  } else {
    baseClasses.push('hover:scale-105');
  }

  // Add special styling for fields that have matches
  if (isMatched && fieldPairings) {
    const matchCount = fieldPairings.get(field)?.length || 0;
    if (matchCount > 0) {
      baseClasses.push('ring-1 ring-green-200');
    }
  }

  return (
    <span
      className={`${baseClasses.join(' ')} ${className}`}
      title={isComboField ? `Combined field: ${field}` : `${field}${isMatched ? ' (matched)' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-field-name={field}
      data-is-matched={isMatched}
      data-is-applicant-side={isApplicantSide}
    >
      {field}
      {isMatched && fieldPairings && (
        <span className="ml-1 text-xs text-green-600">
          ✓
        </span>
      )}
    </span>
  );
};
