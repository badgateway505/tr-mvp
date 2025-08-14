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
  onFieldHover,
}) => {
  const normalizedField = normalizeField(field);
  const isComboField = normalizedField.isCombo;

  // Check if this field should be highlighted due to hover sync
  const isHighlightedByHover =
    hoveredField &&
    fieldPairings &&
    // This field is hovered
    (hoveredField === field ||
      // This field matches the hovered field
      (fieldPairings.has(field) &&
        fieldPairings.get(field)?.includes(hoveredField)) ||
      // This field is matched by the hovered field (reverse lookup)
      Array.from(fieldPairings.entries()).some(
        ([key, matches]) => key === hoveredField && matches.includes(field)
      ));

  // Enhanced matching detection for better visual feedback
  const hasMatches = fieldPairings ? fieldPairings.has(field) : false;
  const matchCount = hasMatches ? fieldPairings!.get(field)?.length || 0 : 0;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Trigger hover effect on keyboard activation
      if (onFieldHover) {
        onFieldHover(field, true);
        // Auto-remove highlight after a short delay
        setTimeout(() => {
          onFieldHover(field, false);
        }, 2000);
      }
    }
  };

  const baseClasses = [
    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out',
    'cursor-default select-none field-pill-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ];

  if (isComboField) {
    baseClasses.push('field-combo text-blue-800 bg-blue-50 border border-blue-200 hover:scale-105 hover:bg-blue-100 hover:border-blue-300');
  } else {
    // Enhanced styling based on match status (task 10.3 requirement)
    if (isMatched && hasMatches) {
      // Matched field with visual confirmation
      baseClasses.push(
        'bg-green-50 border-2 border-green-300 text-green-800',
        'hover:border-green-400 hover:bg-green-100 hover:scale-105 hover:shadow-md'
      );
    } else if (isMatched && !hasMatches) {
      // Matched field but no actual matches found (edge case)
      baseClasses.push(
        'bg-yellow-50 border-2 border-yellow-300 text-yellow-800',
        'hover:border-yellow-400 hover:bg-yellow-100 hover:scale-105'
      );
    } else {
      // Unmatched field - default grey border (task 10.3 requirement)
      baseClasses.push(
        'bg-white border-2 border-gray-300 text-gray-700',
        'hover:border-gray-400 hover:bg-gray-50 hover:scale-105'
      );
    }
  }

  // Add special styling for fields that have matches
  if (hasMatches && matchCount > 0) {
    baseClasses.push('ring-2 ring-green-200 shadow-sm');
  }

  // Enhanced hover sync effects for better visual feedback
  if (isHighlightedByHover) {
    baseClasses.push(
      'scale-110 border-dashed border-2 border-blue-400 shadow-lg z-10',
      'ring-2 ring-blue-200'
    );
  }

  // Add pulse animation for matched fields on hover
  if (isHighlightedByHover && hasMatches) {
    baseClasses.push('animate-pulse');
  }

  // Generate accessible description
  const getAccessibleDescription = () => {
    let description = field;
    
    if (isComboField) {
      description += ' (combined field)';
    }
    
    if (isMatched && hasMatches) {
      description += ` - matched with ${matchCount} field${matchCount !== 1 ? 's' : ''} on the other side`;
    } else if (isMatched && !hasMatches) {
      description += ' - marked as matched but no actual matches found';
    } else {
      description += ' - no matches found on the other side';
    }
    
    return description;
  };

  const pillId = `field-pill-${field.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <span
      id={pillId}
      className={`${baseClasses.join(' ')} ${className}`}
      title={
        isComboField
          ? `Combined field: ${field}`
          : `${field}${isMatched ? ' (matched)' : ''}${hasMatches ? ` - ${matchCount} match${matchCount !== 1 ? 'es' : ''}` : ''}`
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={getAccessibleDescription()}
      aria-pressed={isHighlightedByHover ? "true" : "false"}
      aria-describedby={`${pillId}-status`}
      data-field-name={field}
      data-is-matched={isMatched}
      data-has-matches={hasMatches}
      data-match-count={matchCount}
      data-is-applicant-side={isApplicantSide}
      data-is-highlighted={isHighlightedByHover}
    >
      {field}
      {/* Enhanced visual indicators for task 10.3 */}
      {isMatched && hasMatches && (
        <span 
          className="ml-1 text-xs text-green-600 font-bold"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
      {isMatched && !hasMatches && (
        <span 
          className="ml-1 text-xs text-yellow-600 font-bold"
          aria-hidden="true"
        >
          ⚠
        </span>
      )}
      {!isMatched && (
        <span 
          className="ml-1 text-xs text-gray-500"
          aria-hidden="true"
        >
          ○
        </span>
      )}
      {/* Show match count for fields with multiple matches */}
      {hasMatches && matchCount > 1 && (
        <span 
          className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
          aria-hidden="true"
        >
          {matchCount}
        </span>
      )}
      
      {/* Hidden status text for screen readers */}
      <span 
        id={`${pillId}-status`}
        className="sr-only"
        aria-live="polite"
      >
        {getAccessibleDescription()}
      </span>
    </span>
  );
};
