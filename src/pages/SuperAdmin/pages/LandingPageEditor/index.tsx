
import React from 'react';
import { useLandingPageContent } from './hooks/useLandingPageContent';
import EditorHeader from './components/EditorHeader';
import EditorTabs from './components/EditorTabs';

const LandingPageEditor = () => {
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

export default LandingPageEditor;
