
import React from 'react';

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

const KurdistanSection: React.FC<KurdistanSectionProps> = ({ content = defaultContent }) => {
  return (
    <div className="py-16 relative z-10 bg-gradient-to-b from-indigo-950/80 to-purple-950/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">{content.title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">{content.leftTitle}</h3>
            <p className="text-gray-300 mb-6">
              {content.leftDescription}
            </p>
            <ul className="space-y-2 text-gray-300">
              {content.leftPoints.map((point, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">{content.rightTitle}</h3>
            <p className="text-gray-300 mb-6">
              {content.rightDescription}
            </p>
            <ul className="space-y-2 text-gray-300">
              {content.rightPoints.map((point, index) => (
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
