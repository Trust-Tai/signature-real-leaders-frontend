import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  generateArticles, 
  generateBook,
  getGeneratedContent, 
  getAllGenerationRequests,
  deleteGeneratedContent, 
  pollForCompletion,
  GenerateArticlesRequest,
  GenerateBookRequest,
  GenerationRequest 
} from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';

export const useMagicPublishing = (contentType: 'article' | 'book' = 'article') => {
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
      
      console.log('[Hook] Fetching all generation requests...');
      const response = await getAllGenerationRequests(token, 1, 10, contentType);
      
      if (response.success && response.generation_requests) {
        console.log('[Hook] Fetched generation requests:', response.generation_requests.length);
        setGeneratedContents(response.generation_requests);
      }
    } catch (error) {
      console.error('[Hook] Error fetching generation requests:', error);
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
          content_type: 'articles',
          status: 'processing',
          created_at: new Date().toISOString(),
          duration: '0s',
          request_id: response.request_id,
          requested_count: params.article_count,
          generated_count: 0,
          items_with_images: 0,
          completion_percentage: 0,
          generation_params: params as unknown as Record<string, unknown>,
          error_message: '',
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
          fetchAllGenerationRequests // Pass the refresh function
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
  }, [fetchAllGenerationRequests, router]);

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
          content_type: 'books',
          status: 'processing',
          created_at: new Date().toISOString(),
          duration: '0s',
          request_id: response.request_id,
          requested_count: params.chapter_count,
          generated_count: 0,
          items_with_images: 0,
          completion_percentage: 0,
          generation_params: params as unknown as Record<string, unknown>,
          error_message: '',
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
          fetchAllGenerationRequests // Pass the refresh function
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
  }, [fetchAllGenerationRequests, router]);

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




