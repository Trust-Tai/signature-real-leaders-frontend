import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodeVerificationSectionProps {
  onVerify: (code: string) => void;
  onResendCode: () => void;
  className?: string;
  error?: string;
  isLoading?: boolean;


}

const CodeVerificationSection: React.FC<CodeVerificationSectionProps> = ({
  onVerify,
  onResendCode,
  className,
  error,
  isLoading = false,

}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Submit if all digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode([...newCode, '', '', '', ''].slice(0, 4));
      onVerify(pastedData);
    }
  };

  return (
    <div className={cn("text-center space-y-8", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
      ENTER CODE (VIA EMAIL)
      </h2>

      

      {/* Verification Code Input */}
      <div className="space-y-6">
        <div className="flex justify-center space-x-3 sm:space-x-4" style={{marginBottom:10}}>
          {code.map((digit, index) => (
            <div key={index} className='firstVerifyScreen'>
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
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "text-center font-bold font-mono  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-custom-red/20",
                // Mobile sizes
                "w-[50px] h-[50px] sm:w-14 sm:h-14 text-xl sm:text-2xl",
                // Desktop sizes (xl and above)
                "xl:w-16 xl:h-20 xl:text-2xl",
                // Mobile border
                "border-2 border-custom-red-border",
                // Desktop border
                "firstVerifyScreenInput",
                digit
                  ? "text-custom-red bg-white"
                  : "text-gray-400 bg-white",
                error && "text-custom-red"
              )}
              disabled={isLoading}
            />
            </div>
          ))}
        </div>
<p className="font-outfit mx-auto leading-relaxed" style={{fontSize:15, color: '#656060'}}>
       check your email for your Real Leaders access code
      </p>
        
        <button
          type="submit"
          className="custom-btn mt-4 mb-0 disabled:opacity-50"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'VERIFYING...' : 'VERIFY AND CONTINUE'}
        </button>

        {error && (
          <p className="text-custom-red text-sm font-outfit">{error}</p>
        )}



        {/* Resend Code Link */}
       <div className="p-2">
  <button
    onClick={onResendCode}
    disabled={isLoading}
    className=""
    aria-busy={isLoading}
  >
    <span className="font-outfit font-normal transition-colors duration-200" style={{fontSize:15, color: '#656060'}}>
      Didn&apos;t receive the code?{' '}
      <span className="font-outfit font-medium hover:text-custom-red transition-colors duration-200" style={{fontSize:15, color: '#000000'}}>
        {isLoading ? '[Resending...]' : '[Resend]'}
      </span>
    </span>
  </button>
</div>
      </div>
    </div>
  );
};

export default CodeVerificationSection;
