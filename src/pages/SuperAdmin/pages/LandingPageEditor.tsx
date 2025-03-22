
import React, { useState } from 'react';
import { useLandingPageContent } from './LandingPageEditor/hooks/useLandingPageContent';
import EditorHeader from './LandingPageEditor/components/EditorHeader';
import EditorTabs from './LandingPageEditor/components/EditorTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPageEditor = () => {
  const [retryCount, setRetryCount] = useState(0);
  
  const {
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
  } = useLandingPageContent(retryCount);

  // Show loading state while fetching content
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Loading landing page content...</p>
        </CardContent>
      </Card>
    );
  }

  // Show error state if there was a problem loading the content
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Error loading landing page content</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
          <div className="mt-4">
            <Button onClick={() => setRetryCount(prev => prev + 1)}>
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <EditorHeader saving={saving} onSave={saveChanges} />
      
      <EditorTabs
        content={content}
        updateHero={updateHero}
        updateFeatureTitle={updateFeatureTitle}
        updateFeatureCard={updateFeatureCard}
        updateKurdistanSection={updateKurdistanSection}
        updateKurdistanPoint={updateKurdistanPoint}
        updateFooter={updateFooter}
      />
    </div>
  );
};

export default LandingPageEditor;
