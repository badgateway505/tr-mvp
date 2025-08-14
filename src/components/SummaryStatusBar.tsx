import React from 'react';
import type { ExtractedRequirements } from '../logic/requirementExtractor';
import { compareFieldSets } from '../logic/fieldNormalization';

interface SummaryStatusBarProps {
  applicantRequirements?: ExtractedRequirements;
  counterpartyRequirements?: ExtractedRequirements;
  direction: 'IN' | 'OUT';
  className?: string;
}

export const SummaryStatusBar: React.FC<SummaryStatusBarProps> = ({
  applicantRequirements,
  counterpartyRequirements,
  direction,
  className = '',
}) => {
  // Don't render if we don't have both requirements
  if (!applicantRequirements || !counterpartyRequirements) {
    return null;
  }

  // Determine compliance status
  const complianceStatus = compareFieldSets(
    applicantRequirements,
    counterpartyRequirements,
    direction
  );

  // Define status configurations
  const statusConfig = {
    match: {
      icon: '✅',
      color: 'bg-green-100 text-green-800 border-green-200',
      message: 'Perfect match - all required fields are covered',
      ariaLabel: 'Perfect match status - all required fields are covered',
    },
    overcompliance: {
      icon: '☑️',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      message:
        'Overcompliance - additional fields provided beyond requirements',
      ariaLabel: 'Overcompliance status - additional fields provided beyond requirements',
    },
    undercompliance: {
      icon: '⚠️',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      message: 'Undercompliance - some required fields are missing',
      ariaLabel: 'Undercompliance status - some required fields are missing',
    },
  };

  const config = statusConfig[complianceStatus];
  const statusBarId = `summary-status-${complianceStatus}`;

  return (
    <section
      id={statusBarId}
      className={`rounded-lg border p-4 ${config.color} ${className}
                     transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.01]
                     group cursor-default relative`}
      role="status"
      aria-labelledby={`${statusBarId}-heading`}
      aria-describedby={`${statusBarId}-message`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span 
          className="text-2xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
          aria-hidden="true"
          role="img"
        >
          {config.icon}
        </span>
        <div className="flex-1">
          <h3 
            id={`${statusBarId}-heading`}
            className="font-semibold text-sm uppercase tracking-wide mb-1 transition-colors duration-200"
          >
            Compliance Status
          </h3>
          <p 
            id={`${statusBarId}-message`}
            className="text-sm font-medium transition-all duration-200 group-hover:text-opacity-90"
          >
            {config.message}
          </p>
        </div>
        <div className="text-right">
          <div 
            className="text-xs font-medium uppercase tracking-wide opacity-75 transition-opacity duration-200 group-hover:opacity-90"
            aria-hidden="true"
          >
            Status
          </div>
          <div 
            className="text-sm font-bold transition-all duration-200 group-hover:scale-105"
            aria-label={`Current status: ${complianceStatus}`}
          >
            {complianceStatus.charAt(0).toUpperCase() +
              complianceStatus.slice(1)}
          </div>
        </div>
      </div>

      {/* Subtle background animation on hover */}
      <div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent 
                      opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      ></div>
    </section>
  );
};
