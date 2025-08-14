import React, { useState, useEffect } from 'react';

interface AmountInputProps {
  value: number;
  onChange: (amount: number) => void;
  currency: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-describedby'?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency,
  label = 'Amount',
  placeholder = 'Enter amount',
  disabled = false,
  id,
  'aria-describedby': ariaDescribedby,
}) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

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
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
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

  const inputId = id || 'amount-input';
  const labelId = label ? `${inputId}-label` : undefined;
  const helpTextId = `${inputId}-help`;

  return (
    <div className="w-full group">
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-gray-800"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={`${helpTextId} ${ariaDescribedby || ''}`.trim()}
          aria-invalid={!value}
          aria-label={label ? undefined : `Amount in ${currency}`}
          className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     transition-all duration-200 ease-out
                     hover:border-gray-400 hover:shadow-md
                     focus:shadow-lg focus:scale-[1.01]
                     disabled:hover:border-gray-300 disabled:hover:shadow-sm"
        />
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <span
            className={`text-sm font-medium transition-all duration-200 ${
              isFocused ? 'text-blue-600 scale-110' : 'text-gray-500'
            }`}
          >
            {currency}
          </span>
        </div>

        {/* Subtle focus indicator */}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-md ring-2 ring-blue-200 ring-opacity-50 pointer-events-none animate-pulse"
            aria-hidden="true"
          ></div>
        )}
      </div>
      <div
        id={helpTextId}
        className="mt-2 text-xs text-gray-500 transition-colors duration-150 group-hover:text-gray-600"
      >
        Enter amount in {currency} (digits only)
      </div>
    </div>
  );
};
