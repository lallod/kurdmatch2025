
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { User, Wine, Heart, Star, BookOpen, Languages, BrainCircuit, Palette, Plane } from 'lucide-react';

import ProfileBio from './ProfileBio';
import ProfileQuickStats from './ProfileQuickStats';
import ProfileBasics from './ProfileBasics';
import ProfileLifestyle from './ProfileLifestyle';
import ProfileRelationships from './ProfileRelationships';
import ProfileInterests from './ProfileInterests';
import ProfileFavorites from './ProfileFavorites';
import ProfileCommunication from './ProfileCommunication';
import ProfilePersonality from './ProfilePersonality';
import ProfileCreative from './ProfileCreative';
import ProfileTravel from './ProfileTravel';
import AccordionSection from './AccordionSection';

interface DesktopProfileDetailsProps {
  details: any;
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
}

const DesktopProfileDetails: React.FC<DesktopProfileDetailsProps> = ({ 
  details, 
  tinderBadgeStyle,
  formatList 
}) => {
  return (
    <section className="w-full px-4 pb-20 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-8">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <div className="space-y-8">
        <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
          <ProfileBio about={details.about} isMobile={false} />
          
          <Separator className="my-6" />
          
          <ProfileQuickStats 
            education={details.education}
            occupation={details.occupation}
            company={details.company}
            relationshipGoals={details.relationshipGoals}
            zodiacSign={details.zodiacSign}
            personalityType={details.personalityType}
            tinderBadgeStyle={tinderBadgeStyle}
            isMobile={false}
          />
        </Card>
        
        <Accordion type="multiple" defaultValue={["basics", "lifestyle", "relationships", "interests", "favorites", "more", "personality", "creative", "travel"]} className="space-y-6">
          <AccordionSection
            value="basics"
            title="Basics"
            icon={<User />}
            color="text-tinder-rose"
            gradientClass="bg-gradient-to-r from-tinder-rose/5 to-transparent"
            borderClass="border-tinder-rose/10"
          >
            <ProfileBasics 
              details={details} 
              tinderBadgeStyle={tinderBadgeStyle} 
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="lifestyle"
            title="Lifestyle"
            icon={<Wine />}
            color="text-tinder-orange"
            gradientClass="bg-gradient-to-r from-tinder-orange/5 to-transparent"
            borderClass="border-tinder-orange/10"
          >
            <ProfileLifestyle 
              details={details}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="relationships"
            title="Relationships"
            icon={<Heart />}
            color="text-tinder-peach"
            gradientClass="bg-gradient-to-r from-tinder-peach/5 to-transparent"
            borderClass="border-tinder-peach/10"
          >
            <ProfileRelationships 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="interests"
            title="Interests & Hobbies"
            icon={<Star />}
            color="text-tinder-orange"
            gradientClass="bg-gradient-to-r from-tinder-orange/5 to-transparent"
            borderClass="border-tinder-orange/10"
          >
            <ProfileInterests 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="favorites"
            title="Favorites"
            icon={<BookOpen />}
            color="text-tinder-peach"
            gradientClass="bg-gradient-to-r from-tinder-peach/5 to-transparent"
            borderClass="border-tinder-peach/10"
          >
            <ProfileFavorites 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="more"
            title="Communication"
            icon={<Languages />}
            color="text-tinder-rose"
            gradientClass="bg-gradient-to-r from-tinder-rose/5 to-transparent"
            borderClass="border-tinder-rose/10"
          >
            <ProfileCommunication 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="personality"
            title="Personality & Growth"
            icon={<BrainCircuit />}
            color="text-purple-500"
            gradientClass="bg-gradient-to-r from-purple-100 to-transparent"
            borderClass="border-purple-200"
          >
            <ProfilePersonality 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="creative"
            title="Creative & Lifestyle"
            icon={<Palette />}
            color="text-pink-500"
            gradientClass="bg-gradient-to-r from-pink-100 to-transparent"
            borderClass="border-pink-200"
          >
            <ProfileCreative 
              details={details}
              tinderBadgeStyle={tinderBadgeStyle}
              formatList={formatList}
              isMobile={false}
            />
          </AccordionSection>
          
          <AccordionSection
            value="travel"
            title="Travel"
            icon={<Plane />}
            color="text-teal-600"
            gradientClass="bg-gradient-to-r from-teal-100 to-transparent"
            borderClass="border-teal-200"
          >
            <ProfileTravel 
              details={details}
              isMobile={false}
            />
          </AccordionSection>
        </Accordion>
      </div>
    </section>
  );
};

export default DesktopProfileDetails;
