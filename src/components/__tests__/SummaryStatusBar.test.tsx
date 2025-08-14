import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryStatusBar } from '../SummaryStatusBar';
import type { ExtractedRequirements } from '../../logic/requirementExtractor';

// Mock the compareFieldSets function
vi.mock('../../logic/fieldNormalization', () => ({
  compareFieldSets: vi.fn()
}));

const mockRequirements: ExtractedRequirements = {
  fields: ['field1', 'field2'],
  kyc_required: true,
  aml_required: false,
  wallet_attribution: false
};

describe('SummaryStatusBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when requirements are missing', () => {
    const { container } = render(
      <SummaryStatusBar
        direction="OUT"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when only one requirement is provided', () => {
    const { container } = render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        direction="OUT"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays match status correctly', async () => {
    const { compareFieldSets } = await import('../../logic/fieldNormalization');
    vi.mocked(compareFieldSets).mockReturnValue('match');
    
    render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        counterpartyRequirements={mockRequirements}
        direction="OUT"
      />
    );

    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('Perfect match - all required fields are covered')).toBeInTheDocument();
    expect(screen.getByText('Match')).toBeInTheDocument();
  });

  it('displays overcompliance status correctly', async () => {
    const { compareFieldSets } = await import('../../logic/fieldNormalization');
    vi.mocked(compareFieldSets).mockReturnValue('overcompliance');
    
    render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        counterpartyRequirements={mockRequirements}
        direction="OUT"
      />
    );

    expect(screen.getByText('☑️')).toBeInTheDocument();
    expect(screen.getByText('Overcompliance - additional fields provided beyond requirements')).toBeInTheDocument();
    expect(screen.getByText('Overcompliance')).toBeInTheDocument();
  });

  it('displays undercompliance status correctly', async () => {
    const { compareFieldSets } = await import('../../logic/fieldNormalization');
    vi.mocked(compareFieldSets).mockReturnValue('undercompliance');
    
    render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        counterpartyRequirements={mockRequirements}
        direction="OUT"
      />
    );

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Undercompliance - some required fields are missing')).toBeInTheDocument();
    expect(screen.getByText('Undercompliance')).toBeInTheDocument();
  });

  it('calls compareFieldSets with correct parameters', async () => {
    const { compareFieldSets } = await import('../../logic/fieldNormalization');
    
    render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        counterpartyRequirements={mockRequirements}
        direction="IN"
      />
    );

    expect(vi.mocked(compareFieldSets)).toHaveBeenCalledWith(
      mockRequirements,
      mockRequirements,
      'IN'
    );
  });

  it('applies custom className', async () => {
    const { compareFieldSets } = await import('../../logic/fieldNormalization');
    vi.mocked(compareFieldSets).mockReturnValue('match');
    
    const { container } = render(
      <SummaryStatusBar
        applicantRequirements={mockRequirements}
        counterpartyRequirements={mockRequirements}
        direction="OUT"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
