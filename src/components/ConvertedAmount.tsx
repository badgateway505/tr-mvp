import React from 'react';

interface ConvertedAmountProps {
  amount: number;
  originalCurrency: string;
  convertedEUR: number;
  label?: string;
  showOriginal?: boolean;
}

export const ConvertedAmount: React.FC<ConvertedAmountProps> = ({
  amount,
  originalCurrency,
  convertedEUR,
  label = 'Converted Amount',
  showOriginal = true,
}) => {
  const formatEUR = (value: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatOriginal = (value: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {showOriginal && (
              <div className="mb-1">
                Original: {formatOriginal(amount, originalCurrency)}
              </div>
            )}
            <div className="text-lg font-semibold text-gray-900">
              {formatEUR(convertedEUR)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">EUR Equivalent</div>
            <div className="text-xs text-blue-600 font-medium">Rounded</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Exchange rate applied and rounded to nearest EUR
        </div>
      </div>
    </div>
  );
};
