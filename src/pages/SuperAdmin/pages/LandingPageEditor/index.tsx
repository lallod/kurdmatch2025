
import React from 'react';
import { useLandingPageContent } from './hooks/useLandingPageContent';
import EditorHeader from './components/EditorHeader';
import EditorTabs from './components/EditorTabs';

// This file now exists solely for backward compatibility
// The actual implementation is in ../LandingPageEditor.tsx
const LandingPageEditorContent = () => {
  const {
    content,
    saving,
    updateHero,
    updateFeatureTitle,
    updateFeatureCard,
    updateKurdistanSection,
    updateKurdistanPoint,
    updateFooter,
    saveChanges
  } = useLandingPageContent();

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

export default LandingPageEditorContent;
