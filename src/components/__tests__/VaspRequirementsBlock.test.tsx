import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { VaspRequirementsBlock } from '../VaspRequirementsBlock';
import type { ExtractedRequirements } from '../../logic/requirementExtractor';

describe('VaspRequirementsBlock', () => {
  const mockRequirements: ExtractedRequirements = {
    fields: ['full_name', 'date_of_birth'],
    kyc_required: true,
    aml_required: false,
    wallet_attribution: true
  };

  const mockRequirementsWithGroups: ExtractedRequirements = {
    fields: [],
    groups: [
      {
        logic: 'AND',
        fields: ['full_name', 'date_of_birth + birthplace']
      },
      {
        logic: 'OR',
        fields: ['id_document_number', 'passport_number']
      }
    ],
    kyc_required: true,
    aml_required: true,
    wallet_attribution: false
  };

  it('renders with blue theme and simple fields', () => {
    const { container } = render(
      <VaspRequirementsBlock
        roleLabel="Sumsub"
        colorTheme="blue"
        requirements={mockRequirements}
      />
    );

    expect(container).toBeDefined();
    expect(container.textContent).toContain('Sumsub Requirements');
    expect(container.textContent).toContain('Required Fields');
    expect(container.textContent).toContain('full_name');
    expect(container.textContent).toContain('date_of_birth');
    expect(container.textContent).toContain('KYC Required');
    expect(container.textContent).toContain('Wallet Attribution');
  });

  it('renders with purple theme and requirement groups', () => {
    const { container } = render(
      <VaspRequirementsBlock
        roleLabel="Counterparty"
        colorTheme="purple"
        requirements={mockRequirementsWithGroups}
      />
    );

    expect(container).toBeDefined();
    expect(container.textContent).toContain('Counterparty Requirements');
    expect(container.textContent).toContain('Requirement Groups');
    expect(container.textContent).toContain('AND');
    expect(container.textContent).toContain('OR');
    expect(container.textContent).toContain('full_name');
    expect(container.textContent).toContain('date_of_birth + birthplace');
    expect(container.textContent).toContain('id_document_number');
    expect(container.textContent).toContain('passport_number');
  });

  it('renders verification flags correctly', () => {
    const { container } = render(
      <VaspRequirementsBlock
        roleLabel="Test"
        colorTheme="blue"
        requirements={mockRequirements}
      />
    );

    expect(container.textContent).toContain('KYC Required');
    expect(container.textContent).not.toContain('AML Required');
    expect(container.textContent).toContain('Wallet Attribution');
  });

  it('shows "No Special Verification" when no flags are set', () => {
    const noFlagsRequirements: ExtractedRequirements = {
      fields: ['full_name'],
      kyc_required: false,
      aml_required: false,
      wallet_attribution: false
    };

    const { container } = render(
      <VaspRequirementsBlock
        roleLabel="Test"
        colorTheme="blue"
        requirements={noFlagsRequirements}
      />
    );

    expect(container.textContent).toContain('No Special Verification');
  });

  it('handles empty requirements gracefully', () => {
    const emptyRequirements: ExtractedRequirements = {
      fields: [],
      kyc_required: false,
      aml_required: false,
      wallet_attribution: false
    };

    const { container } = render(
      <VaspRequirementsBlock
        roleLabel="Test"
        colorTheme="blue"
        requirements={emptyRequirements}
      />
    );

    expect(container.textContent).toContain('Test Requirements');
    expect(container.textContent).not.toContain('Required Fields');
    expect(container.textContent).not.toContain('Requirement Groups');
    expect(container.textContent).toContain('No Special Verification');
  });
});
