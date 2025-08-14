// React import not needed for this test file
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { DirectionToggle } from '../DirectionToggle';
import { EntityToggle } from '../EntityToggle';
import { CountrySelect } from '../CountrySelect';
import { AmountInput } from '../AmountInput';
import { FieldPill } from '../FieldPill';
import { VerificationFlags } from '../VerificationFlags';
import { SummaryStatusBar } from '../SummaryStatusBar';
import { ConvertedAmount } from '../ConvertedAmount';

// Mock the field normalization function
vi.mock('../../logic/fieldNormalization', () => ({
  normalizeField: vi.fn(() => ({ isCombo: false })),
  compareFieldSets: vi.fn(() => 'match'),
}));

describe('Accessibility Tests', () => {
  describe('DirectionToggle', () => {
    it('should support keyboard navigation with Enter and Space keys', () => {
      const mockOnChange = vi.fn();
      render(<DirectionToggle value="OUT" onChange={mockOnChange} />);

      const outButton = screen.getByRole('button', {
        name: /outgoing transfer direction/i,
      });
      const inButton = screen.getByRole('button', {
        name: /incoming transfer direction/i,
      });

      // Test Enter key
      fireEvent.keyDown(outButton, { key: 'Enter' });
      expect(mockOnChange).toHaveBeenCalledWith('OUT');

      // Test Space key
      fireEvent.keyDown(inButton, { key: ' ' });
      expect(mockOnChange).toHaveBeenCalledWith('IN');
    });

    it('should have proper ARIA attributes', () => {
      render(<DirectionToggle value="OUT" onChange={vi.fn()} />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();

      const outButton = screen.getByRole('button', {
        name: /outgoing transfer direction/i,
      });
      expect(outButton).toHaveAttribute('aria-pressed', 'true');

      const inButton = screen.getByRole('button', {
        name: /incoming transfer direction/i,
      });
      expect(inButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('EntityToggle', () => {
    it('should support keyboard navigation for enabled buttons', () => {
      const mockOnChange = vi.fn();
      render(<EntityToggle value="individual" onChange={mockOnChange} />);

      const individualButton = screen.getByRole('button', {
        name: /individual entity type/i,
      });

      fireEvent.keyDown(individualButton, { key: 'Enter' });
      expect(mockOnChange).toHaveBeenCalledWith('individual');
    });

    it('should have proper ARIA attributes', () => {
      render(<EntityToggle value="individual" onChange={vi.fn()} />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();

      const individualButton = screen.getByRole('button', {
        name: /individual entity type/i,
      });
      expect(individualButton).toHaveAttribute('aria-pressed', 'true');

      const companyButton = screen.getByRole('button', {
        name: /company entity type \(coming soon\)/i,
      });
      expect(companyButton).toHaveAttribute('aria-describedby');
    });
  });

  describe('CountrySelect', () => {
    it('should have proper label association', () => {
      render(
        <CountrySelect value="" onChange={vi.fn()} label="Test Country" />
      );

      const label = screen.getByText('Test Country');
      const select = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for', select.id);
      expect(select).toHaveAttribute('aria-labelledby', label.id);
    });

    it('should indicate invalid state when no value is selected', () => {
      render(<CountrySelect value="" onChange={vi.fn()} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('AmountInput', () => {
    it('should have proper label association', () => {
      render(
        <AmountInput
          value={0}
          onChange={vi.fn()}
          currency="EUR"
          label="Test Amount"
        />
      );

      const label = screen.getByText('Test Amount');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', input.id);
      expect(input).toHaveAttribute('aria-labelledby', label.id);
    });

    it('should indicate invalid state when amount is 0', () => {
      render(<AmountInput value={0} onChange={vi.fn()} currency="EUR" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('FieldPill', () => {
    it('should be keyboard accessible', () => {
      const mockOnFieldHover = vi.fn();
      render(
        <FieldPill
          field="testField"
          isMatched={true}
          onFieldHover={mockOnFieldHover}
        />
      );

      const pill = screen.getByRole('button');
      expect(pill).toHaveAttribute('tabIndex', '0');

      fireEvent.keyDown(pill, { key: 'Enter' });
      expect(mockOnFieldHover).toHaveBeenCalledWith('testField', true);
    });

    it('should have proper ARIA attributes', () => {
      render(<FieldPill field="testField" isMatched={true} />);

      const pill = screen.getByRole('button');
      expect(pill).toHaveAttribute('aria-label');
      expect(pill).toHaveAttribute('aria-describedby');
    });
  });

  describe('VerificationFlags', () => {
    it('should have proper section structure', () => {
      render(
        <VerificationFlags
          kyc_required={true}
          aml_required={false}
          wallet_attribution={true}
          colorTheme="blue"
        />
      );

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2); // KYC and Wallet Attribution
    });
  });

  describe('SummaryStatusBar', () => {
    it('should have proper status role', () => {
      const mockRequirements = {
        fields: ['field1'],
        groups: [],
        kyc_required: false,
        aml_required: false,
        wallet_attribution: false,
      };

      render(
        <SummaryStatusBar
          applicantRequirements={mockRequirements}
          counterpartyRequirements={mockRequirements}
          direction="OUT"
        />
      );

      const statusBar = screen.getByRole('status');
      expect(statusBar).toBeInTheDocument();
    });
  });

  describe('ConvertedAmount', () => {
    it('should have proper region role', () => {
      render(
        <ConvertedAmount
          amount={1000}
          originalCurrency="EUR"
          convertedEUR={1000}
          label="Test Conversion"
        />
      );

      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });
  });
});
