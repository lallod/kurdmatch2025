
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { LandingPageContent, initialContent } from '../types';

export const useLandingPageContent = (retryCount = 0) => {
  const { toast } = useToast();
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load content from the database on hook initialization
  useEffect(() => {
    const fetchLandingPageContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching landing page content...');
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching landing page content:', error);
          
          // Handle specific database errors
          if (error.code === 'PGRST116') {
            console.log('No content found, will initialize with defaults');
            // No content found, initialize the database with default content
            await initializeDefaultContent();
          } else {
            setError(`Failed to load content: ${error.message}`);
            toast({
              title: "Failed to load content",
              description: "Could not load landing page content from the database.",
              variant: "destructive"
            });
          }
        } else if (data) {
          console.log('Content found:', data);
          // Type safety: convert data.content to LandingPageContent with proper type checking
          const contentData = data.content as Json;
          
          // Only set the state if it has the expected structure
          if (isValidLandingPageContent(contentData)) {
            setContent(contentData as unknown as LandingPageContent);
          } else {
            console.error('Invalid landing page content format:', contentData);
            setError('The content stored in the database has an invalid format.');
            toast({
              title: "Invalid content format",
              description: "The content stored in the database has an invalid format.",
              variant: "destructive"
            });
          }
        } else {
          // No data found, initialize the database with default content
          console.log('No landing page content found, initializing with defaults');
          await initializeDefaultContent();
        }
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(`An unexpected error occurred: ${error.message}`);
        toast({
          title: "An error occurred",
          description: "An unexpected error occurred while loading the content.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Helper function to initialize default content - moved inside the useEffect to avoid re-renders
    const initializeDefaultContent = async () => {
      try {
        console.log('Initializing with default content...');
        
        // Set the default content in state first so UI can render even if DB fails
        setContent(initialContent);
        
        const { error: insertError } = await supabase
          .from('landing_page_content')
          .upsert({ 
            id: 1,
            content: initialContent as unknown as Json,
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error initializing landing page content:', insertError);
          setError(`Failed to initialize content: ${insertError.message}`);
          toast({
            title: "Error initializing content",
            description: "Could not save default content to the database. You can still edit, but changes may not persist.",
            variant: "destructive"
          });
        } else {
          console.log('Default content initialized successfully');
        }
      } catch (error: any) {
        console.error('Error in initializeDefaultContent:', error);
        setError(`Failed to initialize with default content: ${error.message}`);
      }
    };

    // Helper function to validate content structure
    const isValidLandingPageContent = (data: any): boolean => {
      return (
        typeof data === 'object' && 
        data !== null && 
        !Array.isArray(data) &&
        'hero' in data && 
        'features' in data && 
        'kurdistan' in data && 
        'footer' in data
      );
    };

    fetchLandingPageContent();
  }, [toast, retryCount]); // Only re-run if toast or retryCount changes

  // Make sure we always have content to work with
  const safeContent = content || initialContent;

  // Update hero section content - memoized to prevent unnecessary re-renders
  const updateHero = useCallback((field: keyof LandingPageContent['hero'], value: string) => {
    setContent(prev => {
      if (!prev) return { ...initialContent, hero: { ...initialContent.hero, [field]: value } };
      return {
        ...prev,
        hero: { ...prev.hero, [field]: value }
      };
    });
  }, []);

  // Update feature section content - memoized to prevent unnecessary re-renders
  const updateFeatureTitle = useCallback((value: string) => {
    setContent(prev => {
      if (!prev) return { ...initialContent, features: { ...initialContent.features, title: value } };
      return {
        ...prev,
        features: { ...prev.features, title: value }
      };
    });
  }, []);

  // Update feature card - memoized to prevent unnecessary re-renders
  const updateFeatureCard = useCallback((id: string, field: keyof Omit<LandingPageContent['features']['cards'][0], 'id'>, value: string) => {
    setContent(prev => {
      if (!prev) {
        const newContent = { ...initialContent };
        newContent.features.cards = newContent.features.cards.map(card => 
          card.id === id ? { ...card, [field]: value } : card
        );
        return newContent;
      }
      
      return {
        ...prev,
        features: {
          ...prev.features,
          cards: prev.features.cards.map(card => 
            card.id === id ? { ...card, [field]: value } : card
          )
        }
      };
    });
  }, []);

  // Update Kurdistan section - memoized to prevent unnecessary re-renders
  const updateKurdistanSection = useCallback((field: keyof LandingPageContent['kurdistan'], value: string | string[]) => {
    setContent(prev => {
      if (!prev) return { ...initialContent, kurdistan: { ...initialContent.kurdistan, [field]: value } };
      return {
        ...prev,
        kurdistan: { ...prev.kurdistan, [field]: value }
      };
    });
  }, []);

  // Update bullet point in Kurdistan section - memoized to prevent unnecessary re-renders
  const updateKurdistanPoint = useCallback((section: 'leftPoints' | 'rightPoints', index: number, value: string) => {
    setContent(prev => {
      if (!prev) {
        const newContent = { ...initialContent };
        const newPoints = [...newContent.kurdistan[section]];
        newPoints[index] = value;
        newContent.kurdistan[section] = newPoints;
        return newContent;
      }
      
      const newPoints = [...prev.kurdistan[section]];
      newPoints[index] = value;
      
      return {
        ...prev,
        kurdistan: {
          ...prev.kurdistan,
          [section]: newPoints
        }
      };
    });
  }, []);

  // Update footer content - memoized to prevent unnecessary re-renders
  const updateFooter = useCallback((field: keyof LandingPageContent['footer'], value: string) => {
    setContent(prev => {
      if (!prev) return { ...initialContent, footer: { ...initialContent.footer, [field]: value } };
      return {
        ...prev,
        footer: { ...prev.footer, [field]: value }
      };
    });
  }, []);

  // Save all changes to the database - memoized to prevent unnecessary re-renders
  const saveChanges = useCallback(async () => {
    if (!content) {
      toast({
        title: "Cannot save",
        description: "No content to save. Please try reloading the page.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      console.log('Saving landing page content...');
      // Explicitly cast the content to Json type as expected by Supabase
      const contentAsJson = content as unknown as Json;
      
      const { error } = await supabase
        .from('landing_page_content')
        .upsert({ 
          id: 1, // Using a fixed ID since we only have one record for landing page
          content: contentAsJson,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving landing page content:', error);
        setError(`Failed to save content: ${error.message}`);
        toast({
          title: "Failed to save content",
          description: "Could not save landing page content to the database.",
          variant: "destructive"
        });
      } else {
        console.log('Content saved successfully');
        toast({
          title: "Content saved",
          description: "Landing page content has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`An unexpected error occurred: ${error.message}`);
      toast({
        title: "An error occurred",
        description: "An unexpected error occurred while saving the content.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, [content, toast]);

  return {
    content: safeContent,
    loading,
    error,
    saving,
    updateHero,
    updateFeatureTitle,
    updateFeatureCard,
    updateKurdistanSection,
    updateKurdistanPoint,
    updateFooter,
    saveChanges
  };
};
