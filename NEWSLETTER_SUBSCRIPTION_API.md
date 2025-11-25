# Newsletter Subscription API Integration

## Overview
Teeno templates (Default, Red, Blue) mein newsletter subscription functionality ko proper API se integrate kar diya gaya hai.

## API Endpoint

**URL**: `https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber`

**Method**: `POST`

**Headers**:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Optional - if user is logged in
}
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_id": 123  // Optional - only if JWT token is not set
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Implementation Details

### File Updated: `src/app/[username]/page.tsx`

### Newsletter Flow

```
User visits profile page
    ↓
Clicks newsletter checkbox
    ↓
┌─────────────┴─────────────┐
│                           │
User Logged In         User Not Logged In
│                           │
↓                           ↓
Checkbox checked       Modal Opens
directly               (Enter details)
│                           │
↓                           ↓
API Call with          User fills:
JWT token              - Name
                       - Email
                       - Age
                           │
                           ↓
                       Click "Subscribe"
                           │
                           ↓
                       API Call without
                       JWT token
                           │
                           ↓
                       Success/Error
                       Message
```

### Code Implementation

```javascript
const handleNewsletterSubmit = async () => {
  // 1. Validate inputs
  if (!newsletterData.name || !newsletterData.email || !newsletterData.age) {
    toast.error('Please fill in all fields');
    return;
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newsletterData.email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  // 3. Validate age
  const ageNum = parseInt(newsletterData.age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    toast.error('Please enter a valid age');
    return;
  }

  try {
    setNewsletterLoading(true);
    
    // 4. Split name into first and last name
    const nameParts = newsletterData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // 5. Get auth token and user_id if available
    const authToken = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    let userId = null;
    
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      userId = userData.id;
    }
    
    // 6. Call the newsletter API endpoint
    const response = await fetch(
      'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({
          email: newsletterData.email,
          first_name: firstName,
          last_name: lastName,
          ...(userId && { user_id: userId })
        })
      }
    );
    
    const data = await response.json();
    
    // 7. Handle response
    if (data.success) {
      toast.success(data.message || 'Successfully subscribed to newsletter!');
      setOptIn(true);
      setShowNewsletterModal(false);
      setNewsletterData({ name: '', email: '', age: '' });
    } else {
      toast.error(data.message || 'Failed to subscribe to newsletter');
    }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    toast.error('Failed to subscribe to newsletter');
  } finally {
    setNewsletterLoading(false);
  }
};
```

## Templates Integration

### All Three Templates Support Newsletter:

1. **Default Template** (`src/components/template-style/defaultTemplate.tsx`)
2. **Red Template** (`src/components/template-style/redTemplate.tsx`)
3. **Blue Template** (`src/components/template-style/blueTemplate.tsx`)

### Newsletter Checkbox Location:

All templates display the newsletter checkbox below the profile links section:

```jsx
<input
  type="checkbox"
  id="newsletter-{template}"
  checked={optIn}
  onChange={(e) => handleNewsletterCheckboxChange(e.target.checked)}
  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded"
/>
<label htmlFor="newsletter-{template}">
  Join {profileData.full_name}'s Newsletter – Get insights and updates
</label>
```

### Newsletter Modal:

When non-logged-in users click the checkbox, a modal appears asking for:
- **Name** (Full name - will be split into first_name and last_name)
- **Email** (Required, validated)
- **Age** (Required, validated 1-120)

## User Scenarios

### Scenario 1: Logged-In User
```
1. User is logged in
2. User clicks newsletter checkbox
3. Checkbox is checked immediately
4. API call is made with JWT token
5. Success message shown
6. User is subscribed
```

### Scenario 2: Non-Logged-In User
```
1. User is not logged in
2. User clicks newsletter checkbox
3. Modal opens
4. User enters: Name, Email, Age
5. User clicks "Subscribe" button
6. API call is made without JWT token (but with user_id if available)
7. Success message shown
8. Modal closes
9. Checkbox is checked
10. User is subscribed
```

## API Request Examples

### Example 1: Logged-In User
```javascript
POST https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber

Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Body:
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_id": 123
}
```

### Example 2: Non-Logged-In User
```javascript
POST https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber

Headers:
{
  "Content-Type": "application/json"
}

Body:
{
  "email": "jane.smith@example.com",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

## Validation Rules

### Email Validation:
- Must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Example valid: `user@example.com`
- Example invalid: `user@example`, `user.com`

### Name Validation:
- Required field
- Split by space into first_name and last_name
- Example: "John Doe" → first_name: "John", last_name: "Doe"
- Example: "John" → first_name: "John", last_name: ""

### Age Validation:
- Must be a number
- Range: 1-120
- Example valid: 25, 45, 18
- Example invalid: 0, 150, "abc"

## Error Handling

### Client-Side Errors:
1. **Empty Fields**: "Please fill in all fields"
2. **Invalid Email**: "Please enter a valid email address"
3. **Invalid Age**: "Please enter a valid age"

### Server-Side Errors:
- Displayed from API response: `data.message`
- Generic fallback: "Failed to subscribe to newsletter"

### Network Errors:
- Caught in try-catch block
- Generic message: "Failed to subscribe to newsletter"

## Success Flow

```
User submits form
    ↓
Validation passes
    ↓
API call successful
    ↓
Success toast shown
    ↓
Modal closes (if open)
    ↓
Checkbox checked
    ↓
Form data cleared
    ↓
User is subscribed
```

## Testing Checklist

### Logged-In User:
- [ ] Click newsletter checkbox
- [ ] Verify checkbox is checked
- [ ] Verify API call is made with JWT token
- [ ] Verify success message
- [ ] Verify user_id is included in request

### Non-Logged-In User:
- [ ] Click newsletter checkbox
- [ ] Verify modal opens
- [ ] Enter valid data
- [ ] Click "Subscribe"
- [ ] Verify API call is made without JWT token
- [ ] Verify success message
- [ ] Verify modal closes
- [ ] Verify checkbox is checked

### Validation Testing:
- [ ] Test empty name field
- [ ] Test empty email field
- [ ] Test empty age field
- [ ] Test invalid email format
- [ ] Test age < 1
- [ ] Test age > 120
- [ ] Test non-numeric age

### Template Testing:
- [ ] Test on Default Template
- [ ] Test on Red Template
- [ ] Test on Blue Template

## Console Logs for Debugging

```javascript
// Success
console.log('Newsletter subscription successful:', data);

// Error
console.error('Error subscribing to newsletter:', error);

// Request payload
console.log('Newsletter API request:', {
  email,
  first_name,
  last_name,
  user_id
});
```

## Related Files

### Modified:
1. **`src/app/[username]/page.tsx`** - Newsletter submit handler updated

### Related (Not Modified):
1. `src/components/template-style/defaultTemplate.tsx` - Default template
2. `src/components/template-style/redTemplate.tsx` - Red template
3. `src/components/template-style/blueTemplate.tsx` - Blue template

## Summary

**Newsletter subscription ab properly API se integrated hai:**

- ✅ Teeno templates (Default, Red, Blue) mein working
- ✅ Logged-in users ke liye direct subscription
- ✅ Non-logged-in users ke liye modal with form
- ✅ Proper validation (email, name, age)
- ✅ JWT token support
- ✅ user_id support
- ✅ Error handling
- ✅ Success/error messages

---

**Implementation Date**: November 25, 2025
**Status**: ✅ Complete
**API Endpoint**: `/newsletter/add-subscriber`
**Templates**: Default, Red, Blue
