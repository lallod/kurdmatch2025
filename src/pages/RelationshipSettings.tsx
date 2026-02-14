import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MarriageIntentions from '@/components/settings/MarriageIntentions';
import ChaperoneMode from '@/components/settings/ChaperoneMode';

const RelationshipSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Relationship Settings</h1>
        </div>

        <MarriageIntentions />
        <ChaperoneMode />
      </div>
    </div>
  );
};

export default RelationshipSettings;
