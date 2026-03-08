
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
interface KurdistanContent {
  title: string;
  subtitle: string;
  leftTitle: string;
  leftDescription: string;
  leftPoints: string[];
  rightTitle: string;
  rightDescription: string;
  rightPoints: string[];
}

interface KurdistanSectionProps {
  content?: KurdistanContent;
}

// Default content
const defaultContent: KurdistanContent = {
  title: "Celebrating Kurdish Heritage",
  subtitle: "Whether you're from Bakur, Bashur, Rojava, Rojhelat, or part of the diaspora, our platform helps you find someone who understands your unique background.",
  leftTitle: "For Kurds Everywhere",
  leftDescription: "Our community welcomes Kurdish people from all walks of life and all parts of the world. Whether you were born in Kurdistan or abroad, our platform helps you connect with others who share your heritage.",
  leftPoints: [
    "Connect with Kurds from different regions",
    "Share your unique cultural experiences",
    "Find partners who understand your background"
  ],
  rightTitle: "Preserving Our Culture",
  rightDescription: "We believe that fostering relationships within our community helps preserve and celebrate our rich Kurdish culture, language, and traditions for generations to come.",
  rightPoints: [
    "Filter by dialect and regional background",
    "Share your favorite Kurdish traditions",
    "Build relationships based on shared values"
  ]
};

const KurdistanSection: React.FC<KurdistanSectionProps> = ({ content }) => {
  const { t } = useTranslations();
  const resolvedContent = content || {
    title: t('landing.kurdistan_title', 'Celebrating Kurdish Heritage'),
    subtitle: t('landing.kurdistan_subtitle', "Whether you're from Bakur, Bashur, Rojava, Rojhelat, or part of the diaspora, our platform helps you find someone who understands your unique background."),
    leftTitle: t('landing.kurds_everywhere', 'For Kurds Everywhere'),
    leftDescription: t('landing.kurds_everywhere_desc', 'Our community welcomes Kurdish people from all walks of life and all parts of the world. Whether you were born in Kurdistan or abroad, our platform helps you connect with others who share your heritage.'),
    leftPoints: [
      t('landing.connect_regions', 'Connect with Kurds from different regions'),
      t('landing.share_experiences', 'Share your unique cultural experiences'),
      t('landing.find_partners', 'Find partners who understand your background')
    ],
    rightTitle: t('landing.preserving_culture', 'Preserving Our Culture'),
    rightDescription: t('landing.preserving_culture_desc', 'We believe that fostering relationships within our community helps preserve and celebrate our rich Kurdish culture, language, and traditions for generations to come.'),
    rightPoints: [
      t('landing.filter_dialect', 'Filter by dialect and regional background'),
      t('landing.share_traditions', 'Share your favorite Kurdish traditions'),
      t('landing.build_relationships', 'Build relationships based on shared values')
    ]
  };
  return (
    <div className="py-16 relative z-10 bg-gradient-to-b from-indigo-950/80 to-purple-950/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">{resolvedContent.title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {resolvedContent.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">{resolvedContent.leftTitle}</h3>
            <p className="text-gray-300 mb-6">
              {resolvedContent.leftDescription}
            </p>
            <ul className="space-y-2 text-gray-300">
              {resolvedContent.leftPoints.map((point, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">{resolvedContent.rightTitle}</h3>
            <p className="text-gray-300 mb-6">
              {resolvedContent.rightDescription}
            </p>
            <ul className="space-y-2 text-gray-300">
              {resolvedContent.rightPoints.map((point, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KurdistanSection;
