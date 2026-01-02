# Claim Profile Route

## Overview
A new dynamic route has been created at `/claim-profile` that allows users to claim their profiles by providing an ID parameter.

## Route Structure
- **Path**: `/claim-profile?id={profile_id}`
- **Example**: `http://app.real-leaders.com/claim-profile?id=105816`

## Features

### Layout
- **Left Side**: Sidebar with step indicator (similar to profile-verification)
- **Middle**: Claim profile form
- **Right Side**: Interactive Magazine Cards component

### Form Fields
The form includes the following required fields:
- **CEO Name**: Name of the CEO
- **Website**: Company website URL
- **LinkedIn**: LinkedIn profile URL
- **Share URL**: Shareable URL
- **Email**: Contact email address
- **Location**: Geographic location

### API Integration
- **Endpoint**: `https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/claim-profile`
- **Method**: POST
- **Payload**: 
  ```json
  {
    "id": 105816,
    "ceo": "Wes Dove",
    "website": "https://verified.real-leaders.com/",
    "linkedin": "https://verified.real-leaders.com/",
    "share": "https://verified.real-leaders.com/",
    "email": "taitabajo@gmail.com",
    "location": "new york"
  }
  ```

### User Experience
- Form validation ensures all fields are filled
- Loading states during submission
- Toast notifications for success/error messages
- Form resets after successful submission
- Responsive design matching the existing app style

### Error Handling
- Validates profile ID presence
- Redirects to home if no ID provided
- Shows appropriate error messages via toast notifications
- Handles API errors gracefully

## Usage
Users can access this route with a profile ID to claim their profile. The form will submit the claim request to the API and provide feedback via toast messages.