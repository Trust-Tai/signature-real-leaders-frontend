// Simple test file to verify newsletter API functions
import { getDateRange, formatDateForAPI } from './newsletterApi';

// Test date formatting
console.log('Testing formatDateForAPI:');
const testDate = new Date('2025-10-25');
console.log('Input:', testDate);
console.log('Output:', formatDateForAPI(testDate));

// Test date range generation
console.log('\nTesting getDateRange:');
const ranges = ['today', 'week', 'month', 'quarter', 'year'];
ranges.forEach(range => {
  const result = getDateRange(range);
  console.log(`${range}:`, result);
});

// Test API URL construction
console.log('\nTesting API URL construction:');
const baseUrl = 'https://real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/subscribers';
const url = new URL(baseUrl);
url.searchParams.append('status', 'active');
url.searchParams.append('search', 'John');
url.searchParams.append('date_from', '2025-10-01');
url.searchParams.append('date_to', '2025-10-25');
console.log('Final URL:', url.toString());

export {};