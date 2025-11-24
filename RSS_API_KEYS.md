# RSS Feed API Keys Documentation

## Overview
This document describes the API keys used for RSS feed functionality.

## API Keys

### 1. Profile Update API (Saving RSS Feed URL)
**Endpoint:** `POST /api/profile/update`

**Request Body:**
```json
{
  "rss_feed_url": "https://example.com/feed.xml"
}
```

**Key Details:**
- **Key Name:** `rss_feed_url`
- **Type:** String
- **Description:** The RSS feed URL entered by the user
- **Example:** `"https://example.com/podcast/feed.xml"`

---

### 2. User Details API (Receiving RSS Feed Data)
**Endpoint:** `GET /api/user-details`

**Response Body:**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "username": "johndoe",
    "rss_feed_url": "https://example.com/feed.xml",
    "rss_feed_html": "<div>...parsed RSS content...</div>",
    ...
  }
}
```

**Key Details:**

#### `rss_feed_url`
- **Type:** String
- **Description:** The original RSS feed URL saved by the user
- **Example:** `"https://example.com/podcast/feed.xml"`

#### `rss_feed_html`
- **Type:** String (HTML)
- **Description:** Parsed and formatted HTML content from the RSS feed
- **Example:** `"<div class='rss-item'><h3>Episode Title</h3><p>Description...</p></div>"`
- **Usage:** Can be rendered directly in the UI using `dangerouslySetInnerHTML` or parsed further

---

## Implementation Notes

### Frontend (TypeScript Interfaces)

```typescript
interface User {
  rss_feed_url: string;      // Original RSS URL
  rss_feed_html: string;      // Parsed HTML content
  // ... other fields
}

interface ProfileData {
  rss_feed_url: string;       // Original RSS URL
  rss_feed_html: string;      // Parsed HTML content
  // ... other fields
}
```

### Saving RSS Feed URL
```typescript
const updateData = {
  rss_feed_url: "https://example.com/feed.xml"
};

await api.updateProfile(token, updateData);
```

### Displaying RSS Feed Content
```typescript
// Option 1: Use the URL to link to the feed
<a href={user.rss_feed_url} target="_blank">
  Subscribe to RSS Feed
</a>

// Option 2: Display parsed HTML content
<div dangerouslySetInnerHTML={{ __html: user.rss_feed_html }} />
```

---

## Backend Processing

The backend should:
1. Accept `rss_feed_url` from the profile update request
2. Validate the URL format
3. Fetch and parse the RSS feed
4. Convert RSS XML to HTML format
5. Store both `rss_feed_url` and `rss_feed_html` in the database
6. Return both fields in the user-details API response

---

## Security Considerations

1. **URL Validation:** Validate RSS feed URLs before saving
2. **HTML Sanitization:** Sanitize `rss_feed_html` to prevent XSS attacks
3. **Rate Limiting:** Limit RSS feed fetching to prevent abuse
4. **Caching:** Cache parsed RSS content to reduce server load
5. **Error Handling:** Handle invalid or unreachable RSS feeds gracefully

---

## Example RSS Feed Parsing

### Input (RSS XML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Podcast</title>
    <item>
      <title>Episode 1: Introduction</title>
      <description>Welcome to my podcast!</description>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <link>https://example.com/episode-1</link>
    </item>
  </channel>
</rss>
```

### Output (HTML):
```html
<div class="rss-feed">
  <div class="rss-item">
    <h3>Episode 1: Introduction</h3>
    <p>Welcome to my podcast!</p>
    <span class="date">January 15, 2024</span>
    <a href="https://example.com/episode-1">Read more</a>
  </div>
</div>
```

---

## Files Updated

1. `src/components/UserContext.tsx` - Added `rss_feed_html` to User interface
2. `src/app/[username]/page.tsx` - Added `rss_feed_html` to ProfileData interface
3. `src/app/dashboard/profile/page.tsx` - Saves `rss_feed_url` on profile update

---

## Future Enhancements

1. Real-time RSS feed updates
2. RSS feed preview before saving
3. Multiple RSS feeds per user
4. RSS feed categories/tags
5. RSS feed analytics
