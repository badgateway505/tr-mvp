import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerificationFlags } from '../VerificationFlags';

describe('VerificationFlags', () => {
  it('renders KYC required flag when kyc_required is true', () => {
    render(
      <VerificationFlags
        kyc_required={true}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="blue"
      />
    );
    
    expect(screen.getByText('KYC Required')).toBeInTheDocument();
    expect(screen.queryByText('AML Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Wallet Attribution')).not.toBeInTheDocument();
  });

  it('renders AML required flag when aml_required is true', () => {
    render(
      <VerificationFlags
        kyc_required={false}
        aml_required={true}
        wallet_attribution={false}
        colorTheme="blue"
      />
    );
    
    expect(screen.getByText('AML Required')).toBeInTheDocument();
    expect(screen.queryByText('KYC Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Wallet Attribution')).not.toBeInTheDocument();
  });

  it('renders Wallet Attribution flag when wallet_attribution is true', () => {
    render(
      <VerificationFlags
        kyc_required={false}
        aml_required={false}
        wallet_attribution={true}
        colorTheme="blue"
      />
    );
    
    expect(screen.getByText('Wallet Attribution')).toBeInTheDocument();
    expect(screen.queryByText('KYC Required')).not.toBeInTheDocument();
    expect(screen.queryByText('AML Required')).not.toBeInTheDocument();
  });

  it('renders multiple flags when multiple are true', () => {
    render(
      <VerificationFlags
        kyc_required={true}
        aml_required={true}
        wallet_attribution={false}
        colorTheme="purple"
      />
    );
    
    expect(screen.getByText('KYC Required')).toBeInTheDocument();
    expect(screen.getByText('AML Required')).toBeInTheDocument();
    expect(screen.queryByText('Wallet Attribution')).not.toBeInTheDocument();
  });

  it('renders "No Special Verification" when all flags are false', () => {
    render(
      <VerificationFlags
        kyc_required={false}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="blue"
      />
    );
    
    expect(screen.getByText('No Special Verification')).toBeInTheDocument();
    expect(screen.queryByText('KYC Required')).not.toBeInTheDocument();
    expect(screen.queryByText('AML Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Wallet Attribution')).not.toBeInTheDocument();
  });

  it('applies blue theme colors correctly', () => {
    render(
      <VerificationFlags
        kyc_required={true}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="blue"
      />
    );
    
    const heading = screen.getByText('Verification Requirements');
    expect(heading).toHaveClass('text-blue-700');
  });

  it('applies purple theme colors correctly', () => {
    render(
      <VerificationFlags
        kyc_required={true}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="purple"
      />
    );
    
    const heading = screen.getByText('Verification Requirements');
    expect(heading).toHaveClass('text-purple-700');
  });

  it('applies custom className when provided', () => {
    render(
      <VerificationFlags
        kyc_required={true}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="blue"
        className="custom-class"
      />
    );
    
    const container = screen.getByText('Verification Requirements').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('has correct section title', () => {
    render(
      <VerificationFlags
        kyc_required={false}
        aml_required={false}
        wallet_attribution={false}
        colorTheme="blue"
      />
    );
    
    expect(screen.getByText('Verification Requirements')).toBeInTheDocument();
  });
});
