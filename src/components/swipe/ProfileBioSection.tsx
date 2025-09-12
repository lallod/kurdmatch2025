import React from 'react';
import { Profile } from '@/types/swipe';
import { MapPin, Briefcase, Heart, BookOpen } from 'lucide-react';
import ExpandableSection from './ExpandableSection';

interface ProfileBioSectionProps {
  profile: Profile;
}

const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({ profile }) => {
  return (
    <div className="bg-gradient-to-b from-purple-600/20 to-purple-700/30 p-6">
      {/* About section */}
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg">About {profile.name}</h3>
        </div>
        
        {profile.bio ? (
          <p className="text-white/90 leading-relaxed text-sm mb-3">{profile.bio}</p>
        ) : (
          <p className="text-white/90 leading-relaxed text-sm mb-3">
            {profile.name} loves exploring new experiences and connecting with like-minded people. 
            Looking for meaningful connections and shared adventures.
          </p>
        )}
        
        {(!profile.interests || profile.interests.length === 0) && (
          <p className="text-white/60 text-sm">No common interests found</p>
        )}
      </div>

      {/* Expandable sections */}
      <div className="space-y-4">
        {/* Basic Info */}
        <ExpandableSection
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>}
          title="Basic Info"
        >
          <div className="space-y-2 text-white/90 text-sm">
            {profile.height && <div>Height: {profile.height}</div>}
            {profile.bodyType && <div>Body Type: {profile.bodyType}</div>}
            {profile.ethnicity && <div>Ethnicity: {profile.ethnicity}</div>}
            {profile.languages && profile.languages.length > 0 && (
              <div>Languages: {profile.languages.join(', ')}</div>
            )}
          </div>
        </ExpandableSection>

        {/* Career & Education */}
        <ExpandableSection
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
          </svg>}
          title="Career & Education"
        >
          <div className="space-y-2 text-white/90 text-sm">
            {profile.occupation && <div>Occupation: {profile.occupation}</div>}
            {profile.company && <div>Company: {profile.company}</div>}
            {profile.education && <div>Education: {profile.education}</div>}
            {profile.careerAmbitions && <div>Career Goals: {profile.careerAmbitions}</div>}
          </div>
        </ExpandableSection>

        {/* Lifestyle */}
        <ExpandableSection
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>}
          title="Lifestyle"
        >
          <div className="space-y-2 text-white/90 text-sm">
            {profile.exerciseHabits && <div>Exercise: {profile.exerciseHabits}</div>}
            {profile.dietaryPreferences && <div>Diet: {profile.dietaryPreferences}</div>}
            {profile.smoking && <div>Smoking: {profile.smoking}</div>}
            {profile.drinking && <div>Drinking: {profile.drinking}</div>}
            {profile.sleepSchedule && <div>Sleep: {profile.sleepSchedule}</div>}
          </div>
        </ExpandableSection>

        {/* Beliefs & Values */}
        <ExpandableSection
          icon={<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>}
          title="Beliefs & Values"
        >
          <div className="space-y-2 text-white/90 text-sm">
            {profile.religion && <div>Religion: {profile.religion}</div>}
            {profile.politicalViews && <div>Politics: {profile.politicalViews}</div>}
            {profile.values && profile.values.length > 0 && (
              <div>Values: {profile.values.join(', ')}</div>
            )}
          </div>
        </ExpandableSection>

        {/* Relationships */}
        <ExpandableSection
          icon={<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>}
          title="Relationships"
        >
          <div className="space-y-2 text-white/90 text-sm">
            {profile.relationshipGoals && <div>Looking for: {profile.relationshipGoals}</div>}
            {profile.wantChildren && <div>Children: {profile.wantChildren}</div>}
            {profile.loveLanguage && <div>Love Language: {profile.loveLanguage}</div>}
            {profile.familyCloseness && <div>Family: {profile.familyCloseness}</div>}
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

export default ProfileBioSection;