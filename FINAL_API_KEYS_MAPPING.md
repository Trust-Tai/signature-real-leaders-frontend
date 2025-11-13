# Final API Keys Mapping - CORRECT ✅

## API Expected Keys (Based on Your JSON)

### Personal Information
```javascript
firstName: "dsdsdsdd"
lastName: "dssdsdsds"
email: "dev123.dssdsdsdrajput@gmail.com"
date_of_birth: "2001-01-02"
occupation: "fullstack dev"
```

### Company Information
```javascript
companyName: "trust-tai"
companyWebsite: "https://trust-tai.com"
industry: "Technology"
numEmployees: "51-200"          // NOT numberOfEmployees
emailListSize: "101-500"        // NOT contactEmailListSize
```

### Billing Address
```javascript
billing_address_1: "indore"
billing_address_2: "indore"
billing_city: "indore"
billing_postcode: "452010"
billing_country: "IN"
billing_phone: "+919174003172"
```

### Additional Fields
```javascript
brand_voice: "testing"
unique_differentiation: "testing"
top_pain_points: "testing"
primary_call_to_action: "testing"
content_preference_industry: ["Technology","Healthcare","Retail"]  // JSON array
```

### Links
```javascript
links: [
  {"name": "Work With Me", "url": "https://workwithme.com/dsrajput"},
  {"name": "Donations", "url": "https://donation.com/dsrajput"},
  {"name": "Instagram", "url": "https://instagram.com/dsrajput"},
  {"name": "TikTok", "url": "https://tiktok.com/dsrajput"}
]  // JSON array
```

### Consent Fields (Required)
```javascript
consentFeatureName: true
agreeTerms: true
confimInFoAccurate: true
```

### Files
```javascript
signature: File(signature.png)
profilePicture: File(profile.png) or ""
```

## Complete FormData Mapping

| Frontend State | API Key | Type | Notes |
|---------------|---------|------|-------|
| `state.first_name` | `firstName` | string | |
| `state.last_name` | `lastName` | string | |
| `state.email` | `email` | string | From step 1 |
| `state.company_name` | `companyName` | string | |
| `state.company_website` | `companyWebsite` | string | |
| `state.industry` | `industry` | string | |
| `state.num_employees` | `numEmployees` | string | ⚠️ NOT numberOfEmployees |
| `state.email_list_size` | `emailListSize` | string | ⚠️ NOT contactEmailListSize |
| `state.billing_address_1` | `billing_address_1` | string | |
| `state.billing_address_2` | `billing_address_2` | string | |
| `state.billing_city` | `billing_city` | string | |
| `state.billing_postcode` | `billing_postcode` | string | |
| `state.billing_country` | `billing_country` | string | |
| `state.billing_phone` | `billing_phone` | string | |
| `state.brand_voice` | `brand_voice` | string | |
| `state.unique_differentiation` | `unique_differentiation` | string | |
| `state.top_pain_points` | `top_pain_points` | string | |
| `state.primary_call_to_action` | `primary_call_to_action` | string | |
| `state.date_of_birth` | `date_of_birth` | string | |
| `state.occupation` | `occupation` | string | |
| `state.content_preference_industry` | `content_preference_industry` | JSON string | Array of industries |
| `state.links` | `links` | JSON string | Array of {name, url} |
| `signData.signatureFile` | `signature` | File | |
| `state.profilePicture` | `profilePicture` | File or "" | |
| - | `consentFeatureName` | string | Always "true" |
| - | `agreeTerms` | string | Always "true" |
| - | `confimInFoAccurate` | string | Always "true" |

## Key Differences from Previous Implementation

### Changed Keys:
1. ❌ `numberOfEmployees` → ✅ `numEmployees`
2. ❌ `contactEmailListSize` → ✅ `emailListSize`
3. ❌ `profile_picture` → ✅ `profilePicture`

### Added Fields:
1. ✅ `email` - User's email from step 1
2. ✅ `consentFeatureName` - Consent checkbox
3. ✅ `agreeTerms` - Terms agreement
4. ✅ `confimInFoAccurate` - Info accuracy confirmation

### Removed Fields:
1. ❌ `about` - Not in API spec (was extra)

## Implementation Code

```javascript
// Personal info
if (state.first_name) formData.append('firstName', state.first_name);
if (state.last_name) formData.append('lastName', state.last_name);
if (state.email) formData.append('email', state.email);

// Company info
if (state.company_name) formData.append('companyName', state.company_name);
if (state.company_website) formData.append('companyWebsite', state.company_website);
if (state.industry) formData.append('industry', state.industry);
if (state.num_employees) formData.append('numEmployees', state.num_employees);
if (state.email_list_size) formData.append('emailListSize', state.email_list_size);

// Billing address
if (state.billing_address_1) formData.append('billing_address_1', state.billing_address_1);
if (state.billing_address_2) formData.append('billing_address_2', state.billing_address_2);
if (state.billing_city) formData.append('billing_city', state.billing_city);
if (state.billing_postcode) formData.append('billing_postcode', state.billing_postcode);
if (state.billing_country) formData.append('billing_country', state.billing_country);
if (state.billing_phone) formData.append('billing_phone', state.billing_phone);

// Additional fields
if (state.brand_voice) formData.append('brand_voice', state.brand_voice);
if (state.unique_differentiation) formData.append('unique_differentiation', state.unique_differentiation);
if (state.top_pain_points) formData.append('top_pain_points', state.top_pain_points);
if (state.primary_call_to_action) formData.append('primary_call_to_action', state.primary_call_to_action);
if (state.date_of_birth) formData.append('date_of_birth', state.date_of_birth);
if (state.occupation) formData.append('occupation', state.occupation);

// Arrays as JSON
if (state.content_preference_industry?.length > 0) {
  formData.append('content_preference_industry', JSON.stringify(state.content_preference_industry));
}
if (state.links?.length > 0) {
  formData.append('links', JSON.stringify(state.links));
}

// Consent fields
formData.append('consentFeatureName', 'true');
formData.append('agreeTerms', 'true');
formData.append('confimInFoAccurate', 'true');

// Files
if (signData.signatureFile) {
  formData.append('signature', signData.signatureFile);
}
if (state.profilePicture) {
  formData.append('profilePicture', profilePictureFile);
} else {
  formData.append('profilePicture', '');
}
```

## Status
✅ All keys corrected to match API spec
✅ Consent fields added
✅ Email field added
✅ Build successful
✅ Ready for API testing
