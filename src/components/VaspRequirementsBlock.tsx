import React from 'react';
import type { ExtractedRequirements } from '../logic/requirementExtractor';
import { FieldPill } from './FieldPill';
import { VerificationFlags } from './VerificationFlags';

interface VaspRequirementsBlockProps {
  roleLabel: string;
  colorTheme: 'blue' | 'purple';
  requirements: ExtractedRequirements;
  comparableSets?:
    | {
        applicantFields: string[];
        counterpartyFields: string[];
        applicantGroups: Array<
          [
            string,
            { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean; matchedFields: string[] },
          ]
        >;
        counterpartyGroups: Array<
          [
            string,
            { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean; matchedFields: string[] },
          ]
        >;
        fieldPairings: Map<string, string[]>;
        reversePairings: Map<string, string[]>;
        totalMatches: number;
        applicantMatchedFields: string[];
        counterpartyMatchedFields: string[];
      }
    | undefined;
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
  matchedFields?: string[] | undefined;
}> = ({
  group,
  colorTheme,
  isSatisfied,
  fieldPairings,
  isApplicantSide,
  hoveredField,
  onFieldHover,
  matchedFields = [],
}) => {
  const themeColors = {
    blue: {
      logicBg: group.logic === 'AND' ? 'bg-green-100' : 'bg-orange-100',
      logicText: group.logic === 'AND' ? 'text-green-800' : 'text-orange-800',
      logicBorder:
        group.logic === 'AND' ? 'border-green-200' : 'border-orange-200',
      groupBg: 'bg-white',
      groupBorder: 'border-gray-200',
    },
    purple: {
      logicBg: group.logic === 'AND' ? 'bg-green-100' : 'bg-orange-100',
      logicText: group.logic === 'AND' ? 'text-green-800' : 'text-orange-800',
      logicBorder:
        group.logic === 'AND' ? 'border-green-200' : 'border-orange-200',
      groupBg: 'bg-white',
      groupBorder: 'border-gray-200',
    },
  };

  const colors = themeColors[colorTheme];

  // Enhanced satisfaction styling for task 10.3
  const satisfactionClasses =
    isSatisfied !== undefined
      ? isSatisfied
        ? 'group-satisfied ring-2 ring-green-200 bg-green-50'
        : 'group-not-satisfied ring-2 ring-red-200 bg-red-50'
      : '';

  // Calculate satisfaction details for better UX
  const totalFields = group.fields.length;
  const matchedCount = matchedFields.length;
  const satisfactionPercentage = totalFields > 0 ? (matchedCount / totalFields) * 100 : 0;

  const groupId = `group-${group.logic.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`${colors.groupBg} border ${colors.groupBorder} rounded-lg p-4 shadow-sm 
                     transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01]
                     ${satisfactionClasses}`}
      role="group"
      aria-labelledby={groupId}
      aria-describedby={`${groupId}-description`}
    >
      {/* Logic indicator with enhanced styling */}
      <div className="flex items-center gap-3 mb-3">
        <span
          id={groupId}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${colors.logicBg} ${colors.logicText} ${colors.logicBorder} border
                     transition-all duration-200 ease-out hover:scale-105`}
          role="status"
          aria-label={`${group.logic} logic group`}
        >
          {group.logic}
        </span>
        {isSatisfied !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              isSatisfied
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
            role="status"
            aria-label={isSatisfied ? 'Group satisfied' : 'Group not satisfied'}
          >
            {isSatisfied ? '✓ Satisfied' : '✗ Not Satisfied'}
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-wrap gap-2">
        {group.fields.map((field, index) => (
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

      {/* Satisfaction details for OR groups */}
      {group.logic === 'OR' && isSatisfied !== undefined && (
        <div 
          id={`${groupId}-description`}
          className="mt-3 pt-3 border-t border-gray-200"
          role="status"
          aria-live="polite"
        >
          <div className="text-xs text-gray-600">
            <strong>OR Group Logic:</strong> This group is satisfied because{' '}
            {isSatisfied 
              ? `at least one field (${matchedCount} of ${totalFields}) has matches on the other side.`
              : `none of the ${totalFields} fields have matches on the other side.`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export const VaspRequirementsBlock: React.FC<VaspRequirementsBlockProps> = ({
  roleLabel,
  colorTheme,
  requirements,
  comparableSets,
  hoveredField,
  onFieldHover,
}) => {
  const themeColors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      header: 'bg-blue-600',
      text: 'text-blue-900',
      accent: 'text-blue-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      header: 'bg-purple-600',
      text: 'text-purple-900',
      accent: 'text-purple-700',
    },
  };

  const colors = themeColors[colorTheme];

  // Determine which side this component represents and get appropriate pairings
  const isApplicantSide = colorTheme === 'blue'; // Sumsub is always applicant side
  const fieldPairings = comparableSets
    ? isApplicantSide
      ? comparableSets.fieldPairings
      : comparableSets.reversePairings
    : undefined;

  const blockId = `vasp-block-${roleLabel.toLowerCase().replace(/\s+/g, '-')}`;
  const fieldsSectionId = `${blockId}-fields`;
  const groupsSectionId = `${blockId}-groups`;

  return (
    <div
      id={blockId}
      className={`border rounded-lg overflow-hidden ${colors.bg} ${colors.border}
                     transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.005]
                     group`}
      role="region"
      aria-labelledby={`${blockId}-header`}
    >
      {/* Header */}
      <div
        className={`${colors.header} px-4 py-3 transition-all duration-200 group-hover:brightness-110`}
      >
        <h3 
          id={`${blockId}-header`}
          className="text-lg font-semibold text-white transition-all duration-200 group-hover:scale-[1.02]"
        >
          {roleLabel} Requirements
        </h3>
        {comparableSets && (
          <div 
            className="text-sm text-blue-100 mt-1 transition-opacity duration-200 group-hover:opacity-90"
            role="status"
            aria-label={`${isApplicantSide
              ? comparableSets.applicantMatchedFields.length
              : comparableSets.counterpartyMatchedFields.length} fields matched`}
          >
            {isApplicantSide
              ? `${comparableSets.applicantMatchedFields.length} fields matched`
              : `${comparableSets.counterpartyMatchedFields.length} fields matched`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Fields Section */}
        {requirements.fields && requirements.fields.length > 0 && (
          <section 
            id={fieldsSectionId}
            aria-labelledby={`${fieldsSectionId}-heading`}
            className="mb-6"
          >
            <h4
              id={`${fieldsSectionId}-heading`}
              className={`text-sm font-medium ${colors.accent} mb-3 transition-colors duration-200`}
            >
              Required Fields
            </h4>
            <div 
              className="flex flex-wrap gap-2"
              role="list"
              aria-label="Required fields for this VASP"
            >
              {requirements.fields.map((field, index) => (
                <div key={index} role="listitem">
                  <FieldPill
                    field={field}
                    isMatched={fieldPairings ? fieldPairings.has(field) : false}
                    fieldPairings={fieldPairings}
                    isApplicantSide={isApplicantSide}
                    hoveredField={hoveredField || null}
                    onFieldHover={onFieldHover || undefined}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Groups Section with enhanced visual separation */}
        {requirements.groups && requirements.groups.length > 0 && (
          <section 
            id={groupsSectionId}
            aria-labelledby={`${groupsSectionId}-heading`}
            className="mb-6"
          >
            <h4
              id={`${groupsSectionId}-heading`}
              className={`text-sm font-medium ${colors.accent} mb-3 transition-colors duration-200`}
            >
              Requirement Groups
            </h4>
            <div 
              className="space-y-4"
              role="list"
              aria-label="Requirement groups for this VASP"
            >
              {requirements.groups.map((group, groupIndex) => {
                // Find the corresponding group in comparableSets to get satisfaction status
                const groupKey = `group_${groupIndex}`;
                const comparableGroup =
                  comparableSets?.applicantGroups.find(
                    ([key, _]) => key === groupKey
                  ) ||
                  comparableSets?.counterpartyGroups.find(
                    ([key, _]) => key === groupKey
                  );
                const isSatisfied = comparableGroup
                  ? comparableGroup[1].satisfied
                  : undefined;

                return (
                  <div key={groupIndex} role="listitem">
                    <RequirementGroup
                      group={group}
                      colorTheme={colorTheme}
                      isSatisfied={isSatisfied}
                      fieldPairings={fieldPairings}
                      isApplicantSide={isApplicantSide}
                      hoveredField={hoveredField || null}
                      onFieldHover={onFieldHover || undefined}
                      matchedFields={comparableGroup ? comparableGroup[1].matchedFields : []}
                    />
                  </div>
                );
              })}
            </div>
          </section>
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
