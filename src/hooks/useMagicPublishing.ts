import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  generateArticles, 
  getGeneratedContent, 
  getAllGenerationRequests,
  deleteGeneratedContent, 
  pollForCompletion,
  GenerateArticlesRequest,
  GenerationRequest 
} from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';

export const useMagicPublishing = () => {
  const router = useRouter();
  const [generatedContents, setGeneratedContents] = useState<GenerationRequest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingContentIds, setPendingContentIds] = useState<Set<string>>(new Set());

  const fetchAllGenerationRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        router.push('/login');
        return;
      }
      
      console.log('[Hook] Fetching all generation requests...');
      const response = await getAllGenerationRequests(token, 1, 10, 'articles');
      
      if (response.success && response.generation_requests) {
        console.log('[Hook] Fetched generation requests:', response.generation_requests.length);
        setGeneratedContents(response.generation_requests);
      }
    } catch (error) {
      console.error('[Hook] Error fetching generation requests:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [router]);

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
        return;
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
        setPendingContentIds(prev => new Set([...prev, response.content_id.toString()]));

        // Create immediate UI feedback - add pending card
        const newPendingContent: GenerationRequest = {
          id: response.content_id,
          title: `Generating ${params.article_count} Articles...`,
          content_type: 'articles',
          status: 'pending',
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
        setGeneratedContents(prev => [newPendingContent, ...prev]);

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
            setPendingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(content.id);
              return newSet;
            });
            
            // Show completion toast
            toast.success(`🎉 Articles generated successfully! ${content.generated_content?.articles?.length || 0} articles ready.`, {
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
            setPendingContentIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(response.content_id.toString());
              return newSet;
            });
          },
          fetchAllGenerationRequests // Pass the refresh function
        );
      } else {
        console.error('[Hook] Failed to start article generation:', response);
        setError('Failed to start article generation');
        toast.error('Failed to start article generation');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('[Hook] Exception during article generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setIsGenerating(false);
    }
  }, [fetchAllGenerationRequests]);

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
  }, [router]);

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
        if (response.content.status === 'completed' && pendingContentIds.has(contentId)) {
          console.log('[Hook] Content completed during refresh, fetching all data');
          setPendingContentIds(prev => {
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
  }, [pendingContentIds, fetchAllGenerationRequests]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generatedContents,
    isGenerating,
    error,
    pendingContentIds,
    handleGenerateArticles,
    handleDeleteContent,
    refreshContent,
    fetchAllGenerationRequests,
    clearError,
  };
};




