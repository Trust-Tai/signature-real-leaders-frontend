# Newsletter Subscribers API Documentation

## Overview
This module provides functionality to manage newsletter subscribers using the Verified Real Leaders API.

## API Endpoints

### 1. Get Newsletter Statistics
- **Endpoint**: `GET /wp-json/verified-real-leaders/v1/newsletter/stats`
- **Description**: Retrieves overall newsletter statistics
- **Authentication**: Required (Bearer token)
- **Response**: Total subscribers, active subscribers, unsubscribed users, growth rate

### 2. Get All Subscribers
- **Endpoint**: `GET /wp-json/verified-real-leaders/v1/newsletter/subscribers`
- **Description**: Retrieves paginated list of subscribers with optional filtering
- **Authentication**: Required (Bearer token)
- **Parameters**:
  - `status`: 'active' | 'unsubscribed'
  - `search`: Search term for name/email
  - `date_from`: Start date (YYYY-MM-DD)
  - `date_to`: End date (YYYY-MM-DD)
  - `page`: Page number
  - `per_page`: Items per page

## Features Implemented

### Dynamic Data Loading
- Real-time fetching from API endpoints
- Loading states and error handling
- Automatic refresh on filter changes

### Filtering System
- Status filtering (Active/Unsubscribed)
- Date range filtering (predefined and custom ranges)
- Search functionality (name and email)
- Multiple active filters with individual removal

### Pagination
- Dynamic pagination based on API response
- Page navigation with proper state management
- Responsive pagination controls

### Export Functionality
- CSV export of filtered subscriber data
- Includes all subscriber fields
- Proper CSV formatting with quoted values

### Responsive Design
- Mobile-optimized card view
- Desktop table view
- Responsive pagination and controls

## Usage Example

```typescript
import { getNewsletterStats, getNewsletterSubscribers } from '@/lib/newsletterApi';

// Note: Authentication token must be stored in localStorage as 'auth_token'
// This is handled automatically by the auth system

// Get statistics
const stats = await getNewsletterStats();

// Get subscribers with filters
const subscribers = await getNewsletterSubscribers({
  status: 'active',
  search: 'john',
  date_from: '2025-10-01',
  date_to: '2025-10-25',
  page: 1,
  per_page: 20
});
```

## Helper Functions

- `formatDateForAPI()`: Formats Date object for API
- `getDateRange()`: Generates date ranges for filters
- `validateDateRange()`: Validates date range inputs
- `getStatusDisplayText()`: Formats status text
- `formatSubscriberCount()`: Formats large numbers
- `calculateGrowthPercentage()`: Calculates growth rates

## Error Handling

The API functions include comprehensive error handling:
- Network errors
- HTTP status errors
- JSON parsing errors
- User-friendly error messages

## Future Enhancements

1. Add subscriber creation/editing API calls
2. Implement real-time updates
3. Add bulk operations
4. Enhanced filtering options
5. Advanced export formats (Excel, PDF)