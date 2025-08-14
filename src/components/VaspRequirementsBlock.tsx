import React from 'react';
import type { ExtractedRequirements } from '../logic/requirementExtractor';
import { FieldPill } from './FieldPill';
import { VerificationFlags } from './VerificationFlags';

interface VaspRequirementsBlockProps {
  roleLabel: string;
  colorTheme: 'blue' | 'purple';
  requirements: ExtractedRequirements;
  comparableSets?: {
    applicantFields: string[];
    counterpartyFields: string[];
    applicantGroups: Array<[string, { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean }]>;
    counterpartyGroups: Array<[string, { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean }]>;
    fieldPairings: Map<string, string[]>;
    reversePairings: Map<string, string[]>;
    totalMatches: number;
    applicantMatchedFields: string[];
    counterpartyMatchedFields: string[];
  } | undefined;
  hoveredField?: string | null;
  onFieldHover?: (field: string, isHovering: boolean) => void;
}

// Separate component for rendering requirement groups with enhanced styling
const RequirementGroup: React.FC<{
  group: { logic: 'AND' | 'OR'; fields: string[] };
  colorTheme: 'blue' | 'purple';
  isSatisfied?: boolean | undefined;
  fieldPairings?: Map<string, string[]> | undefined;
  isApplicantSide?: boolean | undefined;
  hoveredField?: string | null | undefined;
  onFieldHover?: ((field: string, isHovering: boolean) => void) | undefined;
}> = ({ group, colorTheme, isSatisfied, fieldPairings, isApplicantSide, hoveredField, onFieldHover }) => {
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

  // Add satisfaction styling classes
  const satisfactionClasses = isSatisfied !== undefined 
    ? (isSatisfied ? 'group-satisfied' : 'group-not-satisfied')
    : '';

  return (
    <div className={`${colors.groupBg} border ${colors.groupBorder} rounded-lg p-4 shadow-sm 
                     transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01]
                     ${satisfactionClasses}`}>
      {/* Logic indicator with enhanced styling */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${colors.logicBg} ${colors.logicText} ${colors.logicBorder} border
                         transition-all duration-200 hover:scale-105`}>
          {group.logic}
        </span>
        <span className="text-xs text-gray-500 font-medium transition-colors duration-150">
          {group.fields.length} field{group.fields.length !== 1 ? 's' : ''}
        </span>
        {isSatisfied !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ease-out
                           ${isSatisfied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                           ${isSatisfied ? 'hover:bg-green-200' : 'hover:bg-red-200'}`}>
            {isSatisfied ? '✓ Satisfied' : '✗ Not Satisfied'}
          </span>
        )}
      </div>
      
      {/* Fields with combo field support */}
      <div className="flex flex-wrap gap-2">
        {group.fields.map((field, fieldIndex) => (
          <FieldPill
            key={fieldIndex}
            field={field}
            isMatched={fieldPairings ? fieldPairings.has(field) : false}
            fieldPairings={fieldPairings || undefined}
            isApplicantSide={isApplicantSide || undefined}
            hoveredField={hoveredField}
            onFieldHover={onFieldHover}
          />
        ))}
      </div>
    </div>
  );
};

export const VaspRequirementsBlock: React.FC<VaspRequirementsBlockProps> = ({
  roleLabel,
  colorTheme,
  requirements,
  comparableSets,
  hoveredField,
  onFieldHover
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
  
  // Determine which side this component represents and get appropriate pairings
  const isApplicantSide = colorTheme === 'blue'; // Sumsub is always applicant side
  const fieldPairings = comparableSets ? 
    (isApplicantSide ? comparableSets.fieldPairings : comparableSets.reversePairings) : 
    undefined;

  return (
    <div className={`border rounded-lg overflow-hidden ${colors.bg} ${colors.border}
                     transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.005]
                     group`}>
      {/* Header */}
      <div className={`${colors.header} px-4 py-3 transition-all duration-200 group-hover:brightness-110`}>
        <h3 className="text-lg font-semibold text-white transition-all duration-200 group-hover:scale-[1.02]">
          {roleLabel} Requirements
        </h3>
        {comparableSets && (
          <div className="text-sm text-blue-100 mt-1 transition-opacity duration-200 group-hover:opacity-90">
            {isApplicantSide 
              ? `${comparableSets.applicantMatchedFields.length} fields matched`
              : `${comparableSets.counterpartyMatchedFields.length} fields matched`
            }
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Fields Section */}
        {requirements.fields && requirements.fields.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium ${colors.accent} mb-3 transition-colors duration-200`}>
              Required Fields
            </h4>
            <div className="flex flex-wrap gap-2">
              {requirements.fields.map((field, index) => (
                <FieldPill
                  key={index}
                  field={field}
                  isMatched={fieldPairings ? fieldPairings.has(field) : false}
                  fieldPairings={fieldPairings}
                  isApplicantSide={isApplicantSide}
                  hoveredField={hoveredField || null}
                  onFieldHover={onFieldHover || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Groups Section with enhanced visual separation */}
        {requirements.groups && requirements.groups.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium ${colors.accent} mb-3 transition-colors duration-200`}>
              Requirement Groups
            </h4>
            <div className="space-y-4">
              {requirements.groups.map((group, groupIndex) => {
                // Find the corresponding group in comparableSets to get satisfaction status
                const groupKey = `group_${groupIndex}`;
                const comparableGroup = comparableSets?.applicantGroups.find(([key, _]) => key === groupKey) ||
                                      comparableSets?.counterpartyGroups.find(([key, _]) => key === groupKey);
                const isSatisfied = comparableGroup ? comparableGroup[1].satisfied : undefined;
                
                return (
                  <RequirementGroup
                    key={groupIndex}
                    group={group}
                    colorTheme={colorTheme}
                    isSatisfied={isSatisfied}
                    fieldPairings={fieldPairings}
                    isApplicantSide={isApplicantSide}
                    hoveredField={hoveredField || null}
                    onFieldHover={onFieldHover || undefined}
                  />
                );
              })}
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
