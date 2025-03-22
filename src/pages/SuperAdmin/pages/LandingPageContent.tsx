
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Json } from '@/integrations/supabase/types';

type LandingPageData = {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
  features: {
    title: string;
    description: string;
  }[];
};

const DEFAULT_CONTENT: LandingPageData = {
  title: "Find Your Perfect Match",
  subtitle: "AI-Powered Dating",
  description: "Our intelligent matching algorithm helps you find meaningful connections based on compatibility, interests, and relationship goals.",
  callToAction: "Get Started",
  features: [
    {
      title: "Smart Matching",
      description: "Our AI analyzes your preferences to find the most compatible matches"
    },
    {
      title: "Verified Profiles",
      description: "All profiles are verified for your safety and security"
    },
    {
      title: "Meaningful Connections",
      description: "Focus on quality conversations and lasting relationships"
    }
  ]
};

// Helper function to safely parse content from the database
const parseContent = (data: { content: Json } | null): LandingPageData => {
  if (!data || !data.content) {
    return DEFAULT_CONTENT;
  }
  
  // If content is already an object with the right properties, return it
  const content = data.content as any;
  
  // Validate that the content has the required properties
  if (
    typeof content === 'object' && 
    content !== null &&
    typeof content.title === 'string' &&
    typeof content.subtitle === 'string' &&
    typeof content.description === 'string' &&
    typeof content.callToAction === 'string' &&
    Array.isArray(content.features)
  ) {
    return content as LandingPageData;
  }
  
  // Return default content if validation fails
  return DEFAULT_CONTENT;
};

const LandingPageContent = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = React.useState<LandingPageData | null>(null);
  const [jsonError, setJsonError] = React.useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['landingPageContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: LandingPageData) => {
      const { data: existingData } = await supabase
        .from('landing_page_content')
        .select('id')
        .eq('id', 1)
        .maybeSingle();

      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('landing_page_content')
          .update({ content: newContent })
          .eq('id', 1);
      } else {
        // Insert new record
        result = await supabase
          .from('landing_page_content')
          .insert({ id: 1, content: newContent });
      }

      if (result.error) throw result.error;
      return newContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPageContent'] });
      toast({
        title: "Success",
        description: "Landing page content has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update content: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Initialize content state when data loads
  React.useEffect(() => {
    if (data) {
      setContent(parseContent(data));
    }
  }, [data]);

  // Handle JSON text changes
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedContent = JSON.parse(e.target.value);
      setContent(parsedContent);
      setJsonError(null);
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  // Handle content updates for specific fields
  const updateField = (path: string, value: string) => {
    if (!content) return;
    
    const newContent = { ...content };
    const keys = path.split('.');
    
    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key.includes('[')) {
        const [arrayName, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        current = current[arrayName][index];
      } else {
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    setContent(newContent);
  };

  const handleSave = () => {
    if (content) {
      updateMutation.mutate(content);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-tinder-rose" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Content</CardTitle>
          <CardDescription>
            There was an error loading the landing page content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{(error as Error).message}</div>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['landingPageContent'] })}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Landing Page Content</h1>
        <Button 
          onClick={handleSave} 
          disabled={updateMutation.isPending || !content}
          className="bg-tinder-rose hover:bg-tinder-rose/90 text-white"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {content && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
              <CardDescription>Edit the main landing page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={content.title} 
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input 
                  value={content.subtitle} 
                  onChange={(e) => updateField('subtitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={content.description} 
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Call to Action Button Text</label>
                <Input 
                  value={content.callToAction} 
                  onChange={(e) => updateField('callToAction', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Edit the feature sections of the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feature {index + 1} Title</label>
                    <Input 
                      value={feature.title} 
                      onChange={(e) => updateField(`features[${index}].title`, e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feature {index + 1} Description</label>
                    <Textarea 
                      value={feature.description} 
                      onChange={(e) => updateField(`features[${index}].description`, e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw JSON</CardTitle>
              <CardDescription>Edit the content directly in JSON format</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={JSON.stringify(content, null, 2)} 
                onChange={handleJsonChange}
                rows={10}
                className="font-mono text-sm"
              />
              {jsonError && <p className="text-red-500 mt-2">{jsonError}</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LandingPageContent;
