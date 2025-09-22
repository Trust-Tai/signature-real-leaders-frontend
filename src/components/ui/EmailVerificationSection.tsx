import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface EmailVerificationSectionProps {
  onSendCode: (email: string) => void;
  className?: string;
  error?: string;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
  onSendCode,
  className,
  error
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !isValidEmail) {
      console.log('Invalid email:', email);
      return;
    }
    
    console.log('Sending email to parent:', email);
    // Parent component ke function ko call करना
    onSendCode(email);
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        VERIFY YOUR EMAIL ADDRESS
      </h2>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className='firstVerifyScreen w-[609px] mx-auto group'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            placeholder="Enter your email..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValidEmail}
          className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
        >
          SEND VERIFICATION CODE
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
        )}
      </form>
    </div>
  );
};

export default EmailVerificationSection;