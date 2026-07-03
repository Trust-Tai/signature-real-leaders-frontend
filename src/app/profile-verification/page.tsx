'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { LoadingScreen } from '@/components';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import SocialLoginButtons from '@/components/ui/SocialLoginButtons';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { ChevronDown, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { trackProfileVerificationSuccess, trackProfileVerificationStart } from '@/lib/conversionTracking';

interface VerificationFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  occupation: string;
  phone: string;
  industry: string;
  numberOfEmployees: string;
  about: string;
}

const INPUT_CLASS =
  'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500';

const industryOptions = [
  'Construction',
  'Energy & Facilities',
  'Consumer Packed Goods (CPG)',
  'Education/Training',
  'Fashion/Apparel',
  'Financial services',
  'Food & Beverage (Non-CPG)',
  'Healthcare',
  'Home & Lifestyle',
  'Insurance',
  'Manufacturing/Industrial',
  'Marketing & Media',
  'Membership/Community',
  'Personal Care & Wellness',
  'Professional/Advisory and Consulting Services',
  'Real Estate',
  'Social Enterprise & Education',
  'Staffing/Recruiting',
  'Travel and Hospitality',
  'Technology',
];

const isCustomIndustry = (industry: string) =>
  !!industry && !industryOptions.includes(industry) && industry !== 'Other' && industry !== '';

const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const InnerProfileVerificationPage = () => {
  // Email / verification state
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isSocialUser, setIsSocialUser] = useState(false);

  // Loading state
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Profile / info form
  const [formData, setFormData] = useState<VerificationFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    occupation: '',
    phone: '',
    industry: '',
    numberOfEmployees: '',
    about: '',
  });
  const [customIndustry, setCustomIndustry] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [socialPicUrl, setSocialPicUrl] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field: keyof VerificationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* =========================
     MOUNT: tracking + social callback
  ========================= */
  useEffect(() => {
    trackProfileVerificationStart();
  }, []);

  useEffect(() => {
    const handleSocialCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const tempToken = urlParams.get('token');
      const message = urlParams.get('message');
      const accountStatus = urlParams.get('account_status');
      const isLoggedIn = urlParams.get('is_logged_in');

      if (status === 'success' && tempToken) {
        try {
          setLoading(true);
          const response = await api.getUserDetailsWithToken(tempToken);

          if (response.success && response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
            localStorage.setItem('user_id', response.user.id.toString());

            toast.success(message || 'Authentication successful!');

            if (response.user.account_status === 'approved' || isLoggedIn === '1') {
              window.location.href = '/dashboard';
              return;
            }

            // Pending review / new social user - move straight into the info form
            setAuthToken(response.token);
            setEmail(response.user.email || '');
            setVerified(true);
            setIsSocialUser(
              response.user.account_status === 'pending_review' || accountStatus === 'pending_review'
            );
            setFormData((prev) => ({
              ...prev,
              firstName: response.user.first_name || '',
              lastName: response.user.last_name || '',
            }));
            if (response.user.profile_picture_url) {
              setSocialPicUrl(response.user.profile_picture_url);
              setImagePreview(response.user.profile_picture_url);
            }
            window.history.replaceState({}, document.title, '/profile-verification');
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to complete authentication';
          toast.error(errorMsg);
          window.history.replaceState({}, document.title, '/profile-verification');
        } finally {
          setLoading(false);
        }
      } else if (status === 'failed') {
        toast.error(message || 'Authentication failed');
        window.history.replaceState({}, document.title, '/profile-verification');
      }
    };

    void handleSocialCallback();
  }, []);

  /* =========================
     EMAIL + OTP
  ========================= */
  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValidEmail) return;

    try {
      setSendingCode(true);
      const res = await api.sendVerificationCode(email);

      if (res.code === 'sent_email') {
        setShowOtp(true);
        toast.info(res.message || 'Verification code sent to your email');
      } else if (res.code === 'email_exists') {
        toast.warning(res.message || 'Email already exists', { id: 'email-exists' });
      } else {
        toast.error(res.message || 'Failed to send code');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async (fullCode: string) => {
    try {
      setSendingCode(true);
      const res = await api.verifyCode(email, fullCode);

      if (res.success && res.auth_token) {
        setAuthToken(res.auth_token);
        localStorage.setItem('auth_token', res.auth_token);
        setVerified(true);
        toast.success('Email verified. Please complete your profile.');
      } else {
        toast.error(res.message || 'Invalid code');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setSendingCode(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '') && next.join('').length === 6) {
      void verifyCode(next.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    pasted.split('').forEach((d, i) => {
      if (index + i < 6) next[index + i] = d;
    });
    setCode(next);
    otpRefs.current[Math.min(index + pasted.length, 5)]?.focus();
    if (next.every((d) => d !== '')) void verifyCode(next.join(''));
  };

  /* =========================
     SOCIAL LOGIN
  ========================= */
  const handleSocialLogin = (provider: 'google' | 'apple' | 'linkedin') => {
    const redirectUrl = `${window.location.origin}/profile-verification`;
    if (provider === 'google') {
      api.initiateGoogleAuth(redirectUrl);
    } else if (provider === 'linkedin') {
      api.initiateLinkedInAuth(redirectUrl);
    } else {
      toast.info('Apple login will be implemented soon', { id: 'social-login-info' });
    }
  };

  /* =========================
     PROFILE IMAGE
  ========================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setProfileImage(file);
    setSocialPicUrl(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setSocialPicUrl(null);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required: (keyof VerificationFormData)[] = [
      'firstName',
      'lastName',
      'companyName',
      'companyWebsite',
      'occupation',
      'phone',
      'industry',
      'numberOfEmployees',
      'about',
    ];
    if (required.some((f) => !formData[f].trim())) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = authToken || localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Authentication token missing. Please verify your email again.');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();

      const userId = localStorage.getItem('user_id');
      if (userId) fd.append('user_id', userId);

      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('email', email);
      fd.append('companyName', formData.companyName);
      fd.append('companyWebsite', formData.companyWebsite);
      fd.append('industry', formData.industry);
      fd.append('numEmployees', formData.numberOfEmployees);
      fd.append('about', formData.about);
      fd.append('occupation', formData.occupation);
      fd.append('billing_phone', formData.phone);

      if (profileImage) {
        fd.append('profilePicture', profileImage);
      } else if (socialPicUrl) {
        fd.append('profilePictureUrl', socialPicUrl);
      }

      const result = isSocialUser
        ? await api.updateProfileWithFiles(token, fd)
        : await api.submitUserInfoWithFiles(token, fd);

      localStorage.removeItem('auth_token');
      localStorage.removeItem('temp_auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');

      if (result.success) {
        trackProfileVerificationSuccess();
        toast.success('Profile submitted successfully! Awaiting admin review.');
        setSubmitted(true);
      } else {
        toast.error(result.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !verified) {
    return <LoadingScreen text1="Processing authentication..." />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Become a Verified <span className="text-red-500">Real Leader</span>
            </h1>
            <p className="text-gray-400 text-sm">
              {submitted
                ? 'Your application has been submitted.'
                : 'Verify your email and complete the form below.'}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {submitted ? (
              /* ===== SUCCESS ===== */
              <div className="text-center py-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Application submitted</h2>
                <p className="text-gray-400 text-sm">
                  Your account is pending review. You&apos;ll be notified by email once it&apos;s approved.
                </p>
              </div>
            ) : (
              /* ===== SINGLE FORM ===== */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email + inline Verify */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Email Address *</label>
                  <div className="flex gap-2 items-stretch">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !verified) {
                          e.preventDefault();
                          handleSendCode();
                        }
                      }}
                      className={`${INPUT_CLASS} flex-1`}
                      placeholder="your@email.com"
                      required
                      disabled={verified || sendingCode}
                    />
                    {verified ? (
                      <span className="inline-flex items-center gap-1 px-4 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium whitespace-nowrap">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendCode()}
                        disabled={!isValidEmail || sendingCode}
                        className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold text-sm whitespace-nowrap transition-colors duration-200"
                      >
                        {sendingCode ? '...' : showOtp ? 'Resend' : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Code input (below email, after Verify is clicked) */}
                {showOtp && !verified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Enter the 6-digit code sent to your email
                    </label>
                    <div className="flex gap-2 sm:gap-3">
                      {code.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={(e) => handleOtpPaste(e, index)}
                          disabled={sendingCode}
                          className="w-full h-12 sm:h-14 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      {sendingCode ? 'Verifying...' : 'The code verifies automatically once all 6 digits are entered.'}
                    </p>
                  </div>
                )}

                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Profile Headshot (Optional)</label>
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  ) : (
                    <div className="relative w-full">
                      <div className="relative w-32 h-32 mx-auto">
                        <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover rounded-lg border-2 border-gray-300" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">First Name *</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={INPUT_CLASS} placeholder="Enter first name" required />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">Last Name *</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={INPUT_CLASS} placeholder="Enter last name" required />
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-200 mb-2">Company Name *</label>
                  <input type="text" id="companyName" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} className={INPUT_CLASS} placeholder="Enter company name" required />
                </div>

                {/* Company Website */}
                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-200 mb-2">Company Website *</label>
                  <input type="url" id="companyWebsite" value={formData.companyWebsite} onChange={(e) => handleInputChange('companyWebsite', e.target.value)} className={INPUT_CLASS} placeholder="https://example.com" required />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-200 mb-2">Role *</label>
                  <input type="text" id="occupation" value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)} className={INPUT_CLASS} placeholder="e.g. CEO, Founder" required />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">Phone *</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={INPUT_CLASS} placeholder="Enter phone number" required />
                </div>

                {/* Number of Employees */}
                <div>
                  <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-200 mb-2">Number of Employees *</label>
                  <div className="relative">
                    <select
                      id="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                      className={`${INPUT_CLASS} appearance-none pr-10`}
                      required
                    >
                      <option value="">Select an option</option>
                      {employeeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-200 mb-2">Industry *</label>
                    <div className="relative">
                      <select
                        id="industry"
                        value={isCustomIndustry(formData.industry) ? 'Other' : formData.industry}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            handleInputChange('industry', 'Other');
                            if (!customIndustry && isCustomIndustry(formData.industry)) setCustomIndustry(formData.industry);
                          } else {
                            handleInputChange('industry', e.target.value);
                            setCustomIndustry('');
                          }
                        }}
                        className={`${INPUT_CLASS} appearance-none pr-10`}
                        required
                      >
                        <option value="">Select Industry</option>
                        {industryOptions.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>
                  </div>

                  {(formData.industry === 'Other' || isCustomIndustry(formData.industry)) && (
                    <input
                      type="text"
                      value={customIndustry || (isCustomIndustry(formData.industry) ? formData.industry : '')}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      onBlur={() => {
                        if (customIndustry.trim()) handleInputChange('industry', customIndustry.trim());
                      }}
                      className={INPUT_CLASS}
                      placeholder="Enter your industry"
                    />
                  )}
                </div>

                {/* About */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-200 mb-2">About *</label>
                  <textarea id="about" value={formData.about} onChange={(e) => handleInputChange('about', e.target.value)} className={`${INPUT_CLASS} resize-none min-h-[120px]`} placeholder="Tell us a little about yourself and what you do..." required />
                </div>

                <button
                  type="submit"
                  disabled={loading || !verified}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-6"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                {!verified && (
                  <p className="text-center text-gray-500 text-xs">Verify your email above to enable submission.</p>
                )}

                {/* Divider + Social login */}
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-500 text-xs">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <SocialLoginButtons
                  onGoogleLogin={() => handleSocialLogin('google')}
                  onAppleLogin={() => handleSocialLogin('apple')}
                  onLinkedInLogin={() => handleSocialLogin('linkedin')}
                  isLoading={sendingCode}
                />

                <p className="text-center text-gray-500 text-sm pt-1">
                  Already a member?{' '}
                  <Link href="/login" className="text-red-500 hover:text-red-400 font-medium underline">
                    Login here
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Interactive Magazine Cards */}
      <div className="hidden lg:block w-1/2">
        <InteractiveMagazineCards />
      </div>

      {/* Custom styles for the dropdowns */}
      <style jsx global>{`
        select option {
          background-color: white !important;
          color: black !important;
          padding: 8px 12px !important;
        }
        select option:hover {
          background-color: #fee2e2 !important;
        }
        select option:checked {
          background-color: #ef4444 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

const ProfileVerificationPage = () => (
  <Suspense fallback={<LoadingScreen text1="Loading..." />}>
    <InnerProfileVerificationPage />
  </Suspense>
);

export default ProfileVerificationPage;
