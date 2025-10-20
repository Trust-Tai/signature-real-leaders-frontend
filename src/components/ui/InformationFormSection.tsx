"use client"

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Country codes data
const countries = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'VA', name: 'Holy See (Vatican City State)' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran, Islamic Republic' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, Democratic People\'s Republic' },
  { code: 'KR', name: 'Korea, Republic' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Lao People\'s Democratic Republic' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia, the former Yugoslav Republic' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia, Federated States' },
  { code: 'MD', name: 'Moldova, Republic' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestinian Territory, Occupied' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin (French part)' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SX', name: 'Sint Maarten (Dutch part)' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan, Province of China' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania, United Republic' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela, Bolivarian Republic' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];


interface InformationFormSectionProps {
  onSubmit: (data: FormData) => void;
  className?: string;
  error?: string;
  initialData?: {
    firstName?: string;
    lastName?: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  numberOfEmployees: string;
  contactEmailListSize: string;
  about: string;
  // Address Fields
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_postcode: string;
  billing_country: string;
  billing_phone: string;
  // Additional Fields
  brand_voice: string;
  unique_differentiation: string;
  top_pain_points: string;
  content_preference_industry: string[];
  primary_call_to_action: string;
  date_of_birth: string;
  occupation: string;
}

const InformationFormSection: React.FC<InformationFormSectionProps> = ({
  onSubmit,
  className,
  error,
  initialData
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    numberOfEmployees: '',
    contactEmailListSize: '',
    about: '',
    // Address Fields
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_postcode: '',
    billing_country: '',
    billing_phone: '',
    // Additional Fields
    brand_voice: '',
    unique_differentiation: '',
    top_pain_points: '',
    content_preference_industry: [],
    primary_call_to_action: '',
    date_of_birth: '',
    occupation: ''
  });

  const [customContentPreference, setCustomContentPreference] = useState('');
  const [customIndustries, setCustomIndustries] = useState<string[]>([]);

  // Handle initial data and auto-prefill first name and last name
  useEffect(() => {
    if (initialData) {
      // If both firstName and lastName are provided separately, use them directly
      if (initialData.firstName && initialData.lastName) {
        setFormData(prev => ({
          ...prev,
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || ''
        }));
      } 
      // If only firstName is provided (from the name field), split it by spaces
      else if (initialData.firstName && !initialData.lastName) {
        const nameParts = initialData.firstName.trim().split(' ');
        const firstName = nameParts[0] || ''; // First word goes to firstName
        const lastName = nameParts[1] || ''; // Only second word goes to lastName
        
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName
        }));
      }
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const addCustomIndustry = () => {
    if (customContentPreference.trim() && !formData.content_preference_industry.includes(customContentPreference.trim())) {
      const newIndustry = customContentPreference.trim();
      handleArrayInputChange('content_preference_industry', [...formData.content_preference_industry, newIndustry]);
      setCustomIndustries(prev => [...prev, newIndustry]);
      setCustomContentPreference('');
    }
  };

  const removeCustomIndustry = (industryToRemove: string) => {
    handleArrayInputChange('content_preference_industry', 
      formData.content_preference_industry.filter(industry => industry !== industryToRemove)
    );
    setCustomIndustries(prev => prev.filter(industry => industry !== industryToRemove));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = () => {
    const requiredFields = [
      'firstName', 'lastName', 'companyName', 'companyWebsite', 'industry', 
      'numberOfEmployees', 'contactEmailListSize', 'about', 'billing_address_1', 
      'billing_city', 'billing_postcode', 'billing_country', 'billing_phone',
      'brand_voice', 'unique_differentiation', 'top_pain_points', 
      'primary_call_to_action', 'date_of_birth', 'occupation'
    ];
    
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return typeof value === 'string' ? value.trim() !== '' : true;
    }) && formData.content_preference_industry.length > 0;
  };

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        TELL US ABOUT YOU
      </h2>

      {/* Form Fields */}
      <div className="space-y-6" style={{display:"flex",flexDirection:"column"}}>
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className='firstVerifyScreen group'>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="First Name"
          />
          </div>
          <div className='firstVerifyScreen group'>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Company Name"
          />
          </div>
           <div className='firstVerifyScreen group'>
          <input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
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
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
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
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
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
            value={formData.contactEmailListSize}
            onChange={(e) => handleInputChange('contactEmailListSize', e.target.value)}
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
            value={formData.about}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494',height:"180px" }}
            placeholder="Tell us a little about yourself and what you do..."
          />
        </div>

        {/* Address Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
        
        {/* Street Address 1 */}
        <div className="firstVerifyScreen group">
          <input
            type="text"
            value={formData.billing_address_1}
            onChange={(e) => handleInputChange('billing_address_1', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Street Address 1"
          />
        </div>

        {/* Street Address 2 */}
        <div className="firstVerifyScreen group">
          <input
            type="text"
            value={formData.billing_address_2}
            onChange={(e) => handleInputChange('billing_address_2', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Street Address 2 (Optional)"
          />
        </div>

        {/* City, Postcode, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-[10]">
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.billing_city}
              onChange={(e) => handleInputChange('billing_city', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="City"
            />
          </div>
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.billing_postcode}
              onChange={(e) => handleInputChange('billing_postcode', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Postcode"
            />
          </div>
          <div className="relative firstVerifyScreen group">
            <select
              value={formData.billing_country}
              onChange={(e) => handleInputChange('billing_country', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            >
              <option value="">Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </div>

        {/* Phone */}
        <div className="firstVerifyScreen group">
          <input
            type="tel"
            value={formData.billing_phone}
            onChange={(e) => handleInputChange('billing_phone', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Phone Number"
          />
        </div>

        {/* Additional Fields Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>

        {/* Date of Birth & Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className="firstVerifyScreen group">
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Date of Birth"
            />
          </div>
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Occupation"
            />
          </div>
        </div>

        {/* Brand Voice */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.brand_voice}
            onChange={(e) => handleInputChange('brand_voice', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="Describe your brand voice and tone..."
          />
        </div>

        {/* Unique Differentiation */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.unique_differentiation}
            onChange={(e) => handleInputChange('unique_differentiation', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="What makes you unique? How do you differentiate from competitors?"
          />
        </div>

        {/* Top Pain Points */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.top_pain_points}
            onChange={(e) => handleInputChange('top_pain_points', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="What are the top pain points your audience faces?"
          />
        </div>

        {/* Primary Call to Action */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <input
            type="text"
            value={formData.primary_call_to_action}
            onChange={(e) => handleInputChange('primary_call_to_action', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="What is your primary call to action?"
          />
        </div>

        {/* Content Preference Industry - Multi-select */}
        <div className="firstVerifyScreen group" style={{height:"auto",flexDirection:"column"}}>
          <label className="block text-sm font-medium text-gray-700 mb-4">Content Preference Industry (Select multiple)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Marketing', 'Real Estate', 'Food & Beverage', 'Travel', 'Fashion'].map((industry) => (
              <label key={industry} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.content_preference_industry.includes(industry)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...formData.content_preference_industry, industry]
                      : formData.content_preference_industry.filter(item => item !== industry);
                    handleArrayInputChange('content_preference_industry', newValue);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-custom-red focus:ring-custom-red focus:ring-2"
                />
                <span className="text-sm text-gray-700 font-medium">{industry}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Industries Display */}
          {customIndustries.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Industries Added:</label>
              <div className="flex flex-wrap gap-2">
                {customIndustries.map((industry, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-custom-red/10 text-custom-red border border-custom-red/20"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => removeCustomIndustry(industry)}
                      className="ml-2 text-custom-red hover:text-red-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Content Preference Input */}
          <div className="mt-4 w-[90%]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Industry (if not listed above)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customContentPreference}
                onChange={(e) => setCustomContentPreference(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomIndustry();
                  }
                }}
                className="firstVerifyScreenInput flex-1 px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                style={{ color: '#949494' }}
                placeholder="Enter custom industry name"
              />
              <button
                type="button"
                onClick={addCustomIndustry}
                disabled={!customContentPreference.trim() || formData.content_preference_industry.includes(customContentPreference.trim())}
                className="custom-btn"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to include the industry</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300" style={{width:"100%"}}
        >
          CONTINUE
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
        )}
      </div>

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
    </div>
  );
};

export default InformationFormSection;


// import React, { useState } from 'react';
// import { cn } from '@/lib/utils';
// import { ChevronDown } from 'lucide-react';

// interface InformationFormSectionProps {
//   onSubmit: (data: FormData) => void;
//   className?: string;
//   error?: string;
// }

// interface FormData {
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   companyWebsite: string;
//   industry: string;
//   numberOfEmployees: string;
//   contactEmailListSize: string;
//   about: string; // 👈 नया field
// }

// const InformationFormSection: React.FC<InformationFormSectionProps> = ({
//   onSubmit,
//   className,
//   error
// }) => {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     companyWebsite: '',
//     industry: '',
//     numberOfEmployees: '',
//     contactEmailListSize: '',
//     about: '' // 👈 default empty
//   });

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = () => {
//     onSubmit(formData);
//   };

//   const isFormValid = Object.values(formData).every(value => value.trim() !== '');

//   return (
//     <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
//       {/* Section Heading */}
//       <h2 className="section-title animate-fade-in-down">
//         ENTER YOUR INFORMATION
//       </h2>

//       <div className="space-y-6">
//         {/* Row 1: First & Last Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <input
//             type="text"
//             value={formData.firstName}
//             onChange={(e) => handleInputChange('firstName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="First Name"
//           />
//           <input
//             type="text"
//             value={formData.lastName}
//             onChange={(e) => handleInputChange('lastName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Last Name"
//           />
//         </div>

//         {/* Row 2: Company Name & Website */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <input
//             type="text"
//             value={formData.companyName}
//             onChange={(e) => handleInputChange('companyName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Company Name"
//           />
//           <input
//             type="url"
//             value={formData.companyWebsite}
//             onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Company Website"
//           />
//         </div>

//         {/* Row 3: Industry & Employees */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <div className="relative group">
//             <select
//               value={formData.industry}
//               onChange={(e) => handleInputChange('industry', e.target.value)}
//               className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//             >
//               <option value="">Industry</option>
//               <option value="Technology">Technology</option>
//               <option value="Healthcare">Healthcare</option>
//               <option value="Finance">Finance</option>
//               <option value="Education">Education</option>
//               <option value="Retail">Retail</option>
//               <option value="Manufacturing">Manufacturing</option>
//               <option value="Consulting">Consulting</option>
//               <option value="Other">Other</option>
//             </select>
//             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//           </div>

//           <div className="relative group">
//             <select
//               value={formData.numberOfEmployees}
//               onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
//               className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//             >
//               <option value="">Number of Employees</option>
//               <option value="1-10">1-10</option>
//               <option value="11-50">11-50</option>
//               <option value="51-200">51-200</option>
//               <option value="201-500">201-500</option>
//               <option value="501-1000">501-1000</option>
//               <option value="1000+">1000+</option>
//             </select>
//             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//           </div>
//         </div>

//         {/* Row 4: Contact Email List Size */}
//         <div className="relative group">
//           <select
//             value={formData.contactEmailListSize}
//             onChange={(e) => handleInputChange('contactEmailListSize', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//           >
//             <option value="">Contact email list size</option>
//             <option value="0-100">0-100</option>
//             <option value="101-500">101-500</option>
//             <option value="501-1000">501-1000</option>
//             <option value="1001-5000">1001-5000</option>
//             <option value="5001-10000">5001-10000</option>
//             <option value="10000+">10000+</option>
//           </select>
//           <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//         </div>

//         {/* Row 5: About / Note */}
//         <div className="firstVerifyScreen group">
//           <textarea
//             value={formData.about}
//             onChange={(e) => handleInputChange('about', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Tell us a little about yourself and what you do..."
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           disabled={!isFormValid}
//           className="custom-btn w-full transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
//         >
//           CONTINUE
//         </button>

//         {/* Error Message */}
//         {error && (
//           <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InformationFormSection;
