"use client"

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  className?: string;
  error?: string;
  isLoading?: boolean;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  onComplete,
  className,
  error,
  isLoading = false
}) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    // Check if code is complete
    if (newCode.every(digit => digit !== '') && newCode.join('').length === length) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const pastedArray = pastedData.split('').slice(0, length);
    
    if (pastedArray.length === length) {
      setCode(pastedArray);
      inputRefs.current[length - 1]?.focus();
      setFocusedIndex(length - 1);
      onComplete(pastedArray.join(''));
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-center space-x-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            className={cn(
              "w-[50px] h-[50px] sm:w-14 sm:h-14 xl:w-16 xl:h-20 text-center text-xl font-bold font-mono rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-custom-red/20",
              focusedIndex === index 
                ? "text-custom-red bg-white" 
                : "text-gray-400 bg-white",
              error && "text-custom-red"
            )}
            style={{ border: '10px solid #CF323240' }}
            disabled={isLoading}
          />
        ))}
      </div>

      {error && (
        <p className="text-custom-red text-sm font-outfit text-center">{error}</p>
      )}
    </div>
  );
};

export default VerificationCodeInput;
