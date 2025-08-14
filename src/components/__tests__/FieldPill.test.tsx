import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldPill } from '../FieldPill';

describe('FieldPill', () => {
  it('renders a simple field correctly', () => {
    render(<FieldPill field="full_name" />);

    const pill = screen.getByText('full_name');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass('bg-white', 'border-gray-300');
  });

  it('renders a combo field correctly', () => {
    render(<FieldPill field="date_of_birth + birthplace" />);

    const pill = screen.getByText('date_of_birth + birthplace');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass('field-combo', 'text-blue-800', 'bg-blue-50');
    expect(pill).toHaveAttribute(
      'title',
      'Combined field: date_of_birth + birthplace'
    );
  });

  it('applies matched styling when isMatched is true and has actual matches', () => {
    const fieldPairings = new Map([['full_name', ['matching_field']]]);
    render(
      <FieldPill
        field="full_name"
        isMatched={true}
        fieldPairings={fieldPairings}
      />
    );

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass(
      'bg-green-50',
      'border-green-300',
      'text-green-800'
    );
    expect(pill).toHaveClass('hover:scale-105', 'hover:shadow-md');
  });

  it('applies warning styling when isMatched is true but no actual matches', () => {
    const fieldPairings = new Map(); // Empty pairings
    render(
      <FieldPill
        field="full_name"
        isMatched={true}
        fieldPairings={fieldPairings}
      />
    );

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass(
      'bg-yellow-50',
      'border-yellow-300',
      'text-yellow-800'
    );
    expect(pill).toHaveClass('hover:scale-105');
  });

  it('applies unmatched styling when isMatched is false', () => {
    render(<FieldPill field="full_name" isMatched={false} />);

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('bg-white', 'border-gray-300', 'text-gray-700');
    expect(pill).toHaveClass('hover:scale-105');
    expect(pill).not.toHaveClass('border-green-300', 'border-yellow-300');
  });

  it('calls onHover callback on mouse enter and leave', () => {
    const mockOnHover = vi.fn();
    render(<FieldPill field="full_name" onHover={mockOnHover} />);

    const pill = screen.getByText('full_name');

    fireEvent.mouseEnter(pill);
    expect(mockOnHover).toHaveBeenCalledWith('full_name', true);

    fireEvent.mouseLeave(pill);
    expect(mockOnHover).toHaveBeenCalledWith('full_name', false);
  });

  it('calls onFieldHover callback when provided', () => {
    const mockOnFieldHover = vi.fn();
    render(<FieldPill field="full_name" onFieldHover={mockOnFieldHover} />);

    const pill = screen.getByText('full_name');

    fireEvent.mouseEnter(pill);
    expect(mockOnFieldHover).toHaveBeenCalledWith('full_name', true);

    fireEvent.mouseLeave(pill);
    expect(mockOnFieldHover).toHaveBeenCalledWith('full_name', false);
  });

  it('applies custom className when provided', () => {
    render(<FieldPill field="full_name" className="custom-class" />);

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('custom-class');
  });

  it('shows match count for fields with multiple matches', () => {
    const fieldPairings = new Map([
      ['full_name', ['match1', 'match2', 'match3']],
    ]);
    render(
      <FieldPill
        field="full_name"
        isMatched={true}
        fieldPairings={fieldPairings}
      />
    );

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('bg-green-50', 'border-green-300');

    // Should show match count badge
    const matchCount = screen.getByText('3');
    expect(matchCount).toBeInTheDocument();
    expect(matchCount).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('shows correct visual indicators for different field states', () => {
    const fieldPairings = new Map([['matched_field', ['counterpart']]]);

    // Matched field with actual matches
    const { rerender } = render(
      <FieldPill
        field="matched_field"
        isMatched={true}
        fieldPairings={fieldPairings}
      />
    );
    expect(screen.getByText('✓')).toBeInTheDocument();

    // Matched field without actual matches
    rerender(
      <FieldPill
        field="warning_field"
        isMatched={true}
        fieldPairings={new Map()}
      />
    );
    expect(screen.getByText('⚠')).toBeInTheDocument();

    // Unmatched field
    rerender(<FieldPill field="unmatched_field" isMatched={false} />);
    expect(screen.getByText('○')).toBeInTheDocument();
  });

  it('applies enhanced hover effects for matched fields', () => {
    const fieldPairings = new Map([['full_name', ['matching_field']]]);
    render(
      <FieldPill
        field="full_name"
        isMatched={true}
        fieldPairings={fieldPairings}
      />
    );

    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('hover:scale-105', 'hover:shadow-md');
    expect(pill).toHaveClass('ring-2', 'ring-green-200', 'shadow-sm');
  });

  it('applies combo field styling correctly', () => {
    render(<FieldPill field="date_of_birth + birthplace" />);

    const pill = screen.getByText('date_of_birth + birthplace');
    expect(pill).toHaveClass(
      'field-combo',
      'text-blue-800',
      'bg-blue-50',
      'border-blue-200'
    );
    expect(pill).toHaveClass('hover:scale-105');
  });
});
