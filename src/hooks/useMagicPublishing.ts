import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  generateArticles,
  generateBook,
  getGeneratedContent,
  getAllContent,
  deleteGeneratedContent,
  pollForCompletion,
  GenerateArticlesRequest,
  GenerateBookRequest,
  GenerationRequest
} from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';

export const useMagicPublishing = (
  contentType: 'articles' | 'book' = 'articles',
  onPollingComplete?: () => void
) => {
  const router = useRouter();
  const [generatedContents, setGeneratedContents] = useState<GenerationRequest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingContentIds, setProcessingContentIds] = useState<Set<string>>(new Set());

  const fetchAllGenerationRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        router.push('/login');
        return;
      }

      console.log('[Hook] Fetching all content for type:', contentType);
      const response = await getAllContent(contentType, token);
      console.log('[Hook] getAllContent response:', response);

      if (response.success && response.data && response.data.content) {
        console.log('[Hook] Fetched content:', response.data.content.length);

        // Map the new API response format to the expected format
        const mappedContent = response.data.content.map((item: GenerationRequest) => {
          // Handle different data structures for completed vs processing items
          let requestedCount = 0;
          let generatedCount = 0;

          if (item.status === 'completed' && item.generated_content && typeof item.generated_content === 'object') {
            // For completed items, count from generated_content
            if (item.content_type === 'articles' && 'articles' in item.generated_content && item.generated_content.articles) {
              requestedCount = item.generated_content.articles.length;
              generatedCount = item.generated_content.articles.length;
            } else if (item.content_type === 'book' && 'chapters' in item.generated_content && item.generated_content.chapters) {
              requestedCount = item.generated_content.chapters.length;
              generatedCount = item.generated_content.chapters.length;
            }
          } else if (item.status === 'processing') {
            // For processing items, we might not have the final count yet
            requestedCount = 0;
            generatedCount = 0;
          }

          return {
            ...item,
            // Add backward compatibility fields
            duration: item.completed_at ?
              Math.round((new Date(item.completed_at).getTime() - new Date(item.created_at).getTime()) / 1000) + 's' :
              '0s',
            requested_count: requestedCount,
            generated_count: generatedCount,
            items_with_images: 0,
            completion_percentage: item.status === 'completed' ? 100 : item.status === 'processing' ? 50 : 0,
            generation_params: null,
            preview: item.content_preview || item.content_summary || 'No preview available'
          };
        });

        setGeneratedContents(mappedContent);
      }
    } catch (error) {
      console.error('[Hook] Error fetching content:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [router, contentType]);

  const handleGenerateArticles = useCallback(async (params: GenerateArticlesRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        toast.error('Authentication token not found');
        setIsGenerating(false);
        router.push('/login');
        return null;
      }

      console.log('[Hook] Starting article generation with params:', params);
      toast.info('Starting article generation...', { autoClose: 2000 });

      const response = await generateArticles(params, token);

      if (response.success) {
        console.log('[Hook] Article generation started successfully:', response);

        // Show success toast
        toast.success(`Article generation started! Generating ${params.article_count} articles...`, {
          autoClose: 3000
        });

        // Add content ID to pending set
        setProcessingContentIds(prev => new Set([...prev, response.content_id.toString()]));

        // Create immediate UI feedback - add pending card
        const newProcessingContent: GenerationRequest = {
          id: response.content_id,
          title: `Generating ${params.article_count} Articles...`,
          slug: `generating-articles-${response.content_id}`,
          content_type: 'articles',
          status: 'processing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          request_id: response.request_id,
          generated_content: false,
          generated_content_json: '',
          content_preview: `Generating ${params.article_count} articles with ${params.tone} tone...`,
          content_summary: 'Generation in progress...',
          word_count: 0,
          error_message: '',
          tags: [],
          categories: [],
          // Legacy fields for backward compatibility
          duration: '0s',
          requested_count: params.article_count,
          generated_count: 0,
          items_with_images: 0,
          completion_percentage: 0,
          generation_params: params as unknown as Record<string, unknown>,
          preview: `Generating ${params.article_count} articles with ${params.tone} tone...`
        };

        // Add to the beginning of the list for immediate feedback
        setGeneratedContents(prev => [newProcessingContent, ...prev]);

        // Start polling for completion
        pollForCompletion(
          response.content_id.toString(),
          (content) => {
            console.log('[Hook] Polling update received:', content.status);
            // Update the content in the list during polling
            setGeneratedContents(prev =>
              prev.map(item =>
                item.id.toString() === content.id ? {
                  ...item,
                  status: content.status
                } : item
              )
            );
          },
          (content) => {
            console.log('[Hook] Content generation completed!', content);
            // Content generation completed
            setProcessingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(content.id);
              return newSet;
            });

            // Show completion toast
            const articlesCount = content.generated_content && 'articles' in content.generated_content ? content.generated_content.articles?.length || 0 : 0;
            toast.success(`🎉 Articles generated successfully! ${articlesCount} articles ready.`, {
              autoClose: 5000
            });

            setIsGenerating(false);

            // Call the polling complete callback if provided
            if (onPollingComplete) {
              console.log('[Hook] Article polling completed, calling callback to refresh ArticlesList...');
              onPollingComplete();
            } else {
              console.log('[Hook] No polling complete callback provided for articles');
            }
          },
          (errorMessage) => {
            console.error('[Hook] Content generation failed:', errorMessage);
            // Handle error
            setError(errorMessage);
            toast.error(`Generation failed: ${errorMessage}`);
            setIsGenerating(false);

            // Remove from pending set
            setProcessingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(response.content_id.toString());
              return newSet;
            });
          },
          fetchAllGenerationRequests, // Pass the refresh function
          onPollingComplete
        );

        // Return the response so caller can access content_id
        return response;
      } else {
        console.error('[Hook] Failed to start article generation:', response);
        setError('Failed to start article generation');
        toast.error('Failed to start article generation');
        setIsGenerating(false);
        return null;
      }
    } catch (error) {
      console.error('[Hook] Exception during article generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setIsGenerating(false);
      return null;
    }
  }, [fetchAllGenerationRequests, router, onPollingComplete]);

  const handleDeleteContent = useCallback(async (contentId: string) => {
    try {
      console.log('[Hook] Deleting content:', contentId);
      const response = await deleteGeneratedContent(contentId);

      if (response.success) {
        setGeneratedContents(prev => prev.filter(content => content.id.toString() !== contentId));
        toast.success('Content deleted successfully');
      } else {
        setError('Failed to delete content');
        toast.error('Failed to delete content');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Delete failed: ${errorMessage}`);
    }
  }, []);

  const refreshContent = useCallback(async (contentId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        router.push('/login');
        return;
      }

      console.log('[Hook] Refreshing content:', contentId);
      const response = await getGeneratedContent(contentId, token);

      if (response.success && response.content) {
        setGeneratedContents(prev =>
          prev.map(item =>
            item.id.toString() === contentId ? {
              ...item,
              status: response.content.status
            } : item
          )
        );

        // If content just completed, refresh all data
        if (response.content.status === 'completed' && processingContentIds.has(contentId)) {
          console.log('[Hook] Content completed during refresh, fetching all data');
          setProcessingContentIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(contentId);
            return newSet;
          });
          await fetchAllGenerationRequests();
        }
      }
    } catch (error) {
      console.error('[Hook] Error refreshing content:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [processingContentIds, fetchAllGenerationRequests, router]);

  const handleGenerateBook = useCallback(async (params: GenerateBookRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        toast.error('Authentication token not found');
        setIsGenerating(false);
        router.push('/login');
        return null;
      }

      console.log('[Hook] Starting book generation with params:', params);
      toast.info('Starting book generation...', { autoClose: 2000 });

      const response = await generateBook(params, token);

      if (response.success) {
        console.log('[Hook] Book generation started successfully:', response);

        // Show success toast
        toast.success(`Book generation started! Generating "${params.book_title}" with ${params.chapter_count} chapters...`, {
          autoClose: 3000
        });

        // Add content ID to pending set
        setProcessingContentIds(prev => new Set([...prev, response.content_id.toString()]));

        // Create immediate UI feedback - add pending card
        const newProcessingContent: GenerationRequest = {
          id: response.content_id,
          title: `Generating "${params.book_title}"...`,
          slug: `generating-book-${response.content_id}`,
          content_type: 'book',
          status: 'processing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          request_id: response.request_id,
          generated_content: false,
          generated_content_json: '',
          content_preview: `Generating "${params.book_title}" - ${params.book_genre} genre with ${params.writing_style} style...`,
          content_summary: 'Book generation in progress...',
          word_count: 0,
          error_message: '',
          tags: [],
          categories: [],
          // Legacy fields for backward compatibility
          duration: '0s',
          requested_count: params.chapter_count,
          generated_count: 0,
          items_with_images: 0,
          completion_percentage: 0,
          generation_params: params as unknown as Record<string, unknown>,
          preview: `Generating "${params.book_title}" - ${params.book_genre} genre with ${params.writing_style} style...`
        };

        // Add to the beginning of the list for immediate feedback
        setGeneratedContents(prev => [newProcessingContent, ...prev]);

        // Start polling for completion
        pollForCompletion(
          response.content_id.toString(),
          (content) => {
            console.log('[Hook] Polling update received:', content.status);
            // Update the content in the list during polling
            setGeneratedContents(prev =>
              prev.map(item =>
                item.id.toString() === content.id ? {
                  ...item,
                  status: content.status
                } : item
              )
            );
          },
          (content) => {
            console.log('[Hook] Book generation completed!', content);
            // Content generation completed
            setProcessingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(content.id);
              return newSet;
            });

            // Show completion toast
            const chaptersCount = content.generated_content && 'chapters' in content.generated_content ? content.generated_content.chapters?.length || 0 : 0;
            toast.success(`🎉 Book generated successfully! "${params.book_title}" is ready with ${chaptersCount} chapters.`, {
              autoClose: 5000
            });

            setIsGenerating(false);

            // Call the polling complete callback if provided
            if (onPollingComplete) {
              console.log('[Hook] Book polling completed, calling callback to refresh BooksList...');
              onPollingComplete();
            } else {
              console.log('[Hook] No polling complete callback provided for book');
            }
          },
          (errorMessage) => {
            console.error('[Hook] Book generation failed:', errorMessage);
            // Handle error
            setError(errorMessage);
            toast.error(`Generation failed: ${errorMessage}`);
            setIsGenerating(false);

            // Remove from pending set
            setProcessingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(response.content_id.toString());
              return newSet;
            });
          },
          fetchAllGenerationRequests, // Pass the refresh function
          onPollingComplete
        );

        // Return the response so caller can access content_id
        return response;
      } else {
        console.error('[Hook] Failed to start book generation:', response);
        setError('Failed to start book generation');
        toast.error('Failed to start book generation');
        setIsGenerating(false);
        return null;
      }
    } catch (error) {
      console.error('[Hook] Exception during book generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setIsGenerating(false);
      return null;
    }
  }, [fetchAllGenerationRequests, router, onPollingComplete]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generatedContents,
    isGenerating,
    error,
    processingContentIds,
    handleGenerateArticles,
    handleGenerateBook,
    handleDeleteContent,
    refreshContent,
    fetchAllGenerationRequests,
    clearError,
  };
};




