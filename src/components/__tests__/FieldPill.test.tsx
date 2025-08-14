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
    expect(pill).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-indigo-50');
    expect(pill).toHaveAttribute('title', 'Combined field: date_of_birth + birthplace');
  });

  it('applies matched styling when isMatched is true', () => {
    render(<FieldPill field="full_name" isMatched={true} />);
    
    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('border-green-300', 'hover:border-dashed');
  });

  it('applies unmatched styling when isMatched is false', () => {
    render(<FieldPill field="full_name" isMatched={false} />);
    
    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('border-gray-300');
    expect(pill).not.toHaveClass('border-green-300', 'hover:border-dashed');
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

  it('applies custom className when provided', () => {
    render(<FieldPill field="full_name" className="custom-class" />);
    
    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('custom-class');
  });

  it('has correct hover effects for matched fields', () => {
    render(<FieldPill field="full_name" isMatched={true} />);
    
    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('hover:scale-105', 'hover:border-dashed');
  });

  it('has correct hover effects for unmatched fields', () => {
    render(<FieldPill field="full_name" isMatched={false} />);
    
    const pill = screen.getByText('full_name');
    expect(pill).toHaveClass('hover:scale-105');
    expect(pill).not.toHaveClass('hover:border-dashed');
  });

  it('applies combo field hover effects', () => {
    render(<FieldPill field="date_of_birth + birthplace" />);
    
    const pill = screen.getByText('date_of_birth + birthplace');
    expect(pill).toHaveClass('hover:from-blue-100', 'hover:to-indigo-100', 'hover:border-blue-300');
  });
});
