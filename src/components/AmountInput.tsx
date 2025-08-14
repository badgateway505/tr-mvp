import React, { useState, useEffect } from 'react';

interface AmountInputProps {
  value: number;
  onChange: (amount: number) => void;
  currency: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency,
  label = 'Amount',
  placeholder = 'Enter amount',
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value.toString());

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits
    if (inputValue === '' || /^\d+$/.test(inputValue)) {
      setDisplayValue(inputValue);
      
      // Convert to number and call onChange
      const numValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
      onChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent non-digit keys (except navigation keys)
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'Home', 'End', 'ArrowLeft', 'ArrowRight'
    ];
    
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Only allow pasting digits
    if (/^\d+$/.test(pastedText)) {
      const newValue = displayValue + pastedText;
      setDisplayValue(newValue);
      onChange(parseInt(newValue, 10));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-sm font-medium">
            {currency}
          </span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Enter amount in {currency} (digits only)
      </div>
    </div>
  );
};
