import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { User, Wine, Star, Languages, BrainCircuit, Palette, Plane } from 'lucide-react';

import ProfileBio from './ProfileBio';
import ProfileQuickStats from './ProfileQuickStats';
import ProfileBasics from './ProfileBasics';
import ProfileLifestyle from './ProfileLifestyle';
import ProfileInterests from './ProfileInterests';
import ProfileCommunication from './ProfileCommunication';
import ProfilePersonality from './ProfilePersonality';
import ProfileCreative from './ProfileCreative';
import ProfileTravel from './ProfileTravel';
import AccordionSection from './AccordionSection';
import { useTranslations } from '@/hooks/useTranslations';

interface MobileProfileDetailsProps {
  details: any;
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
}

const MobileProfileDetails: React.FC<MobileProfileDetailsProps> = ({ 
  details, 
  tinderBadgeStyle,
  formatList 
}) => {
  const { t } = useTranslations();
  return (
    <section className="w-full animate-fade-up px-4 pb-20">
      <ProfileBio about={details.about} isMobile={true} />
      
      <ProfileQuickStats 
        education={details.education}
        occupation={details.occupation}
        company={details.company}
        relationshipGoals={details.relationshipGoals}
        zodiacSign={details.zodiacSign}
        personalityType={details.personalityType}
        tinderBadgeStyle={tinderBadgeStyle}
        isMobile={true}
      />
      
      <Accordion type="multiple" defaultValue={["basics", "lifestyle", "interests", "more", "personality", "creatives", "travel"]} className="w-full space-y-4">
        <AccordionSection
          value="basics"
          title={t('profile.basics', 'Basics')}
          icon={<User />}
          color="text-tinder-rose"
          gradientClass="bg-gradient-to-r from-tinder-rose/5 to-transparent"
          borderClass="border-tinder-rose/10"
        >
          <ProfileBasics 
            details={details} 
            tinderBadgeStyle={tinderBadgeStyle} 
            formatList={formatList}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="lifestyle"
          title={t('profile.lifestyle', 'Lifestyle')}
          icon={<Wine />}
          color="text-tinder-orange"
          gradientClass="bg-gradient-to-r from-tinder-orange/5 to-transparent"
          borderClass="border-tinder-orange/10"
        >
          <ProfileLifestyle 
            details={details}
            formatList={formatList}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="interests"
          title={t('profile.interests_hobbies', 'Interests & Hobbies')}
          icon={<Star />}
          color="text-tinder-orange"
          gradientClass="bg-gradient-to-r from-tinder-orange/5 to-transparent"
          borderClass="border-tinder-orange/10"
        >
          <ProfileInterests 
            details={details}
            tinderBadgeStyle={tinderBadgeStyle}
            formatList={formatList}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="more"
          title={t('profile.communication', 'Communication')}
          icon={<Languages />}
          color="text-tinder-rose"
          gradientClass="bg-gradient-to-r from-tinder-rose/5 to-transparent"
          borderClass="border-tinder-rose/10"
        >
          <ProfileCommunication 
            details={details}
            tinderBadgeStyle={tinderBadgeStyle}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="personality"
          title={t('profile.personality_growth', 'Personality & Growth')}
          icon={<BrainCircuit />}
          color="text-purple-500"
          gradientClass="bg-gradient-to-r from-purple-100 to-transparent"
          borderClass="border-purple-200"
        >
          <ProfilePersonality 
            details={details}
            tinderBadgeStyle={tinderBadgeStyle}
            formatList={formatList}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="creatives"
          title={t('profile.creative_lifestyle', 'Creative & Lifestyle')}
          icon={<Palette />}
          color="text-pink-500"
          gradientClass="bg-gradient-to-r from-pink-100 to-transparent"
          borderClass="border-pink-200"
        >
          <ProfileCreative 
            details={details}
            tinderBadgeStyle={tinderBadgeStyle}
            formatList={formatList}
            isMobile={true}
          />
        </AccordionSection>
        
        <AccordionSection
          value="travel"
          title={t('profile.travel', 'Travel')}
          icon={<Plane />}
          color="text-teal-600"
          gradientClass="bg-gradient-to-r from-teal-100 to-transparent"
          borderClass="border-teal-200"
        >
          <ProfileTravel 
            details={details}
            isMobile={true}
          />
        </AccordionSection>
      </Accordion>
    </section>
  );
};

export default MobileProfileDetails;
