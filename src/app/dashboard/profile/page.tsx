"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/toast';
import { ArrowLeft, Camera, Save, Eye, EyeOff, ChevronDown, Upload, HelpCircle, Loader2, Plus, Trash2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserProfileSidebar, UserProfileDropdown, useUser, ProfileReadyModal } from '@/components';
import Image from 'next/image';
import { OnboardingProvider } from '@/components/OnboardingContext';
import { api } from '@/lib/api';
import {
  FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaLinkedin, FaFacebook, FaPodcast, FaBlog, FaHandshake, FaHeart, FaXTwitter
} from 'react-icons/fa6';
import { FaMapMarkedAlt, FaRss } from 'react-icons/fa';
import { images } from '@/assets';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { countries } from '@/default/countries';

const ProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser } = useUser();
  
  // Multi-Step State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Check URL for step parameter
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (stepNumber >= 1 && stepNumber <= totalSteps) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);
  
  // Existing state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [informationData, setInformationData] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    date_of_birth: string;
    occupation: string;
    companyName: string;
    companyWebsite: string;
    rss_feed_url: string;
    industry: string;
    numberOfEmployees: string;
    contactEmailListSize: string;
    about: string;
    billing_address_1: string;
    billing_address_2: string;
    billing_city: string;
    billing_postcode: string;
    billing_country: string;
    billing_phone: string;
    brand_voice: string;
    unique_differentiation: string;
    top_pain_points: string;
    primary_call_to_action: string;
    content_preference_industry: string[];
  } | null>(null);
  const [metricsData, setMetricsData] = useState<{ numberOfBookings: string; emailListSize: string; amountInSales: string; amountInDonations: string } | null>(null);
  const [links, setLinks] = useState<Array<{ name: string; url: string }> | null>(null);
  const [targetAudience, setTargetAudience] = useState<Array<{ role: string; ageRange: string; demographics: string }>>([
    { role: '', ageRange: '', demographics: '' }
  ]);

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
    signature: null as string | null,
    uploadedImage: null as string | null | false, // false means user cleared the signature
    signatureFile: null as File | null,
    uploadedImageFile: null as File | null
  });
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState(false);
    const [customContentPreference, setCustomContentPreference] = useState('');
  const [customIndustries, setCustomIndustries] = useState<string[]>([]);
  // Signature consent checkboxes
  const [consentFeatureName, setConsentFeatureName] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Profile Ready Modal state
  const [showProfileReadyModal, setShowProfileReadyModal] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState<{
    full_name?: string;
    username?: string;
    profile_picture_url?: string;
    profile_template?: { id?: number };
    [key: string]: unknown;
  } | null>(null);
  const [confirmInfoAccurate, setConfirmInfoAccurate] = useState(true);

  // Template section state
  const [templates, setTemplates] = useState<Array<{ id: number; title: string; slug: string; image_url: string }>>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Webhook URLs state
  const [webhookUrls, setWebhookUrls] = useState<string[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  // Custom industry state
  const [customIndustry, setCustomIndustry] = useState('');

  // Industry options list
  const industryOptions = [
    "Construction",
    "Energy & Facilities",
    "Consumer Packed Goods (CPG)",
    "Education/Training",
    "Fashion/Apparel",
    "Financial services",
    "Food & Beverage (Non-CPG)",
    "Healthcare",
    "Home & Lifestyle",
    "Insurance",
    "Manufacturing/Industrial",
    "Marketing & Media",
    "Membership/Community",
    "Personal Care & Wellness",
    "Professional/Advisory and Consulting Services",
    "Real Estate",
    "Social Enterprise & Education",
    "Staffing/Recruiting",
    "Travel and Hospitality",
    "Technology"
  ];

  // Check if current industry is in predefined options
  const isCustomIndustry = (industry: string) => {
    return industry && !industryOptions.includes(industry) && industry !== "Other" && industry !== "";
  };



  // Age groups for target audience
  const ageGroups = [
    '18-24',
    '25-34', 
    '35-44',
    '45-54',
    '55-64',
    '65+'
  ];

  // Suggested items for links (RSS Feed removed - now a separate profile field)
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

  // Signature handling functions
  const handleSignatureInputChange = (field: string, value: string | boolean | File | null | false) => {
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
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 4; // Increased from 3 to 5 for thicker, darker lines
      ctx.strokeStyle = '#000000';
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  const startSignatureDrawing = (x: number, y: number) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale coordinates to canvas resolution
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(scaledX, scaledY);
    setHasDrawn(true);
  };

  const drawSignature = (x: number, y: number) => {
    if (!isDrawingRef.current) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale coordinates to canvas resolution
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    ctx.lineTo(scaledX, scaledY);
    ctx.stroke();
  };

  const endSignatureDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      handleSignatureInputChange('signature', dataUrl);

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
    handleSignatureInputChange('uploadedImage', false); // Set to false to hide user signature
    handleSignatureInputChange('uploadedImageFile', null);
    setHasDrawn(false);
  };



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

  // Target Audience functions
  const addAudienceRow = () => {
    setTargetAudience(prev => [...prev, { role: '', ageRange: '', demographics: '' }]);
  };

  const removeAudienceRow = (index: number) => {
    setTargetAudience(prev => prev.filter((_, i) => i !== index));
  };

  const updateAudienceRow = (index: number, field: string, value: string) => {
    setTargetAudience(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

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

  // Load profile templates
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setTemplatesLoading(true);
        const res = await api.getProfileTemplates();
        if (mounted && res.success && res.templates) {
          setTemplates(res.templates);
          // Set current user's template as selected if available
          const templateId = user?.profile_template?.id;
          if (templateId) {
            setSelectedTemplate(templateId);
          }
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        if (mounted) setTemplatesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.profile_template?.id]);



  // Initialize form data from user context
  useEffect(() => {
    if (user) {
      console.log('[Profile] Initializing form data with user:', {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      });
      
      setBio(user.audience_description || '');
      setProfileImage(user.profile_picture_url || null);
      setInformationData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
        date_of_birth: user.date_of_birth || '',
        occupation: user.occupation || '',
        companyName: user.company_name || '',
        companyWebsite: user.company_website || '',
        rss_feed_url: user.rss_feed_url || '',
        industry: user.industry || '',
        numberOfEmployees: user.num_employees || '',
        contactEmailListSize: user.email_list_size || '',
        about: user.audience_description || '',
        billing_address_1: user.billing_address_1 || '',
        billing_address_2: user.billing_address_2 || '',
        billing_city: user.billing_city || '',
        billing_postcode: user.billing_postcode || '',
        billing_country: user.billing_country || '',
        billing_phone: user.billing_phone || '',
        brand_voice: user.brand_voice || '',
        unique_differentiation: user.unique_differentiation || '',
        top_pain_points: user.top_pain_points || '',
        primary_call_to_action: user.primary_call_to_action || '',
        content_preference_industry: user.content_preference_industry || [],
      });
      
      // Handle custom industries that don't match predefined options
      if (user.content_preference_industry && user.content_preference_industry.length > 0) {
        const predefinedIndustries = [
          "Construction",
          "Energy & Facilities", 
          "Consumer Packed Goods (CPG)",
          "Education/Training",
          "Fashion/Apparel",
          "Financial services",
          "Food & Beverage (Non-CPG)",
          "Healthcare",
          "Home & Lifestyle",
          "Insurance",
          "Manufacturing/Industrial",
          "Marketing & Media",
          "Membership/Community",
          "Personal Care & Wellness",
          "Professional/Advisory and Consulting Services",
          "Real Estate",
          "Social Enterprise & Education",
          "Staffing/Recruiting",
          "Travel and Hospitality",
          "Technology"
        ];
        
        const customIndustriesFromAPI = user.content_preference_industry.filter(
          industry => !predefinedIndustries.includes(industry) && industry !== "Other"
        );
        
        if (customIndustriesFromAPI.length > 0) {
          // Set custom industries state
          setCustomIndustries(customIndustriesFromAPI);
          
          // Add "Other" to the content_preference_industry if there are custom industries
          const updatedIndustries = [...user.content_preference_industry];
          if (!updatedIndustries.includes("Other")) {
            updatedIndustries.push("Other");
          }
          
          // Update the form data to include "Other"
          setInformationData(prev => prev ? ({
            ...prev,
            content_preference_industry: updatedIndustries
          }) : prev);
        }
      }
      
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

      // Initialize target audience from user data
      if (user.target_audience && user.target_audience.length > 0) {
        const mappedAudience = user.target_audience.map(audience => ({
          role: audience.name || '',
          ageRange: audience.age_group || '',
          demographics: audience.demographic_details || ''
        }));
        setTargetAudience(mappedAudience);
      }

      // Initialize signature from user data
      if (user.signature_url) {
        setSignatureFormData(prev => ({
          ...prev,
          uploadedImage: user.signature_url
        }));
      }

      // Initialize webhook URLs from user data
      const userWithWebhook = user as unknown as Record<string, unknown>;
      if (userWithWebhook.webhook_url && Array.isArray(userWithWebhook.webhook_url)) {
        setWebhookUrls(userWithWebhook.webhook_url as string[]);
      }

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
        // Show backend success message
        toast.success(response.message || 'Profile updated successfully');
        updateUser({
          audience_description: bio,
          profile_picture_url: profileImage || undefined
        });
      } else {
        // Show backend error message
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      // Show error message from exception if available
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
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
        // Use exact same keys as profile-verification
        updateData.firstName = informationData.firstName;
        updateData.lastName = informationData.lastName;
        updateData.username = informationData.username;
        updateData.date_of_birth = informationData.date_of_birth;
        updateData.occupation = informationData.occupation;
        updateData.companyName = informationData.companyName;
        updateData.companyWebsite = informationData.companyWebsite;
        updateData.rss_feed_url = informationData.rss_feed_url;
        updateData.industry = informationData.industry;
        updateData.numEmployees = informationData.numberOfEmployees;
        updateData.emailListSize = informationData.contactEmailListSize;
        updateData.audienceDescription = informationData.about;
        updateData.billing_address_1 = informationData.billing_address_1;
        updateData.billing_address_2 = informationData.billing_address_2;
        updateData.billing_city = informationData.billing_city;
        updateData.billing_postcode = informationData.billing_postcode;
        updateData.billing_country = informationData.billing_country;
        updateData.billing_phone = informationData.billing_phone;
        updateData.brand_voice = informationData.brand_voice;
        updateData.unique_differentiation = informationData.unique_differentiation;
        updateData.top_pain_points = informationData.top_pain_points;
        updateData.primary_call_to_action = informationData.primary_call_to_action;
        if (informationData.content_preference_industry && informationData.content_preference_industry.length > 0) {
          updateData.content_preference_industry = informationData.content_preference_industry;
        }
      }

      if (metricsData) {
        updateData.success_metrics = metricsData;
      }

      if (links) {
        updateData.links = links;
      }

      // Target Audience - save if there's data
      if (targetAudience && targetAudience.length > 0) {
        updateData.target_audience = targetAudience.map(audience => ({
          name: audience.role || '',
          age_group: audience.ageRange || '',
          demographic_details: audience.demographics || ''
        }));
      }

      // Signature - save if there's a new signature drawn or uploaded
      const signatureToSave = signatureFormData.signature || signatureFormData.uploadedImage;
      if (signatureToSave && signatureToSave !== user?.signature_url) {
        updateData.signature = signatureToSave;
      }

      // Consent fields (required by API)
      updateData.consentFeatureName = consentFeatureName;
      updateData.agreeTerms = agreeTerms;
      updateData.confimInFoAccurate = confirmInfoAccurate;

      // Template - save if selected
      const currentTemplateId = user?.profile_template?.id;
      if (selectedTemplate !== null && selectedTemplate !== currentTemplateId) {
        updateData.profileTemplate = selectedTemplate;
      }

      // Newsletter settings - include API keys if provider is selected and verified
      if (newsletterProvider && verificationStatus === "success") {
        updateData.newsletterService = newsletterProvider;

        if (newsletterProvider === "Mailchimp" && newsletterApiKey) {
          updateData.apiKey = newsletterApiKey;
        } else if (newsletterProvider === "HubSpot" && newsletterClientId && newsletterClientSecret) {
          updateData.clientId = newsletterClientId;
          updateData.clientSecret = newsletterClientSecret;
        }
      }

      // Webhook URLs - save if there are any
      if (webhookUrls && webhookUrls.length > 0) {
        updateData.webhookUrl = webhookUrls.filter(url => url.trim() !== '');
      }

      const response = await api.updateProfile(token, updateData);

      if (response.success) {
        // Show backend success message
        toast.success(response.message || 'Profile updated successfully');
        updateUser(updateData);

        // Fetch fresh user details after successful update
        try {
          const userDetailsResponse = await api.getUserDetails(token);
          if (userDetailsResponse.success && userDetailsResponse.user) {
            console.log('[Profile] Fresh user details fetched after update:', userDetailsResponse.user);
            updateUser(userDetailsResponse.user);
            
            // Show congratulations modal with updated profile data
            setSavedProfileData(userDetailsResponse.user);
            setShowProfileReadyModal(true);
          }
        } catch (error) {
          console.error('[Profile] Error fetching fresh user details:', error);
          // Don't show error toast for this as main update was successful
        }

        // Reset newsletter form after successful save
        if (newsletterProvider) {
          setNewsletterProvider("");
          setNewsletterApiKey("");
          setNewsletterClientId("");
          setNewsletterClientSecret("");
          setVerificationStatus("idle");
        }
      } else {
        // Show backend error message
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      // Show error message from exception if available
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
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
        // Show backend success message
        toast.success(response.message || 'Password updated successfully');
        // Reset password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Show backend error message
        toast.error(response.message || 'Failed to update password');
      }
    } catch (error) {
      // Show error message from exception if available
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const addCustomIndustry = () => {
  if (
    informationData?.content_preference_industry &&
    customContentPreference.trim() &&
    !informationData.content_preference_industry.includes(customContentPreference.trim())
  ) {
    const newIndustry = customContentPreference.trim();
    // Add the new industry and remove "Other" from content_preference_industry
    const updatedIndustries = informationData.content_preference_industry
      .filter((industry) => industry !== "Other") // Remove "Other"
      .concat(newIndustry); // Add the new custom industry
    handleArrayInputChange("content_preference_industry", updatedIndustries);
    setCustomIndustries((prev) => [...prev, newIndustry]);
    setCustomContentPreference("");
  }
};
const handleArrayInputChange = (field: string, value: string[]) => {
    setInformationData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : prev);
  };

  const removeCustomIndustry = (industryToRemove: string) => {
    if (informationData?.content_preference_industry) {
      handleArrayInputChange('content_preference_industry', 
        informationData.content_preference_industry.filter(industry => industry !== industryToRemove)
      );
    }
    setCustomIndustries(prev => prev.filter(industry => industry !== industryToRemove));
  };

  // Multi-Step Navigation Functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const skipStep = () => {
    nextStep();
  };

  // Webhook URL functions
  const addWebhookUrl = () => {
    if (newWebhookUrl.trim() && !webhookUrls.includes(newWebhookUrl.trim())) {
      setWebhookUrls(prev => [...prev, newWebhookUrl.trim()]);
      setNewWebhookUrl('');
    }
  };

  const removeWebhookUrl = (index: number) => {
    setWebhookUrls(prev => prev.filter((_, i) => i !== index));
  };

  const updateWebhookUrl = (index: number, value: string) => {
    setWebhookUrls(prev => prev.map((url, i) => i === index ? value : url));
  };



  return (
    <OnboardingProvider>
      <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
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
          setSidebarOpen={() => { }}
          currentPage="profile"
        />

        {/* Right Side (Header + Main Content) */}
        <div className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
          {/* Header - Fixed */}
          <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 border-b border-[#efc0c0] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  onClick={() => router.push("/dashboard")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </div>
                <h1 className="text-xl font-outift font-semibold text-[#333333]">Profile Settings</h1>
              </div>

              <UserProfileDropdown />
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-outfit">
                  Step {currentStep} of {totalSteps}
                </span>
                
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-[#CF3232] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              
              {/* Step Titles */}
              <div className="flex justify-between text-xs text-gray-500 font-outfit">
                <span className={currentStep === 1 ? 'text-[#CF3232] font-semibold' : ''}>Personal Info</span>
                <span className={currentStep === 2 ? 'text-[#CF3232] font-semibold' : ''}>Links</span>
                <span className={currentStep === 3 ? 'text-[#CF3232] font-semibold' : ''}>Signature</span>
                <span className={currentStep === 4 ? 'text-[#CF3232] font-semibold' : ''}>Template</span>
                <span className={currentStep === 5 ? 'text-[#CF3232] font-semibold' : ''}>Webhook URLs</span>
                <span className={currentStep === 6 ? 'text-[#CF3232] font-semibold' : ''}>Metrics</span>
              </div>
            </div>
          </header>

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

              {/* Step 1: Personal Information & Profile */}
              {currentStep === 1 && (
                <>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <div className='firstVerifyScreen group'>
                        <input
                          type="text"
                          value={informationData?.firstName || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <div className='firstVerifyScreen group'>
                        <input
                          type="text"
                          value={informationData?.lastName || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 1.5: Username - Special Field */}
                  <div className="mb-[10]">
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Username</label>
                    <div className='relative'>
                      <div className='firstVerifyScreen group' style={{ 
                        border: '2px solid #CF3232', 
                        borderRadius: '8px',
                        backgroundColor: '#FFF5F5'
                      }}>
                        <input
                          type="text"
                          value={informationData?.username || ''}
                          onChange={(e) => {
                            console.log('[Profile] Username changed to:', e.target.value);
                            setInformationData(prev => prev ? { ...prev, username: e.target.value } : null);
                          }}
                          className="w-full px-4 py-3 bg-transparent rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput"
                          style={{ color: '#CF3232', fontWeight: '500' }}
                          placeholder="e.g., johndoe"
                        />
                      </div>
                      
                      {/* Warning Note */}
                      <div className="mt-2 flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-yellow-800">
                          <strong>Warning:</strong> Changing this will update your profile URL. Your current URL: <span className="font-mono text-yellow-900">https://real-leaders.com/{user?.username}</span>
                        </p>
                      </div>

                      {/* Update Username Button - Show only if username changed */}
                      {informationData?.username && informationData.username !== user?.username && (
                        <button
                          onClick={async () => {
                            setIsLoading(true);
                            try {
                              const token = localStorage.getItem('auth_token');
                              if (!token) {
                                toast.error('Authentication token not found');
                                return;
                              }

                              const response = await api.updateProfile(token, {
                                username: informationData.username
                              });

                              if (response.success) {
                                toast.success('Username updated successfully!');
                                updateUser({ username: informationData.username });
                              } else {
                                toast.error(response.message || 'Failed to update username');
                              }
                            } catch (error) {
                              const errorMessage = error instanceof Error ? error.message : 'Failed to update username';
                              toast.error(errorMessage);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading}
                          className="mt-3 w-full sm:w-auto px-6 py-2.5 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Update Username</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Date of Birth & Occupation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Date of Birth</label>
                      <div className='firstVerifyScreen group relative'>
                        <input
                          type="text"
                          value={informationData?.date_of_birth || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, date_of_birth: e.target.value } : null)}
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              e.target.type = 'text';
                            }
                          }}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Role</label>
                      <div className='firstVerifyScreen group'>
                        <input
                          type="text"
                          value={informationData?.occupation || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, occupation: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter your job title"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Company Name & Company Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Company Name</label>
                      <div className='firstVerifyScreen group'>
                        <input
                          type="text"
                          value={informationData?.companyName || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Company Website</label>
                      <div className='firstVerifyScreen group'>
                        <input
                          type="url"
                          value={informationData?.companyWebsite || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, companyWebsite: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: RSS Feed URL */}
                  <div className="mb-[10]">
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">RSS Feed URL</label>
                    <div className='firstVerifyScreen group relative'>
                      <FaRss className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FF6600] z-10" />
                      <input
                        type="url"
                        value={informationData?.rss_feed_url || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, rss_feed_url: e.target.value } : null)}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="Add your RSS feed URL"
                      />
                    </div>
                  </div>

                  {/* Row 5: Industry & Number of Employees */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Industry</label>
                      <div className="relative firstVerifyScreen group">
                        <select
                          value={isCustomIndustry(informationData?.industry || '') ? 'Other' : (informationData?.industry || '')}
                          onChange={(e) => {
                            if (e.target.value === 'Other') {
                              setInformationData(prev => prev ? { ...prev, industry: 'Other' } : null);
                              if (!customIndustry && isCustomIndustry(informationData?.industry || '')) {
                                setCustomIndustry(informationData?.industry || '');
                              }
                            } else {
                              setInformationData(prev => prev ? { ...prev, industry: e.target.value } : null);
                              setCustomIndustry('');
                            }
                          }}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        >
                          <option value="">Select industry</option>
                          {industryOptions.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                      </div>
                      
                      {/* Custom Industry Input - Shows when "Other" is selected OR when user has custom industry */}
                      {(informationData?.industry === 'Other' || isCustomIndustry(informationData?.industry || '')) && (
                        <div className="mt-3 firstVerifyScreen group">
                          <input
                            type="text"
                            value={customIndustry || (isCustomIndustry(informationData?.industry || '') ? informationData?.industry : '')}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            onBlur={() => {
                              if (customIndustry.trim()) {
                                setInformationData(prev => prev ? { ...prev, industry: customIndustry.trim() } : null);
                              }
                            }}
                            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                            style={{ color: '#949494' }}
                            placeholder="Enter your industry"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Number of Employees</label>
                      <div className="relative firstVerifyScreen group">
                        <select
                          value={informationData?.numberOfEmployees || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, numberOfEmployees: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        >
                          <option value="">Select range</option>
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
                  </div>

                  {/* Row 4: Contact Email List Size */}
                  <div className="mb-[10]">
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Contact Email List Size</label>
                    <div className="relative firstVerifyScreen group">
                      <select
                        value={informationData?.contactEmailListSize || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, contactEmailListSize: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                      >
                        <option value="">Select size</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Brief Summary About Yourself</label>
                    <div className="firstVerifyScreen group" style={{ height: "200px" }}>
                      <textarea
                        value={informationData?.about || ''}
                        onChange={(e) => {
                          setInformationData(prev => prev ? { ...prev, about: e.target.value } : null);
                          setBio(e.target.value);
                        }}
                        className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
                        style={{ color: '#949494', height: "180px" }}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Billing Address Section */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">Billing Address</h3>

                  {/* Street Address 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address 1</label>
                    <div className="firstVerifyScreen group">
                      <input
                        type="text"
                        value={informationData?.billing_address_1 || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_address_1: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>

                  {/* Street Address 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Street Address 2 (Optional)</label>
                    <div className="firstVerifyScreen group">
                      <input
                        type="text"
                        value={informationData?.billing_address_2 || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_address_2: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                  </div>

                  {/* City, Postcode, Country */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-[10]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">City</label>
                      <div className="firstVerifyScreen group">
                        <input
                          type="text"
                          value={informationData?.billing_city || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_city: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Postcode</label>
                      <div className="firstVerifyScreen group">
                        <input
                          type="text"
                          value={informationData?.billing_postcode || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_postcode: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                          style={{ color: '#949494' }}
                          placeholder="Enter postcode"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Country</label>
                      <div className="relative firstVerifyScreen group">
                        <select
                          value={informationData?.billing_country || ''}
                          onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_country: e.target.value } : null)}
                          className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        >
                          <option value="">Select country</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Phone Number</label>
                    <div className="firstVerifyScreen group">
                      <input
                        type="tel"
                        value={informationData?.billing_phone || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, billing_phone: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Brand Voice */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Brand Voice</label>
                    <div className="firstVerifyScreen group" style={{ height: "auto" }}>
                      <textarea
                        value={informationData?.brand_voice || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, brand_voice: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
                        style={{ color: '#949494' }}
                        placeholder="Describe your brand voice and tone..."
                      />
                    </div>
                  </div>

                  {/* Unique Differentiation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Unique Differentiation</label>
                    <div className="firstVerifyScreen group" style={{ height: "auto" }}>
                      <textarea
                        value={informationData?.unique_differentiation || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, unique_differentiation: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
                        style={{ color: '#949494' }}
                        placeholder="What makes you unique?"
                      />
                    </div>
                  </div>

                  {/* Top Pain Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Top Pain Points</label>
                    <div className="firstVerifyScreen group" style={{ height: "auto" }}>
                      <textarea
                        value={informationData?.top_pain_points || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, top_pain_points: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
                        style={{ color: '#949494' }}
                        placeholder="What are the top pain points your audience faces?"
                      />
                    </div>
                  </div>

                  {/* Primary Call to Action */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Primary Call to Action</label>
                    <div className="firstVerifyScreen group">
                      <input
                        type="text"
                        value={informationData?.primary_call_to_action || ''}
                        onChange={(e) => setInformationData(prev => prev ? { ...prev, primary_call_to_action: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="e.g., Book a consultation"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Target Audience Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
                <h2 className="font-semibold font-outift text-[#333333] mb-2">Target Audience</h2>
                <p className="text-sm text-gray-600 mb-4">List the people/roles, age range, and demographic segments you target.</p>
                
                {targetAudience.map((audience, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">People / Role</label>
                        <div className="firstVerifyScreen group">
                          <input
                            type="text"
                            value={audience.role}
                            onChange={(e) => updateAudienceRow(index, 'role', e.target.value)}
                            placeholder="e.g., Startup founders"
                            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                            style={{ color: '#949494' }}
                          />
                        </div>
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                          <div className="relative firstVerifyScreen group">
                            <select
                              value={audience.ageRange}
                              onChange={(e) => updateAudienceRow(index, 'ageRange', e.target.value)}
                              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                            >
                              <option value="">Select age group</option>
                              {ageGroups.map((ageGroup) => (
                                <option key={ageGroup} value={ageGroup}>
                                  {ageGroup}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                          </div>
                        </div>
                        {targetAudience.length > 1 && (
                          <button
                            onClick={() => removeAudienceRow(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors mb-1"
                            title="Remove audience"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Demographics</label>
                      <div className="firstVerifyScreen group">
                        <input
                        type="text"
                        value={audience.demographics}
                        onChange={(e) => updateAudienceRow(index, 'demographics', e.target.value)}
                        placeholder="Demographic details (e.g., location, income band, interests)"
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                      />
                    </div>
                  </div>
                  </div>
                ))}
                
                <button
                  onClick={addAudienceRow}
                  className="flex items-center space-x-2 px-4 py-2 text-[#CF3232] hover:text-red-700 border border-[#CF3232] rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add audience row</span>
                </button>
              </div>


<div className="firstVerifyScreen group" style={{ height: "auto", flexDirection: "column" }}>
  {/* Content Preference Industry - Multi-select with improved UI */}
  <div className="space-y-4">
    <div className='flex flex-col items-center text-center mt-4 sm:mt-5 md:mt-6'>
      <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
        Content Preference Industry
      </label>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 px-2">
        Select all industries that interest you (select multiple)
      </p>
    </div>
    {/* Grid of industry options - responsive and compact */}
    <div className="grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-3 md:gap-4 mb-6">
      {[
        "Construction",
        "Energy & Facilities",
        "Consumer Packed Goods (CPG)",
        "Education/Training",
        "Fashion/Apparel",
        "Financial services",
        "Food & Beverage (Non-CPG)",
        "Healthcare",
        "Home & Lifestyle",
        "Insurance",
        "Manufacturing/Industrial",
        "Marketing & Media",
        "Membership/Community",
        "Personal Care & Wellness",
        "Professional/Advisory and Consulting Services",
        "Real Estate",
        "Social Enterprise & Education",
        "Staffing/Recruiting",
        "Travel and Hospitality",
        "Technology",
        "Other",
      ].map((industry) => (
        <label
          key={industry}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          style={{
            borderColor: informationData?.content_preference_industry?.includes(industry)
              ? "#CF3232"
              : "#CF323240",
            backgroundColor: informationData?.content_preference_industry?.includes(industry)
              ? "#FEF2F2"
              : "#ffffff",
            boxShadow: informationData?.content_preference_industry?.includes(industry)
              ? "0 4px 6px -1px rgba(207, 50, 50, 0.1), 0 2px 4px -1px rgba(207, 50, 50, 0.06)"
              : "none",
            transform: informationData?.content_preference_industry?.includes(industry)
              ? "scale(1.02)"
              : "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (!informationData?.content_preference_industry?.includes(industry)) {
              e.currentTarget.style.borderColor = "#CF3232";
              e.currentTarget.style.backgroundColor = "#FEF2F2";
              e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(207, 50, 50, 0.1)";
              e.currentTarget.style.transform = "scale(1.02) translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!informationData?.content_preference_industry?.includes(industry)) {
              e.currentTarget.style.borderColor = "#CF323240";
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <div className="flex items-center justify-center flex-shrink-0">
            <input
              type="checkbox"
              checked={informationData?.content_preference_industry?.includes(industry) || false}
              onChange={(e) => {
                if (informationData?.content_preference_industry) {
                  const newValue = e.target.checked
                    ? [...informationData.content_preference_industry, industry]
                    : informationData.content_preference_industry.filter((item) => item !== industry);
                  handleArrayInputChange("content_preference_industry", newValue);
                }
              }}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-gray-300 text-[#CF3232] focus:ring-[#CF3232] focus:ring-2 cursor-pointer flex-shrink-0"
            />
          </div>
          <span
            className="text-xs sm:text-sm md:text-base font-medium leading-tight"
            style={{
              color: informationData?.content_preference_industry?.includes(industry)
                ? "#CF3232"
                : "#333333",
              transition: "color 0.3s ease",
            }}
          >
            {industry}
          </span>
        </label>
      ))}
    </div>

    {/* Display selected custom industries */}
    {(customIndustries.length > 0 || (informationData?.content_preference_industry?.some(industry => 
      !["Construction", "Energy & Facilities", "Consumer Packed Goods (CPG)", "Education/Training", "Fashion/Apparel", "Financial services", "Food & Beverage (Non-CPG)", "Healthcare", "Home & Lifestyle", "Insurance", "Manufacturing/Industrial", "Marketing & Media", "Membership/Community", "Personal Care & Wellness", "Professional/Advisory and Consulting Services", "Real Estate", "Social Enterprise & Education", "Staffing/Recruiting", "Travel and Hospitality", "Technology", "Other"].includes(industry)
    ))) && (
      <div
        className="mb-6 p-[10px]"
        style={{
          animation: "fadeInUp 0.4s ease-out",
        }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Custom Industries:
        </label>
        <div className="flex flex-wrap gap-3">
          {/* Show custom industries from state */}
          {customIndustries.map((industry, index) => (
            <span
              key={`custom-${index}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "#FEF2F2",
                color: "#CF3232",
                border: "2px solid #CF3232",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                animation: `fadeInScale 0.3s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(207, 50, 50, 0.2), 0 2px 4px -1px rgba(207, 50, 50, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              {industry}
              <button
                type="button"
                onClick={() => removeCustomIndustry(industry)}
                style={{
                  marginLeft: "8px",
                  color: "#CF3232",
                  fontWeight: "bold",
                  fontSize: "18px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#b82d2d";
                  e.currentTarget.style.transform = "rotate(90deg) scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#CF3232";
                  e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                }}
                aria-label={`Remove ${industry}`}
              >
                ×
              </button>
            </span>
          ))}
          
          {/* Show custom industries from API data that aren't in customIndustries state yet */}
          {informationData?.content_preference_industry?.filter(industry => 
            !["Construction", "Energy & Facilities", "Consumer Packed Goods (CPG)", "Education/Training", "Fashion/Apparel", "Financial services", "Food & Beverage (Non-CPG)", "Healthcare", "Home & Lifestyle", "Insurance", "Manufacturing/Industrial", "Marketing & Media", "Membership/Community", "Personal Care & Wellness", "Professional/Advisory and Consulting Services", "Real Estate", "Social Enterprise & Education", "Staffing/Recruiting", "Travel and Hospitality", "Technology", "Other"].includes(industry) &&
            !customIndustries.includes(industry)
          ).map((industry, index) => (
            <span
              key={`api-${index}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "#FEF2F2",
                color: "#CF3232",
                border: "2px solid #CF3232",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                animation: `fadeInScale 0.3s ease-out ${(customIndustries.length + index) * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(207, 50, 50, 0.2), 0 2px 4px -1px rgba(207, 50, 50, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              {industry}
              <button
                type="button"
                onClick={() => {
                  // Remove from content_preference_industry array
                  if (informationData?.content_preference_industry) {
                    const updatedIndustries = informationData.content_preference_industry.filter(ind => ind !== industry);
                    handleArrayInputChange('content_preference_industry', updatedIndustries);
                  }
                }}
                style={{
                  marginLeft: "8px",
                  color: "#CF3232",
                  fontWeight: "bold",
                  fontSize: "18px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#b82d2d";
                  e.currentTarget.style.transform = "rotate(90deg) scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#CF3232";
                  e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                }}
                aria-label={`Remove ${industry}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Conditional custom industry input - only shows when "Other" is selected */}
    {informationData?.content_preference_industry?.includes("Other") && (
      <div
        className="p-3 m-[10px] sm:p-4 md:p-6 mb-4 sm:mb-5 md:mb-6 rounded-lg border-2 border-[#CF323240] bg-[#FEF2F2]"
        style={{
          animation: "slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
          Add Your Custom Industry
        </label>
        <p className="text-xs sm:text-sm text-[#949494] mb-3 sm:mb-4">
          Enter the name of your industry and press Tab, Enter, or click away to add
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={customContentPreference}
            onChange={(e) => setCustomContentPreference(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomIndustry();
              }
            }}
            onBlur={() => {
              if (
                informationData?.content_preference_industry &&
                customContentPreference.trim() &&
                !informationData.content_preference_industry.includes(customContentPreference.trim())
              ) {
                addCustomIndustry();
              }
            }}
            className="flex-1 p-2 sm:p-3 md:p-4 bg-white rounded-lg border-2 border-[#CF323240] outline-none text-gray-800 transition-all duration-300 focus:border-[#CF3232] focus:shadow-lg focus:scale-[1.01] text-sm sm:text-base"
            placeholder="e.g., Entertainment, Sports, etc."
          />
          <button
            type="button"
            onClick={addCustomIndustry}
            disabled={
              !customContentPreference.trim() ||
              informationData?.content_preference_industry?.includes(customContentPreference.trim())
            }
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#CF3232] disabled:bg-gray-300 text-white font-semibold rounded-lg border-none cursor-pointer disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#b82d2d] hover:-translate-y-1 hover:shadow-lg active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
    )}
  </div>
</div>
              </>
              )}

              {/* Step 2: Links */}
              {currentStep === 2 && (
                <>
              {/* Links Section */}
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
                            {suggestedItems.map(({ label, icon }) => (
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${expandedItems.has(label)
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

              </>
              )}

              {/* Step 3: Signature */}
              {currentStep === 3 && (
                <>
              {/* Signature Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
                <h2 className="font-semibold font-outfit text-[#333333] mb-4">Digital Signature</h2>

                <div className="space-y-6">
                  {/* Signature Input Container */}
                  <div className="relative mx-auto w-full max-w-2xl group" style={{ height: '200px' }}>
                    {/* Ternary operator: Show current signature OR drawing canvas */}
                    {(signatureFormData.uploadedImage || (user?.signature_url && signatureFormData.uploadedImage !== false)) && !hasDrawn ? (
                      // Current Signature Display Box
                      <div className="w-full h-full flex items-center justify-center bg-white relative border-2 border-[#CF323240] rounded-lg">
                        <Image
                          src={signatureFormData.uploadedImage || user?.signature_url || ''}
                          alt="Current signature"
                          className="max-w-full max-h-full object-contain"
                          width={400}
                          height={200}
                          unoptimized
                        />
                        <button
                          onClick={() => {
                            handleSignatureInputChange('uploadedImage', false);
                            handleSignatureInputChange('uploadedImageFile', null);
                            // Clear canvas for new drawing
                            const canvas = signatureCanvasRef.current;
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                              }
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                          title="Remove signature and draw new one"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      // New Drawing Canvas Box
                      <div className="firstVerifyScreen" style={{ height: 200, position: 'relative' }}>
                        <canvas
                          ref={signatureCanvasRef}
                          width={600}
                          height={200}
                          className="w-full h-full bg-white rounded-[6px] transition-all duration-300 group-hover:shadow-lg border-2 border-[#CF323240] cursor-crosshair"
                          style={{ 
                            touchAction: 'none',
                            display: 'block',
                            width: '100%',
                            height: '100%'
                          }}
                          onMouseDown={(e) => {
                            const canvas = e.currentTarget;
                            const rect = canvas.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            startSignatureDrawing(x, y);
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawingRef.current) return;
                            const canvas = e.currentTarget;
                            const rect = canvas.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            drawSignature(x, y);
                          }}
                          onMouseUp={endSignatureDrawing}
                          onMouseLeave={endSignatureDrawing}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const canvas = e.currentTarget;
                            const rect = canvas.getBoundingClientRect();
                            const x = touch.clientX - rect.left;
                            const y = touch.clientY - rect.top;
                            startSignatureDrawing(x, y);
                          }}
                          onTouchMove={(e) => {
                            e.preventDefault();
                            if (!isDrawingRef.current) return;
                            const touch = e.touches[0];
                            const canvas = e.currentTarget;
                            const rect = canvas.getBoundingClientRect();
                            const x = touch.clientX - rect.left;
                            const y = touch.clientY - rect.top;
                            drawSignature(x, y);
                          }}
                          onTouchEnd={endSignatureDrawing}
                          onTouchCancel={endSignatureDrawing}
                        />
                        {hasDrawn ? (
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="absolute top-2 right-2 bg-[#CF3232] text-white rounded px-2 py-1 text-xs hover:bg-red-700 transition-all duration-300 transform hover:scale-110 z-10"
                          >
                            Clear
                          </button>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <p className="text-gray-400 text-sm">Draw your signature here or upload an image</p>
                          </div>
                        )}
                      </div>
                    )}

                    <input
                      ref={signatureFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureFileUpload}
                      className="hidden"
                    />

                    <button
                      onClick={handleSignatureUploadClick}
                      className="absolute bottom-5 right-5 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm transform hover:scale-105 hover:-translate-y-1"
                    >
                      <Upload size={16} color="#8B8B8B" />
                      <span className="text-sm text-gray-600 font-outfit">Upload</span>
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Instructions:</strong> Draw your signature using mouse/touch or upload an image.
                      Your signature will be displayed on your public profile. Click × to remove current signature and create new one.
                    </p>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consentFeatureName"
                        checked={consentFeatureName}
                        onChange={(e) => setConsentFeatureName(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#CF3232] border-gray-300 rounded focus:ring-[#CF3232]"
                      />
                      <label htmlFor="consentFeatureName" className="text-sm text-gray-700">
                        I consent to my name being featured on the platform
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#CF3232] border-gray-300 rounded focus:ring-[#CF3232]"
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                        I agree to the terms and conditions
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="confirmInfoAccurate"
                        checked={confirmInfoAccurate}
                        onChange={(e) => setConfirmInfoAccurate(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#CF3232] border-gray-300 rounded focus:ring-[#CF3232]"
                      />
                      <label htmlFor="confirmInfoAccurate" className="text-sm text-gray-700">
                        I confirm that all information provided is accurate
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}



              {/* Step 4: Template */}
              {currentStep === 4 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
                  <h2 className="font-semibold font-outfit text-[#333333] mb-4">Profile Template</h2>
                  <p className="text-gray-600 mb-4">Choose a template design for your public profile page.</p>
                  
                  {templatesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#CF3232]" />
                      <span className="ml-3 text-gray-600">Loading templates...</span>
                    </div>
                  ) : templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {templates.map((template) => {
                        const isSelected = selectedTemplate === template.id;
                        return (
                          <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`border-2 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 ${
                              isSelected
                                ? 'border-[#CF3232] bg-gradient-to-br from-pink-50 to-white scale-105'
                                : 'border-gray-200 hover:border-[#CF3232]/50'
                            }`}
                          >
                            <div className="bg-white rounded-lg mb-3 overflow-hidden border border-gray-200" style={{ height: '350px' }}>
                              {template.image_url ? (
                                <Image
                                  src={template.image_url}
                                  alt={template.title}
                                  width={400}
                                  height={225}
                                  className="w-full h-full object-cover"
                                  style={{
                                    width: '-webkit-fill-available',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-[#CF3232] rounded-full mx-auto mb-2"></div>
                                    <div className="h-2 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                                    <div className="h-2 bg-gray-200 rounded w-20 mx-auto"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1 text-sm">{template.title}</h3>
                            <p className="text-xs text-gray-500 mb-2 capitalize">{template.slug.replace(/-/g, ' ')}</p>
                            {isSelected && (
                              <div className="inline-block bg-[#CF3232] text-white px-2 py-1 rounded-full text-xs font-medium">
                                Selected
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No templates available at the moment.</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                        <p className="text-sm text-blue-800">
                          Templates will be available soon. Check back later!
                        </p>
                      </div>
                    </div>
                  )}

                  {templates.length > 0 && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Select a template and save your changes to apply it to your profile.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Newsletter Integration */}
              {currentStep === 5 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
                  <h2 className="font-semibold font-outfit text-[#333333] mb-4">Webhook URLs</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Add webhook URLs to receive subscription notifications when users subscribe to your profile. 
                    When someone subscribes, we&apos;ll send the subscription data to all your webhook URLs.
                  </p>

                  {/* Existing Webhook URLs */}
                  {webhookUrls.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {webhookUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateWebhookUrl(index, e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300"
                              style={{ color: '#333333' }}
                              placeholder="https://your-webhook-endpoint.com/webhook"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeWebhookUrl(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-300"
                            title="Remove webhook URL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Webhook URL */}
                  <div className="space-y-3">
                    <div className="firstVerifyScreen group">
                      <input
                        type="url"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addWebhookUrl();
                          }
                        }}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                        style={{ color: '#949494' }}
                        placeholder="Enter webhook URL (e.g., https://your-site.com/webhook)"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={addWebhookUrl}
                      disabled={!newWebhookUrl.trim() || webhookUrls.includes(newWebhookUrl.trim())}
                      className="w-full px-4 py-3 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add More URL</span>
                    </button>
                    
                  
                  </div>

                
                </div>
              )}

              {/* Step 6: Success Metrics */}
              {currentStep === 6 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
                  <h2 className="font-semibold font-outfit text-[#333333] mb-4">Success Metrics</h2>
                  <p className="text-gray-600 mb-4 text-sm">Track your business goals (Optional)</p>
                  
                  <div className="space-y-4">
                    {/* Number of Bookings */}
                    <div className="relative firstVerifyScreen group">
                      <select
                        value={metricsData?.numberOfBookings || ''}
                        onChange={(e) => setMetricsData(prev => ({ ...prev || { numberOfBookings: '', emailListSize: '', amountInSales: '', amountInDonations: '' }, numberOfBookings: e.target.value }))}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 transition-all appearance-none pr-10"
                        style={{ color: '#949494' }}
                      >
                        <option value="">Number of Bookings</option>
                        <option value="0-10">0-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-100">51-100</option>
                        <option value="101-500">101-500</option>
                        <option value="500+">500+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>

                    {/* Email List Size */}
                    <div className="relative firstVerifyScreen group">
                      <select
                        value={metricsData?.emailListSize || ''}
                        onChange={(e) => setMetricsData(prev => ({ ...prev || { numberOfBookings: '', emailListSize: '', amountInSales: '', amountInDonations: '' }, emailListSize: e.target.value }))}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 transition-all appearance-none pr-10"
                        style={{ color: '#949494' }}
                      >
                        <option value="">Email List Size</option>
                        <option value="0-100">0-100</option>
                        <option value="101-500">101-500</option>
                        <option value="501-1000">501-1000</option>
                        <option value="1001-5000">1001-5000</option>
                        <option value="5001-10000">5001-10000</option>
                        <option value="10000+">10000+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>

                    {/* Amount in Sales */}
                    <div className="relative firstVerifyScreen group">
                      <select
                        value={metricsData?.amountInSales || ''}
                        onChange={(e) => setMetricsData(prev => ({ ...prev || { numberOfBookings: '', emailListSize: '', amountInSales: '', amountInDonations: '' }, amountInSales: e.target.value }))}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 transition-all appearance-none pr-10"
                        style={{ color: '#949494' }}
                      >
                        <option value="">Amount in Sales</option>
                        <option value="0-10k">$0 - $10k</option>
                        <option value="10k-50k">$10k - $50k</option>
                        <option value="50k-100k">$50k - $100k</option>
                        <option value="100k-500k">$100k - $500k</option>
                        <option value="500k+">$500k+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>

                    {/* Amount in Donations */}
                    <div className="relative firstVerifyScreen group">
                      <select
                        value={metricsData?.amountInDonations || ''}
                        onChange={(e) => setMetricsData(prev => ({ ...prev || { numberOfBookings: '', emailListSize: '', amountInSales: '', amountInDonations: '' }, amountInDonations: e.target.value }))}
                        className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 transition-all appearance-none pr-10"
                        style={{ color: '#949494' }}
                      >
                        <option value="">Amount in Donations</option>
                        <option value="0-1k">$0 - $1k</option>
                        <option value="1k-5k">$1k - $5k</option>
                        <option value="5k-10k">$5k - $10k</option>
                        <option value="10k-50k">$10k - $50k</option>
                        <option value="50k+">$50k+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Change Section - Removed from steps, always accessible */}
              {false && (
              <div style={{display: 'none'}}>
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
                        style={{ color: '#949494', height: '70px', fontSize: 18 }}
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
                        style={{ color: '#949494', height: '70px', fontSize: 18 }}
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
                        style={{ color: '#949494', height: '70px', fontSize: 18 }}
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
              </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
                {/* Back Button */}
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-outfit font-medium"
                  >
                    ← Back
                  </button>
                )}

                <div className="flex-1" />

                {/* Skip Button - Hide on last step */}
                {currentStep < totalSteps && (
                  <button
                    onClick={skipStep}
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-outfit font-medium"
                  >
                    Skip
                  </button>
                )}

                {/* Next/Save Button */}
                {currentStep < totalSteps ? (
                  <button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 font-outfit font-medium flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveAll}
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 font-outfit font-medium flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save All Changes'}</span>
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0">
            <DashBoardFooter />
          </div>
        </div>
      </div>

      {/* Profile Ready Congratulations Modal */}
      <ProfileReadyModal
        isOpen={showProfileReadyModal}
        onClose={() => setShowProfileReadyModal(false)}
        profileData={savedProfileData}
        user={user}
      />
    </OnboardingProvider>
  );
};

export default ProfilePage;