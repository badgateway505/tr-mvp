import React from 'react';
import { normalizeField } from '../logic/fieldNormalization';

interface FieldPillProps {
  field: string;
  isMatched?: boolean;
  onHover?: (field: string, isHovering: boolean) => void;
  className?: string;
  fieldPairings?: Map<string, string[]> | undefined;
  isApplicantSide?: boolean | undefined;
  hoveredField?: string | null | undefined;
  onFieldHover?: ((field: string, isHovering: boolean) => void) | undefined;
}

export const FieldPill: React.FC<FieldPillProps> = ({
  field,
  isMatched = false,
  onHover,
  className = '',
  fieldPairings,
  isApplicantSide,
  hoveredField,
  onFieldHover
}) => {
  const normalizedField = normalizeField(field);
  const isComboField = normalizedField.isCombo;

  // Check if this field should be highlighted due to hover sync
  const isHighlightedByHover = hoveredField && fieldPairings && (
    // This field is hovered
    hoveredField === field ||
    // This field matches the hovered field
    fieldPairings.has(field) && fieldPairings.get(field)?.includes(hoveredField) ||
    // This field is matched by the hovered field (reverse lookup)
    Array.from(fieldPairings.entries()).some(([key, matches]) => 
      key === hoveredField && matches.includes(field)
    )
  );

  const handleMouseEnter = () => {
    // Use onFieldHover if available, otherwise fall back to onHover
    if (onFieldHover) {
      onFieldHover(field, true);
    } else if (onHover) {
      onHover(field, true);
    }
  };

  const handleMouseLeave = () => {
    // Use onFieldHover if available, otherwise fall back to onHover
    if (onFieldHover) {
      onFieldHover(field, false);
    } else if (onHover) {
      onHover(field, false);
    }
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

  // Add hover sync effects
  if (isHighlightedByHover) {
    baseClasses.push('scale-105 border-dashed border-2 border-blue-400 shadow-lg');
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
      data-is-highlighted={isHighlightedByHover}
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
