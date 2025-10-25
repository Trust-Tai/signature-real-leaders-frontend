"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/toast';
import { ArrowLeft, Camera, Save, Eye, EyeOff, ChevronDown, Upload, HelpCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserProfileSidebar, UserProfileDropdown, useUser } from '@/components';
import Image from 'next/image';
import { OnboardingProvider } from '@/components/OnboardingContext';
import { api } from '@/lib/api';
import { 
  FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaLinkedin, FaFacebook, FaPodcast, FaBlog, FaHandshake, FaHeart, FaXTwitter
} from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { images } from '@/assets';
import DashBoardFooter from '@/components/ui/dashboardFooter';

const ProfilePage = () => {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [informationData, setInformationData] = useState<{ firstName: string; lastName: string; companyName: string; companyWebsite: string; industry: string; numberOfEmployees: string; contactEmailListSize: string; about: string } | null>(null);
  const [metricsData, setMetricsData] = useState<{ numberOfBookings: string; emailListSize: string; amountInSales: string; amountInDonations: string } | null>(null);
  const [links, setLinks] = useState<Array<{ name: string; url: string }> | null>(null);
  const [newsletter, setNewsletter] = useState<{ provider: string; apiKey?: string; clientId?: string; clientSecret?: string } | null>(null);
  
  // Links section state
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [itemValues, setItemValues] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherLabel, setOtherLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Newsletter section state
  const [newsletterProvider, setNewsletterProvider] = useState<"Mailchimp" | "HubSpot" | "">("");
  const [newsletterApiKey, setNewsletterApiKey] = useState("");
  const [newsletterClientId, setNewsletterClientId] = useState("");
  const [newsletterClientSecret, setNewsletterClientSecret] = useState("");
  const [showNewsletterApiKey, setShowNewsletterApiKey] = useState(false);
  const [showNewsletterClientSecret, setShowNewsletterClientSecret] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [availableServices, setAvailableServices] = useState<Record<string, string> | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Signature section state
  const [signatureFormData, setSignatureFormData] = useState({
    signature: null,
    confirmInfo: false,
    giveConsent: false,
    agreeTerms: false,
    uploadedImage: null,
    signatureFile: null,
    uploadedImageFile: null
  });
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Suggested items for links
  const suggestedItems: { label: string; icon: React.ReactNode; placeholder?: string }[] = [
    { label: 'Work With Me', icon: <FaHandshake style={{ color: '#1CA235' }} />, placeholder: 'https://your-website.com/work-with-me' },
    { label: 'Donations', icon: <FaHeart style={{ color: '#e74c3c' }} />, placeholder: 'https://donate.example.com/your-handle' },
    { label: 'Podcast', icon: <FaPodcast style={{ color: '#8e44ad' }} />, placeholder: 'https://podcasts.apple.com/...' },
    { label: 'Instagram', icon: <FaInstagram style={{ color: '#E4405F' }} />, placeholder: 'https://instagram.com/yourhandle' },
    { label: 'TikTok', icon: <FaTiktok style={{ color: '#000000' }} />, placeholder: 'https://tiktok.com/@yourhandle' },
    { label: 'YouTube', icon: <FaYoutube style={{ color: '#FF0000' }} />, placeholder: 'https://youtube.com/@yourchannel' },
    { label: 'Spotify', icon: <FaSpotify style={{ color: '#1DB954' }} />, placeholder: 'https://open.spotify.com/show/...' },
    { label: 'LinkedIn', icon: <FaLinkedin style={{ color: '#0077B5' }} />, placeholder: 'https://linkedin.com/in/yourhandle' },
    { label: 'Twitter/X', icon: <FaXTwitter style={{ color: '#000000' }} />, placeholder: 'https://x.com/yourhandle' },
    { label: 'Facebook', icon: <FaFacebook style={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/yourpage' },
    { label: 'Blog', icon: <FaBlog style={{ color: '#FF6B35' }} />, placeholder: 'https://your-website.com/blog' },
    { label: 'Maps', icon: <FaMapMarkedAlt style={{ color: '#34A853' }} />, placeholder: 'https://maps.app.goo.gl/...' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSuggested = (label: string) => {
    const next = new Set(expandedItems);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    setExpandedItems(next);
  };

  const setSuggestedValue = (label: string, value: string) => {
    setItemValues(prev => ({ ...prev, [label]: value }));
  };

  // Update links state when form inputs change
  useEffect(() => {
    const processedLinks = Object.entries(itemValues)
      .filter(([, url]) => url && url.trim() !== '')
      .map(([name, url]) => ({ name, url: url.trim() }));
    setLinks(processedLinks);
  }, [itemValues]);

  const handleOtherSubmit = () => {
    if (otherLabel.trim() && !expandedItems.has(otherLabel.trim())) {
      const newExpanded = new Set(expandedItems);
      newExpanded.add(otherLabel.trim());
      setExpandedItems(newExpanded);
      setOtherLabel('');
      setShowOtherInput(false);
    }
  };

  // Newsletter verification function
  const verifyNewsletterCredentials = async () => {
    setVerificationStatus("verifying");
    try {
      let requestBody: Record<string, string> = {};
      
      if (newsletterProvider === "Mailchimp") {
        if (!newsletterApiKey.trim()) {
          throw new Error("API Key is required");
        }
        requestBody = { service: "mailchimp", api_key: newsletterApiKey };
      } else if (newsletterProvider === "HubSpot") {
        if (!newsletterClientId.trim() || !newsletterClientSecret.trim()) {
          throw new Error("Both Client ID and Client Secret are required");
        }
        requestBody = { service: "hubspot", client_id: newsletterClientId, client_secret: newsletterClientSecret };
      }

      const data = await api.verifyNewsletterCredentials(requestBody);
      if (data.success) {
        setVerificationStatus("success");
        toast.success(data.message || "Credentials verified successfully!");
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (error) {
      setVerificationStatus("error");
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      toast.error(errorMessage);
    }
  };

  // Load available newsletter services
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setServicesLoading(true);
        const res = await api.getNewsletterServices();
        if (mounted) setAvailableServices(res.newsletter_services || {});
      } catch {
        // ignore, UI will fallback
      } finally {
        if (mounted) setServicesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Signature handling functions
  const handleSignatureInputChange = (field: string, value: string | boolean | string | null | File) => {
    setSignatureFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureUploadClick = () => {
    signatureFileInputRef.current?.click();
  };

  const handleSignatureFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Process the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        handleSignatureInputChange('uploadedImage', imageDataUrl);
        handleSignatureInputChange('uploadedImageFile', file);
        console.log('Image uploaded successfully:', file.name);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const setupSignatureCanvasForDpr = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const needResize = canvas.width !== Math.max(1, Math.floor(rect.width * dpr)) || canvas.height !== Math.max(1, Math.floor(rect.height * dpr));
    if (needResize) {
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
    }
  };

  useEffect(() => {
    setupSignatureCanvasForDpr();
    const onResize = () => setupSignatureCanvasForDpr();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }
    };
  }, []);

  const getSignatureCanvasPos = (clientX: number, clientY: number) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startSignatureDrawing = (clientX: number, clientY: number) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getSignatureCanvasPos(clientX, clientY);
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const drawSignature = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getSignatureCanvasPos(clientX, clientY);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endSignatureDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    // Save drawn signature as data URL and convert to File
    try {
      const dataUrl = canvas.toDataURL('image/png');
      handleSignatureInputChange('signature', dataUrl);
      
      // Convert dataURL to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'signature.png', { type: 'image/png' });
          handleSignatureInputChange('signatureFile', file);
          console.log('Signature converted to file:', file.name, file.size, 'bytes');
        }
      }, 'image/png');
    } catch (error) {
      console.warn('Unable to export signature image:', error);
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleSignatureInputChange('signature', null);
    handleSignatureInputChange('signatureFile', null);
    setHasDrawn(false);
  };

  // Touch event handlers with preventDefault to stop scrolling
  const handleSignatureTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    startSignatureDrawing(touch.clientX, touch.clientY);
  };

  const handleSignatureTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    drawSignature(touch.clientX, touch.clientY);
  };

  const handleSignatureTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent any default behavior
    endSignatureDrawing();
  };

  // Initialize form data from user context
  useEffect(() => {
    if (user) {
      setBio(user.audience_description || '');
      setProfileImage(user.profile_picture_url || null);
      setInformationData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        companyName: user.company_name || '',
        companyWebsite: user.company_website || '',
        industry: user.industry || '',
        numberOfEmployees: user.num_employees || '',
        contactEmailListSize: user.email_list_size || '',
        about: user.audience_description || '',
      });
      setMetricsData(user.success_metrics || {
        numberOfBookings: '',
        emailListSize: '',
        amountInSales: '',
        amountInDonations: '',
      });
      setLinks(user.links || []);
      
      // Initialize form state from existing links
      if (user.links && user.links.length > 0) {
        const initialItemValues: Record<string, string> = {};
        const initialExpandedItems = new Set<string>();
        
        user.links.forEach(link => {
          initialItemValues[link.name] = link.url;
          initialExpandedItems.add(link.name);
        });
        
        setItemValues(initialItemValues);
        setExpandedItems(initialExpandedItems);
      }
      
      setNewsletter({
        provider: user.newsletter_service || '',
      });
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication token not found');
        router.push('/login');
        return;
      }

      const response = await api.updateProfile(token, {
        audience_description: bio,
        profilePicture: profileImage || '',
      });

      if (response.success) {
        toast.success(response.message);
        updateUser({ 
          audience_description: bio,
          profile_picture_url: profileImage || undefined 
        });
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication token not found');
        router.push('/login');
        return;
      }

      const updateData: Record<string, unknown> = {};
      
      if (informationData) {
        updateData.first_name = informationData.firstName;
        updateData.last_name = informationData.lastName;
        updateData.company_name = informationData.companyName;
        updateData.company_website = informationData.companyWebsite;
        updateData.industry = informationData.industry;
        updateData.num_employees = informationData.numberOfEmployees;
        updateData.email_list_size = informationData.contactEmailListSize;
        updateData.audience_description = informationData.about;
      }

      if (metricsData) {
        updateData.success_metrics = metricsData;
      }

      if (links) {
        updateData.links = links;
      }

      if (newsletter) {
        updateData.newsletter_service = newsletter.provider;
      }

      const response = await api.updateProfile(token, updateData);

      if (response.success) {
        toast.success(response.message);
        updateUser(updateData);
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication token not found');
        router.push('/login');
        return;
      }

      const response = await api.updatePassword(token, currentPassword, newPassword);

      if (response.success) {
        toast.success(response.message);
        // Reset password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password');
      }
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingProvider>
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Custom CSS for dropdown content styling */}
      <style jsx>{`
        /* Force select color with multiple selectors */
        select,
        select.select-custom-color,
        select.firstVerifyScreenInput {
          color: #949494 !important;
          -webkit-text-fill-color: #949494 !important;
        }
        
        /* Style the dropdown list content (options) */
        select option {
          background-color: #fef2f2 !important;
          color: #949494 !important;
          font-family: 'Outfit', sans-serif !important;
          padding: 12px 16px !important;
          border: 2px solid #CF323240 !important;
          border-radius: 8px !important;
          margin: 2px 0 !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        
        select option:hover {
          background-color: #CF323240 !important;
          color: white !important;
        }
        
        select option:checked {
          background-color: #CF3232 !important;
          color: white !important;
          font-weight: 500 !important;
        }
        
        select option:focus {
          background-color: #CF323240 !important;
          color: white !important;
        }
      `}</style>
      {/* Sidebar */}
      <UserProfileSidebar 
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        currentPage="profile"
      />

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 border-b border-[#efc0c0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
              onClick={()=>router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </div>
              <h1 className="text-xl font-outift font-semibold text-[#333333]">Profile Settings</h1>
            </div>
            
            <UserProfileDropdown />
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-outift font-semibold text-[#333333] mb-4">Profile Image</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#efc0c0] overflow-hidden">
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      alt="Profile" 
                      width={96}
                       unoptimized
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#CF3232] text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile image. Recommended size: 256x256 pixels.
                </p>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Image'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Information Section (from verification) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Your Information</h2>
            
            {/* Inline Information Form */}
            <div className="space-y-6">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                <div className='firstVerifyScreen group'>
                  <input
                    type="text"
                    value={informationData?.firstName || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, firstName: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                    style={{ color: '#949494' }}
                    placeholder="First Name"
                  />
                </div>
                <div className='firstVerifyScreen group'>
                  <input
                    type="text"
                    value={informationData?.lastName || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, lastName: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                    style={{ color: '#949494' }}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Row 2: Company Name & Company Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                <div className='firstVerifyScreen group'>
                  <input
                    type="text"
                    value={informationData?.companyName || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, companyName: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                    style={{ color: '#949494' }}
                    placeholder="Company Name"
                  />
                </div>
                <div className='firstVerifyScreen group'>
                  <input
                    type="url"
                    value={informationData?.companyWebsite || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, companyWebsite: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                    style={{ color: '#949494' }}
                    placeholder="Company Website"
                  />
                </div>
              </div>

              {/* Row 3: Industry & Number of Employees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                <div className="relative firstVerifyScreen group">
                  <select
                    value={informationData?.industry || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, industry: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
                
                <div className="relative firstVerifyScreen group">
                  <select
                    value={informationData?.numberOfEmployees || ''}
                    onChange={(e) => setInformationData(prev => prev ? {...prev, numberOfEmployees: e.target.value} : null)}
                    className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Number of Employees</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
              </div>

              {/* Row 4: Contact Email List Size */}
              <div className="relative firstVerifyScreen group">
                <select
                  value={informationData?.contactEmailListSize || ''}
                  onChange={(e) => setInformationData(prev => prev ? {...prev, contactEmailListSize: e.target.value} : null)}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                >
                  <option value="">Contact email list size</option>
                  <option value="0-100">0-100</option>
                  <option value="101-500">101-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1001-5000">1001-5000</option>
                  <option value="5001-10000">5001-10000</option>
                  <option value="10000+">10000+</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              </div>

              <div className="firstVerifyScreen group" style={{height:"200px"}}>
                <textarea
                  value={informationData?.about || ''}
                  onChange={(e) => {
                    setInformationData(prev => prev ? {...prev, about: e.target.value} : null);
                    setBio(e.target.value);
                  }}
                  className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
                  style={{ color: '#949494',height:"180px" }}
                  placeholder="Tell us a little about yourself and what you do..."
                />
              </div>
            </div>
          </div>

          {/* Success Metrics Section (from verification) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Success Metrics</h2>
            
            {/* Inline Success Metrics Form */}
            <div className="space-y-6">
              {/* Row 1: Number of Bookings & Email List Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[16px]">
                <div className="relative firstVerifyScreen group" >
                  <select
                    value={metricsData?.numberOfBookings || ''}
                    onChange={(e) => setMetricsData(prev => prev ? {...prev, numberOfBookings: e.target.value} : null)}
                    className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Number of Bookings</option>
                    <option value="0-10">0-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
                
                <div className="relative firstVerifyScreen group" >
                  <select
                    value={metricsData?.emailListSize || ''}
                    onChange={(e) => setMetricsData(prev => prev ? {...prev, emailListSize: e.target.value} : null)}
                    className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Email List Size</option>
                    <option value="0-100">0-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1001-5000">1001-5000</option>
                    <option value="5001-10000">5001-10000</option>
                    <option value="10000+">10000+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
              </div>

              {/* Row 2: Amount in Sales & Amount in Donations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[16px]">
                <div className="relative firstVerifyScreen group" >
                  <select
                    value={metricsData?.amountInSales || ''}
                    onChange={(e) => setMetricsData(prev => prev ? {...prev, amountInSales: e.target.value} : null)}
                    className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Amount in Sales</option>
                    <option value="0-10k">$0 - $10K</option>
                    <option value="10k-50k">$10K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k-500k">$100K - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
                
                <div className="relative firstVerifyScreen group" >
                  <select
                    value={metricsData?.amountInDonations || ''}
                    onChange={(e) => setMetricsData(prev => prev ? {...prev, amountInDonations: e.target.value} : null)}
                    className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  >
                    <option value="">Amount in Donations</option>
                    <option value="0-1k">$0 - $1K</option>
                    <option value="1k-5k">$1K - $5K</option>
                    <option value="5k-10k">$5K - $10K</option>
                    <option value="10k-50k">$10K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k+">$100K+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </div>
              </div>
            </div>
          </div>

          {/* Links Section (from verification) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Your Links</h2>
            
            {/* Inline Links Form */}
            <div className="space-y-6">
              {/* Suggested items dropdown */}
              <div className="text-left space-y-4">
                <p className="font-outfit font-semibold text-gray-800">Add Your Links</p>
                
                {/* Custom styled dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-4 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-custom-red/30 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-custom-red/10 to-custom-red/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-custom-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">+ Add a link (select from suggestions)</span>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown options */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        {suggestedItems.map(({label, icon}) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              if (!expandedItems.has(label)) {
                                toggleSuggested(label);
                              }
                              setIsDropdownOpen(false);
                            }}
                            disabled={expandedItems.has(label)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                              expandedItems.has(label) 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-gray-50 hover:shadow-sm text-gray-700'
                            }`}
                          >
                            <span className="text-xl">{icon}</span>
                            <span className="font-medium">{label}</span>
                            {expandedItems.has(label) && (
                              <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                Added
                              </span>
                            )}
                          </button>
                        ))}
                        
                        {/* Other option */}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowOtherInput(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 hover:shadow-sm text-gray-700"
                          >
                            <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <span className="font-medium">Other (Custom)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other input inline */}
                {showOtherInput && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800">Custom Link</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={otherLabel}
                          onChange={(e) => setOtherLabel(e.target.value)}
                          placeholder="Enter link name (e.g., My Website, Portfolio)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300"
                          style={{ color: '#333333' }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleOtherSubmit}
                            disabled={!otherLabel.trim()}
                            className="flex-1 bg-custom-red text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-custom-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowOtherInput(false);
                              setOtherLabel('');
                            }}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected items with inputs */}
                {expandedItems.size > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">Your Links:</p>
                    {Array.from(expandedItems).map((label) => {
                      const item = suggestedItems.find(i => i.label === label);
                      const isCustomItem = !item; // Custom items won't be found in suggestedItems
                      return (
                        <div key={label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {isCustomItem ? (
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                </div>
                              ) : (
                                <span className="text-2xl">{item.icon}</span>
                              )}
                              <span className="font-medium text-gray-800">{label}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newExpanded = new Set(expandedItems);
                                newExpanded.delete(label);
                                setExpandedItems(newExpanded);
                                // Clear the value when removing
                                setSuggestedValue(label, '');
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <input
                            type="url"
                            value={itemValues[label] || ''}
                            onChange={(e) => setSuggestedValue(label, e.target.value)}
                            placeholder={isCustomItem ? 'Enter URL' : item?.placeholder || 'Enter URL'}
                            className="w-full px-3 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Newsletter Setup (from verification) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Newsletter Setup</h2>
            
            {/* Inline Newsletter Form */}
            <div className="space-y-6">
              {/* Step 1: Select Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Mailchimp Card */}
                <div
                  onClick={() => {
                    if (availableServices && !availableServices.mailchimp) return;
                    setNewsletterProvider("Mailchimp");
                    setVerificationStatus("idle");
                  }}
                  className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl relative ${
                    newsletterProvider === "Mailchimp"
                      ? "border-custom-red shadow-2xl -translate-y-2 bg-pink-50 scale-105"
                      : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-pink-50 hover:scale-105"
                  }`}
                >
                  {/* Info Icon - Top Right */}
                  <div className="absolute top-4 right-4 group">
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      How to find your Mailchimp API Key
                      <div className="absolute top-full right-4 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                    <a
                      href="https://mailchimp.com/developer/marketing/guides/quick-start/#generate-your-api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-20"
                      onClick={(e) => e.stopPropagation()}
                    ></a>
                  </div>
                  
                  <Image alt="" src={images.mailchimpIcon} width={48} height={48} />
                  <h3 className="font-outfit text-xl font-bold text-[#333333]">Mailchimp {servicesLoading ? '(...)' : ''}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Connect via API Key
                  </p>
                  {availableServices && !availableServices.mailchimp && (
                    <p className="text-xs text-gray-500">Not available</p>
                  )}
                </div>

                {/* HubSpot Card */}
                <div
                  onClick={() => {
                    if (availableServices && !availableServices.hubspot) return;
                    setNewsletterProvider("HubSpot");
                    setVerificationStatus("idle");
                  }}
                  className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl relative ${
                    newsletterProvider === "HubSpot"
                      ? "border-custom-red shadow-2xl -translate-y-2 bg-blue-50 scale-105"
                      : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-blue-50 hover:scale-105"
                  }`}
                >
                  {/* Info Icon - Top Right */}
                  <div className="absolute top-4 right-4 group">
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      How to find your HubSpot credentials
                      <div className="absolute top-full right-4 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                    <a
                      href="https://developers.hubspot.com/docs/api/private-apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-20"
                      onClick={(e) => e.stopPropagation()}
                    ></a>
                  </div>
                  
                  <Image src={images.hubspotIcon} alt="" width={48} height={48} />
                  <h3 className="font-outfit text-xl font-bold text-[#333333]">HubSpot {servicesLoading ? '(...)' : ''}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Connect via Client ID and Client Secret
                  </p>
                  {availableServices && !availableServices.hubspot && (
                    <p className="text-xs text-gray-500">Not available</p>
                  )}
                </div>
              </div>

             

              {/* Step 2: Form (visible only after provider selection) */}
              {newsletterProvider && (
                <div className="space-y-5">
                  {newsletterProvider === "Mailchimp" && (
                    <div className="firstVerifyScreen group">
                      <div className="relative w-full">
                        <input
                          type={showNewsletterApiKey ? "text" : "password"}
                          value={newsletterApiKey}
                          onChange={(e) => setNewsletterApiKey(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: "#949494" }}
                          placeholder="Mailchimp API Key"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewsletterApiKey(!showNewsletterApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewsletterApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {newsletterProvider === "HubSpot" && (
                    <>
                      <div className="firstVerifyScreen group">
                        <input
                          type="text"
                          value={newsletterClientId}
                          onChange={(e) => setNewsletterClientId(e.target.value)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: "#949494" }}
                          placeholder="HubSpot Client ID"
                          required
                        />
                      </div>
                      <div className="firstVerifyScreen group">
                        <div className="relative w-full">
                          <input
                            type={showNewsletterClientSecret ? "text" : "password"}
                            value={newsletterClientSecret}
                            onChange={(e) => setNewsletterClientSecret(e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                            style={{ color: "#949494" }}
                            placeholder="HubSpot Client Secret"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewsletterClientSecret(!showNewsletterClientSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewsletterClientSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Verify Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={verifyNewsletterCredentials}
                      disabled={verificationStatus === "verifying"}
                      className="custom-btn !px-6 !py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      {verificationStatus === "verifying" && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {verificationStatus === "verifying" ? "Verifying..." : "Verify Credentials"}
                    </button>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="submit"
                      onClick={() => {
                        if (verificationStatus !== "success") {
                          toast.error("Please verify your credentials before proceeding");
                          return;
                        }
                        if (newsletterProvider === "Mailchimp") {
                          setNewsletter({ provider: newsletterProvider, apiKey: newsletterApiKey || undefined });
                        } else if (newsletterProvider === "HubSpot") {
                          setNewsletter({ provider: newsletterProvider, clientId: newsletterClientId || undefined, clientSecret: newsletterClientSecret || undefined });
                        }
                        toast.success('Newsletter settings saved');
                      }}
                      disabled={verificationStatus !== "success"}
                      className="custom-btn !px-6 !py-2 bg-custom-red hover:bg-custom-red disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      {verificationStatus === "success" ? 'Save & Continue' : 'Verify to Continue'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewsletter({ provider: "Skipped" })}
                      className="custom-btn !px-6 !py-2 bg-custom-red hover:bg-custom-red transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signature (from verification) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Signature</h2>
            
            {/* Inline Signature Form */}
            <div className="space-y-6">
              {/* Signature Input Container */}
              <div className="relative mx-auto w-full max-w-2xl group" style={{ height: '186px' }}>
                {/* Conditional Rendering: Draw box (canvas) or Image Display */}
                {signatureFormData.uploadedImage ? (
                  /* Show uploaded image */
                  <div 
                    className="w-full h-full flex items-center justify-center bg-white relative transform hover:scale-[1.02] transition-all duration-300"
                    style={{ 
                      border: '10px solid #CF323240',
                      borderRadius: '6px'
                    }}
                  >
                    <Image 
                      src={signatureFormData.uploadedImage}
                      alt="Uploaded signature"
                      className="max-w-full max-h-full object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      width={400}
                      height={186}
                    />
                    {/* Clear/Remove image button */}
                    <button
                      onClick={() => {
                        handleSignatureInputChange('uploadedImage', null);
                        handleSignatureInputChange('uploadedImageFile', null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  /* Draw on box */
                  <div className='firstVerifyScreen' style={{height:185, position: 'relative'}}>
                    <canvas
                      ref={signatureCanvasRef}
                      className="w-full h-full bg-white rounded-[6px] transition-all duration-300 group-hover:shadow-lg"
                      style={{ touchAction: 'none' }} // Disable touch scrolling on canvas
                      onMouseDown={(e) => startSignatureDrawing(e.clientX, e.clientY)}
                      onMouseMove={(e) => drawSignature(e.clientX, e.clientY)}
                      onMouseUp={endSignatureDrawing}
                      onMouseLeave={endSignatureDrawing}
                      onTouchStart={handleSignatureTouchStart}
                      onTouchMove={handleSignatureTouchMove}
                      onTouchEnd={handleSignatureTouchEnd}
                      onTouchCancel={endSignatureDrawing} // Handle touch cancel events
                    />
                    {/* Clear canvas button */}
                    {hasDrawn && (
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="absolute top-2 right-2 rounded px-2 py-1 text-xs transition-all duration-300 transform hover:scale-110"
                        style={{ backgroundColor: '#CF3232', color: '#FFFFFF' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={signatureFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureFileUpload}
                  className="hidden"
                />

                {/* Upload Button - Bottom Right */}
                <button 
                  onClick={handleSignatureUploadClick}
                  className="absolute bottom-5 right-5 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm transform hover:scale-105 hover:-translate-y-1"
                >
                  <Upload size={16} color="#8B8B8B" />
                  <span className="text-sm text-gray-600 font-outfit">Upload</span>
                </button>
              </div>

 

            

            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-outift text-[#333333] mb-2">
                  Current Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 pr-10 font-outift font-regular border border-[#cf323240]  focus:outline-none focus:ring-0 focus:border-[#efc0c0]"
                    placeholder="Enter current password"
                    style={{ color: '#949494', height: '70px', fontSize:18 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-outfit text-[#333333] mb-2">
                  New Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-10 font-outift font-regular border border-[#cf323240] focus:outline-none focus:ring-0 focus:border-[#efc0c0]"
                    placeholder="Enter new password"
                    style={{ color: '#949494', height: '70px', fontSize:18}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-outift text-[#333333] mb-2">
                  Confirm New Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 font-outift font-regular border border-[#cf323240]  focus:outline-none focus:ring-0 focus:border-[#efc0c0]" 
                    placeholder="Confirm new password"
                    style={{ color: '#949494', height: '70px',fontSize:18 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Changing Password...' : 'Change Password'}</span>
              </button>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Note:</h3>
            <p className="text-sm font-outift font-regular text-[#333333]">
              You can only change your profile image, bio, and password. Your name and title cannot be modified.
            </p>
            <div className="mt-4">
              <button
                onClick={handleSaveAll}
                disabled={isLoading}
                className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <DashBoardFooter />
      </div>
    </div>
    </OnboardingProvider>
  );
};

export default ProfilePage;
