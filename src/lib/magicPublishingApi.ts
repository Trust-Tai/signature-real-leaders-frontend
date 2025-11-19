// Magic Publishing API service
import { authFetch } from './authUtils';

const BASE_URL = 'https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/magic-publishing';

export interface GenerateArticlesRequest {
  topic?: string;
  article_count?: number;
  article_length?: number;
  tone?: string;
  focus_topics?: string[];
  include_hashtags?: boolean;
  platform_optimization?: string;
}

export interface GenerateBookRequest {
  book_title: string;
  book_genre: string;
  chapter_count: number;
  writing_style: string;
}

export interface GenerateSocialPostsRequest {
  topic: string;
  platforms?: string;
  post_style?: string;
  include_hashtags?: boolean;
  include_emojis?: boolean;
  include_call_to_action?: boolean;
  post_length?: string;
}

export interface TopicSuggestion {
  topic: string;
  description: string;
  category: string;
  difficulty: string;
  trending_score: number;
  content_angle: string;
}

export interface GenerateArticlesResponse {
  success: boolean;
  message: string;
  content_id: number;
  request_id: string;
  estimated_completion: string;
}

export interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

export interface Chapter {
  chapter_number: number;
  title: string;
  content: string;
  key_points?: string[];
  exercises?: unknown[];
  case_study?: string;
  summary?: string;
}

export interface Book {
  title: string;
  genre: string;
  writing_style: string;
  outline: string;
  chapters: Chapter[];
}

export interface BookContent {
  title: string;
  summary?: string;
  target_audience?: string;
  chapters: Chapter[];
  conclusion?: string;
  about_author?: string;
}

export interface ArticleContent {
  articles: Article[];
}

export interface SocialPost {
  platform: string;
  hook_line: string;
  content: string;
  call_to_action: string;
  hashtags: string;
  visual_description: string;
  engagement_tip: string;
}

export interface SocialPostsContent {
  social_posts: SocialPost[];
}

export interface GeneratedContent {
  id: string;
  title: string;
  content_type: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  request_id: string;
  generated_content?: BookContent | ArticleContent | SocialPostsContent | {
    articles?: Article[];
    book?: Book;
    social_posts?: SocialPost[];
  };
  generated_content_json?: string;
  error_message?: string;
  generation_params?: Record<string, unknown>;
}

export interface GetContentResponse {
  success: boolean;
  content: GeneratedContent;
}

export interface DeleteContentResponse {
  success: boolean;
  message: string;
}

export interface GenerationRequest {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  updated_at: string;
  request_id: string;
  generated_content: BookContent | ArticleContent | SocialPostsContent | { articles?: Article[]; book?: Book; social_posts?: SocialPost[] } | boolean | null;
  generated_content_json: string;
  content_preview: string;
  content_summary: string;
  word_count: number;
  error_message: string;
  tags: string[];
  categories: string[];
  // Legacy fields for backward compatibility
  duration?: string;
  requested_count?: number;
  generated_count?: number;
  items_with_images?: number;
  completion_percentage?: number;
  generation_params?: Record<string, unknown> | null;
  preview?: string;
}

export interface GetAllContentResponse {
  success: boolean;
  generation_requests: GenerationRequest[];
}

// Generate articles
export const generateArticles = async (params: GenerateArticlesRequest, token: string): Promise<GenerateArticlesResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/generate-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating articles:', error);
    throw error;
  }
};

// Generate book
export const generateBook = async (params: GenerateBookRequest, token: string): Promise<GenerateArticlesResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/generate-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating book:', error);
    throw error;
  }
};

// Generate social posts
export const generateSocialPosts = async (params: GenerateSocialPostsRequest, token: string): Promise<GenerateArticlesResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/generate-social-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating social posts:', error);
    throw error;
  }
};

// Generate topics
export const generateTopics = async (token: string): Promise<GenerateArticlesResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/generate-topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
};

// Get generated content by ID
export const getGeneratedContent = async (contentId: string, token: string): Promise<GetContentResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/get-content/${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching generated content:', error);
    throw error;
  }
};







// Get all content by type (articles, books, etc.) with search and filter options
export const getAllContent = async (
  type: string, 
  token: string, 
  options?: {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    order?: 'ASC' | 'DESC';
    page?: number;
    per_page?: number;
  }
) => {
  try {
    const params = new URLSearchParams({ type });
    
    if (options?.search) {
      params.append('search', options.search);
    }
    if (options?.status) {
      params.append('status', options.status);
    }
    if (options?.date_from) {
      params.append('date_from', options.date_from);
    }
    if (options?.date_to) {
      params.append('date_to', options.date_to);
    }
    if (options?.order) {
      params.append('order', options.order);
    }
    if (options?.page) {
      params.append('page', options.page.toString());
    }
    if (options?.per_page) {
      params.append('per_page', options.per_page.toString());
    }

    const response = await authFetch(`${BASE_URL}/get-all-content?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all content:', error);
    throw error;
  }
};

// Delete generated content
export const deleteGeneratedContent = async (contentId: string): Promise<DeleteContentResponse> => {
  try {
    const response = await authFetch(`${BASE_URL}/delete-content/${contentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting generated content:', error);
    throw error;
  }
};

// Poll for content completion with improved error handling and logging
export const pollForCompletion = async (
  contentId: string,
  onUpdate: (content: GeneratedContent) => void,
  onComplete: (content: GeneratedContent) => void,
  onError: (error: string) => void,
  onRefreshAll: () => Promise<void>,
  onPollingComplete?: () => void,
  interval: number = 10000 // Changed to 10 seconds as requested
): Promise<void> => {
  console.log(`[Polling] Starting polling for content ID: ${contentId}`);

  const poll = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('[Polling] No auth token found');
        onError('Authentication token not found');
        return;
      }

      console.log(`[Polling] Checking status for content ID: ${contentId} at ${new Date().toLocaleTimeString()}`);
      const response = await getGeneratedContent(contentId, token);

      if (response.success && response.content) {
        console.log(`[Polling] Content status: ${response.content.status}`);
        onUpdate(response.content);

        if (response.content.status === 'completed') {
          console.log(`[Polling] Content completed! Calling onComplete and refreshing all data`);
          onComplete(response.content);
          // Refresh all data when content is completed
          await onRefreshAll();
          // Call the polling complete callback if provided
          if (onPollingComplete) {
            onPollingComplete();
          }
          return;
        } else if (response.content.status === 'failed') {
          console.log(`[Polling] Content failed: ${response.content.error_message}`);
          onError(response.content.error_message || 'Content generation failed');
          return;
        }

        // Continue polling if still pending
        console.log(`[Polling] Content still processing, will check again in ${interval / 1000} seconds`);
        setTimeout(poll, interval);
      } else {
        console.error('[Polling] Failed to fetch content status');
        onError('Failed to fetch content status');
      }
    } catch (error) {
      console.error('[Polling] Error:', error);
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  poll();
};
