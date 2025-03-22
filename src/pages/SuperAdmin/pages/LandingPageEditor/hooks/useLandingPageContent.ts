
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { LandingPageContent, initialContent } from '../types';

export const useLandingPageContent = (retryCount = 0) => {
  const { toast } = useToast();
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load content from the database on hook initialization
  useEffect(() => {
    const fetchLandingPageContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching landing page content:', error);
          setError(`Failed to load content: ${error.message}`);
          toast({
            title: "Failed to load content",
            description: "Could not load landing page content from the database.",
            variant: "destructive"
          });
        } else if (data) {
          // Type safety: convert data.content to LandingPageContent with proper type checking
          const contentData = data.content as Json;
          
          // Only set the state if it has the expected structure
          if (
            typeof contentData === 'object' && 
            contentData !== null && 
            !Array.isArray(contentData) &&
            'hero' in contentData && 
            'features' in contentData && 
            'kurdistan' in contentData && 
            'footer' in contentData
          ) {
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
          const { error: insertError } = await supabase
            .from('landing_page_content')
            .insert({ 
              id: 1,
              content: initialContent as unknown as Json,
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error initializing landing page content:', insertError);
            setError(`Failed to initialize content: ${insertError.message}`);
          } else {
            setContent(initialContent);
          }
        }
      } catch (error: any) {
        console.error('Error:', error);
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

    fetchLandingPageContent();
  }, [toast, retryCount]);

  // Update hero section content
  const updateHero = (field: keyof LandingPageContent['hero'], value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  // Update feature section content
  const updateFeatureTitle = (value: string) => {
    setContent(prev => ({
      ...prev,
      features: { ...prev.features, title: value }
    }));
  };

  // Update feature card
  const updateFeatureCard = (id: string, field: keyof Omit<LandingPageContent['features']['cards'][0], 'id'>, value: string) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        cards: prev.features.cards.map(card => 
          card.id === id ? { ...card, [field]: value } : card
        )
      }
    }));
  };

  // Update Kurdistan section
  const updateKurdistanSection = (field: keyof LandingPageContent['kurdistan'], value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      kurdistan: { ...prev.kurdistan, [field]: value }
    }));
  };

  // Update bullet point in Kurdistan section
  const updateKurdistanPoint = (section: 'leftPoints' | 'rightPoints', index: number, value: string) => {
    setContent(prev => {
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
  };

  // Update footer content
  const updateFooter = (field: keyof LandingPageContent['footer'], value: string) => {
    setContent(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: value }
    }));
  };

  // Save all changes to the database
  const saveChanges = async () => {
    setSaving(true);
    setError(null);
    
    try {
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
  };

  return {
    content,
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
