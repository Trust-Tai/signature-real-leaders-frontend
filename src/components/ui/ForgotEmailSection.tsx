'use client'
import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

interface ForgotEmailSectionProps {
  onBack: () => void;
}

const ForgotEmailSection: React.FC<ForgotEmailSectionProps> = ({ onBack }) => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call for email recovery
    setTimeout(() => {
      setIsSubmitting(false);
      // You can add actual API call here
      alert('If this email exists in our system, you will receive recovery instructions.');
    }, 2000);
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-white transition-colors font-outfit"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-4">Forgot your email?</h1>
        <p className="text-white text-sm font-outfit">
          Enter any information you remember about your account, and we&apos;ll help you recover your email address.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-white" size={16} />
            <span className="text-sm font-medium text-white font-outfit">
              Phone Number or Partial Email
            </span>
          </div>
          <div className="firstVerifyScreen mx-auto group">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              placeholder="Enter phone number or partial email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-custom-red hover:bg-custom-red/90 disabled:bg-custom-red/70 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Searching...
            </>
          ) : (
            'Recover Email'
          )}
        </button>
      </form>
    </>
  );
};

export default ForgotEmailSection;