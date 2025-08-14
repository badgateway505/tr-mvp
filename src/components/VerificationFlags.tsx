import React from 'react';

interface VerificationFlagsProps {
  kyc_required: boolean;
  aml_required: boolean;
  wallet_attribution: boolean;
  colorTheme: 'blue' | 'purple';
  className?: string;
}

export const VerificationFlags: React.FC<VerificationFlagsProps> = ({
  kyc_required,
  aml_required,
  wallet_attribution,
  colorTheme,
  className = '',
}) => {
  const themeColors = {
    blue: {
      accent: 'text-blue-700',
    },
    purple: {
      accent: 'text-purple-700',
    },
  };

  const colors = themeColors[colorTheme];

  const sectionId = `verification-flags-${colorTheme}`;
  const flagsListId = `${sectionId}-list`;

  // Generate accessible description of verification requirements
  const getVerificationSummary = () => {
    const requirements = [];
    if (kyc_required) requirements.push('KYC verification required');
    if (aml_required) requirements.push('AML verification required');
    if (wallet_attribution) requirements.push('wallet attribution required');

    if (requirements.length === 0) {
      return 'No special verification requirements';
    }

    return requirements.join(', ');
  };

  return (
    <section
      id={sectionId}
      className={`border-t border-gray-200 pt-4 ${className} transition-all duration-200 ease-out`}
      aria-labelledby={`${sectionId}-heading`}
    >
      <h4
        id={`${sectionId}-heading`}
        className={`text-sm font-medium ${colors.accent} mb-3 transition-colors duration-200`}
      >
        Verification Requirements
      </h4>
      <div
        id={flagsListId}
        className="flex flex-wrap gap-2"
        role="list"
        aria-label="Verification requirements for this VASP"
        aria-describedby={`${sectionId}-summary`}
      >
        {kyc_required && (
          <span
            className="px-3 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-lg border border-yellow-200 font-medium
                         transition-all duration-200 ease-out hover:scale-105 hover:bg-yellow-200 hover:shadow-md
                         cursor-default"
            role="listitem"
            aria-label="KYC verification required"
          >
            KYC Required
          </span>
        )}
        {aml_required && (
          <span
            className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded-lg border border-red-200 font-medium
                         transition-all duration-200 ease-out hover:scale-105 hover:bg-red-200 hover:shadow-md
                         cursor-default"
            role="listitem"
            aria-label="AML verification required"
          >
            AML Required
          </span>
        )}
        {wallet_attribution && (
          <span
            className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg border border-blue-200 font-medium
                         transition-all duration-200 ease-out hover:scale-105 hover:bg-blue-200 hover:shadow-md
                         cursor-default"
            role="listitem"
            aria-label="Wallet attribution required"
          >
            Wallet Attribution
          </span>
        )}
        {!kyc_required && !aml_required && !wallet_attribution && (
          <span
            className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg border border-gray-200 font-medium
                         transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-200 hover:shadow-md
                         cursor-default"
            role="listitem"
            aria-label="No special verification requirements"
          >
            No Special Verification
          </span>
        )}
      </div>

      {/* Hidden summary for screen readers */}
      <div id={`${sectionId}-summary`} className="sr-only" aria-live="polite">
        {getVerificationSummary()}
      </div>
    </section>
  );
};
