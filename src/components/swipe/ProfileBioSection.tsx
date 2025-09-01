import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Profile } from '@/types/swipe';
import { useBioGeneration } from '@/hooks/useBioGeneration';

interface ProfileBioSectionProps {
  profile: Profile;
}

const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({ profile }) => {
  const { generatedBio, isGenerating } = useBioGeneration(profile);

  // Mock current user interests for matching (in real app, this would come from auth context)
  const currentUserInterests = ["Language", "Culture", "Travel", "Reading", "Technology", "Sports"];

  // Find matching interests between current user and viewed profile
  const matchingInterests = profile.interests?.filter(interest => 
    currentUserInterests.includes(interest)
  ) || [];

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      {/* Auto-Generated Bio Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-gray-900 font-semibold text-base">About {profile.name}</h3>
        </div>
        
        {isGenerating ? (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <div className="animate-pulse">Generating bio...</div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-800 text-sm leading-relaxed">
              {generatedBio}
            </p>
            
            {/* Matching Interest Tags - Only show interests that both users have */}
            {matchingInterests.length > 0 && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200 px-2 py-1">
                  🤝 {matchingInterests.length} common interests
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {matchingInterests.slice(0, 3).map((interest, index) => (
                    <Badge 
                      key={index} 
                      className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-2 py-1"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {matchingInterests.length > 3 && (
                    <Badge className="text-xs bg-gray-100 text-gray-600 border-gray-200 px-2 py-1">
                      +{matchingInterests.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {matchingInterests.length === 0 && profile.interests && (
              <div className="text-xs text-gray-500">
                No common interests found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBioSection;