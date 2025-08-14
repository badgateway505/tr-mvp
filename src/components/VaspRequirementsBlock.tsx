import React from 'react';
import type { ExtractedRequirements } from '../logic/requirementExtractor';
import { FieldPill } from './FieldPill';
import { VerificationFlags } from './VerificationFlags';

interface VaspRequirementsBlockProps {
  roleLabel: string;
  colorTheme: 'blue' | 'purple';
  requirements: ExtractedRequirements;
}

// Separate component for rendering requirement groups with enhanced styling
const RequirementGroup: React.FC<{
  group: { logic: 'AND' | 'OR'; fields: string[] };
  colorTheme: 'blue' | 'purple';
}> = ({ group, colorTheme }) => {
  const themeColors = {
    blue: {
      logicBg: group.logic === 'AND' ? 'bg-green-100' : 'bg-orange-100',
      logicText: group.logic === 'AND' ? 'text-green-800' : 'text-orange-800',
      logicBorder: group.logic === 'AND' ? 'border-green-200' : 'border-orange-200',
      groupBg: 'bg-white',
      groupBorder: 'border-gray-200'
    },
    purple: {
      logicBg: group.logic === 'AND' ? 'bg-green-100' : 'bg-orange-100',
      logicText: group.logic === 'AND' ? 'text-green-800' : 'text-orange-800',
      logicBorder: group.logic === 'AND' ? 'border-green-200' : 'border-orange-200',
      groupBg: 'bg-white',
      groupBorder: 'border-gray-200'
    }
  };

  const colors = themeColors[colorTheme];

  return (
    <div className={`${colors.groupBg} border ${colors.groupBorder} rounded-lg p-4 shadow-sm`}>
      {/* Logic indicator with enhanced styling */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${colors.logicBg} ${colors.logicText} ${colors.logicBorder} border`}>
          {group.logic}
        </span>
        <span className="text-xs text-gray-500 font-medium">
          {group.fields.length} field{group.fields.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Fields with combo field support */}
      <div className="flex flex-wrap gap-2">
        {group.fields.map((field, fieldIndex) => (
          <FieldPill
            key={fieldIndex}
            field={field}
            isMatched={false} // TODO: Connect to pairing logic when implemented
          />
        ))}
      </div>
    </div>
  );
};

export const VaspRequirementsBlock: React.FC<VaspRequirementsBlockProps> = ({
  roleLabel,
  colorTheme,
  requirements
}) => {
  const themeColors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      header: 'bg-blue-600',
      text: 'text-blue-900',
      accent: 'text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      header: 'bg-purple-600',
      text: 'text-purple-900',
      accent: 'text-purple-700'
    }
  };

  const colors = themeColors[colorTheme];

  return (
    <div className={`border rounded-lg overflow-hidden ${colors.bg} ${colors.border}`}>
      {/* Header */}
      <div className={`${colors.header} px-4 py-3`}>
        <h3 className="text-lg font-semibold text-white">
          {roleLabel} Requirements
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Fields Section */}
        {requirements.fields && requirements.fields.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium ${colors.accent} mb-3`}>
              Required Fields
            </h4>
            <div className="flex flex-wrap gap-2">
              {requirements.fields.map((field, index) => (
                <FieldPill
                  key={index}
                  field={field}
                  isMatched={false} // TODO: Connect to pairing logic when implemented
                />
              ))}
            </div>
          </div>
        )}

        {/* Groups Section with enhanced visual separation */}
        {requirements.groups && requirements.groups.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium ${colors.accent} mb-3`}>
              Requirement Groups
            </h4>
            <div className="space-y-4">
              {requirements.groups.map((group, groupIndex) => (
                <RequirementGroup
                  key={groupIndex}
                  group={group}
                  colorTheme={colorTheme}
                />
              ))}
            </div>
          </div>
        )}

        {/* Verification Flags */}
        <VerificationFlags
          kyc_required={requirements.kyc_required}
          aml_required={requirements.aml_required}
          wallet_attribution={requirements.wallet_attribution}
          colorTheme={colorTheme}
        />
      </div>
    </div>
  );
};
