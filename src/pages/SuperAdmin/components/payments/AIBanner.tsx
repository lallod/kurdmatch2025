
import React, { useState } from 'react';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  User, 
  Users, 
  Database, 
  UserCheck, 
  FlaskConical, 
  Globe, 
  ShieldBan, 
  Link2, 
  Clock, 
  FolderPlus, 
  Mail, 
  Languages, 
  Settings, 
  Award, 
  SunMoon, 
  Edit, 
  Smartphone, 
  Activity, 
  MapPin, 
  UserX, 
  Network, 
  Key, 
  Route, 
  FileText, 
  Lock, 
  ClipboardCheck, 
  Percent, 
  AlertTriangle,
  LogIn,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AIBannerProps {
  type?: 'user' | 'payment' | 'all';
  collapsible?: boolean;
  className?: string;
}

export const AIBanner = ({ 
  type = 'payment', 
  collapsible = false,
  className
}: AIBannerProps) => {
  const { t } = useTranslations();
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const aiFeatures: Record<string, AIFeature[]> = {
    user: [
      {
        id: 'roles',
        title: 'Smart Role Suggestions',
        description: 'AI analyzes user behavior to recommend appropriate permission levels and role configurations.',
        icon: <Shield size={18} className="text-blue-500" />
      },
      {
        id: 'verification',
        title: 'Intelligent Identity Verification',
        description: 'AI-powered document verification with facial recognition and risk scoring of verification attempts.',
        icon: <UserCheck size={18} className="text-green-500" />
      },
      {
        id: 'engagement',
        title: 'Predictive Engagement Analysis',
        description: 'AI identifies which factors correlate with long-term engagement and predicts future user activity.',
        icon: <Activity size={18} className="text-amber-500" />
      },
      {
        id: 'dormant',
        title: 'Proactive Dormancy Prevention',
        description: 'AI predicts which users are at risk of becoming dormant and suggests personalized re-engagement strategies.',
        icon: <UserX size={18} className="text-red-500" />
      },
      {
        id: 'security',
        title: 'Advanced Security Intelligence',
        description: 'AI identifies suspicious login patterns and suggests adaptive security measures based on real-time risk assessment.',
        icon: <Lock size={18} className="text-purple-500" />
      }
    ],
    payment: [
      {
        id: 'fraud',
        title: 'AI-Powered Fraud Detection',
        description: 'Our AI system monitors payment patterns and identifies potential fraudulent transactions.',
        icon: <Brain size={18} className="text-tinder-rose" />
      },
      {
        id: 'revenue',
        title: 'Revenue Prediction',
        description: 'AI forecasts future revenue based on historical payment data and subscription patterns.',
        icon: <Sparkles size={18} className="text-amber-500" />
      }
    ],
    all: [
      {
        id: 'roles',
        title: 'Smart Role Management',
        description: 'AI analyzes user behavior to recommend appropriate permission levels and role configurations.',
        icon: <Shield size={18} className="text-blue-500" />
      },
      {
        id: 'database',
        title: 'Intelligent Backup Scheduling',
        description: 'AI suggests optimal backup schedules based on database usage patterns and critical operations.',
        icon: <Database size={18} className="text-indigo-500" />
      },
      {
        id: 'verification',
        title: 'Advanced Identity Verification',
        description: 'AI-powered document verification with facial recognition and fraud detection capabilities.',
        icon: <UserCheck size={18} className="text-green-500" />
      },
      {
        id: 'testing',
        title: 'Predictive A/B Testing',
        description: 'AI predicts test outcomes based on early data and suggests optimal test parameters.',
        icon: <FlaskConical size={18} className="text-purple-500" />
      },
      {
        id: 'regional',
        title: 'Smart Regional Settings',
        description: 'AI suggests default settings based on user demographics and regional preferences.',
        icon: <Globe size={18} className="text-cyan-500" />
      },
      {
        id: 'ip',
        title: 'Proactive Security Blocking',
        description: 'AI detects suspicious IP patterns and recommends blocking actions before breaches occur.',
        icon: <ShieldBan size={18} className="text-red-500" />
      },
      {
        id: 'integration',
        title: 'Integration Health Monitoring',
        description: 'AI continuously monitors integration performance and suggests optimization opportunities.',
        icon: <Link2 size={18} className="text-blue-500" />
      },
      {
        id: 'session',
        title: 'Session Anomaly Detection',
        description: 'AI flags suspicious session activities and detects potential session hijacking attempts.',
        icon: <Clock size={18} className="text-amber-500" />
      },
      {
        id: 'import',
        title: 'Smart Content Classification',
        description: 'AI automatically categorizes and tags imported content for better organization.',
        icon: <FolderPlus size={18} className="text-green-500" />
      },
      {
        id: 'email',
        title: 'Intelligent Email Optimization',
        description: 'AI generates personalized email content and recommends optimal sending times for different email types.',
        icon: <Mail size={18} className="text-indigo-500" />
      },
      {
        id: 'translation',
        title: 'Context-Aware Translation',
        description: 'AI provides context-aware translations that go beyond simple word replacement for natural language flow.',
        icon: <Languages size={18} className="text-blue-500" />
      },
      {
        id: 'security',
        title: 'Adaptive Security Policies',
        description: 'AI recommends security policies based on real-time risk assessment and user behavior patterns.',
        icon: <Settings size={18} className="text-purple-500" />
      },
      {
        id: 'rewards',
        title: 'Optimized Reward Structures',
        description: 'AI fine-tunes reward systems for maximum user engagement and retention impact.',
        icon: <Award size={18} className="text-amber-500" />
      },
      {
        id: 'theme',
        title: 'Personalized UI Preferences',
        description: 'AI learns individual admin preferences and adjusts interface settings accordingly.',
        icon: <SunMoon size={18} className="text-cyan-500" />
      },
      {
        id: 'batch',
        title: 'Intelligent Batch Suggestions',
        description: 'AI suggests common profile edits based on user segments and platform objectives.',
        icon: <Edit size={18} className="text-blue-500" />
      },
      {
        id: 'device',
        title: 'Device Risk Assessment',
        description: 'AI identifies suspicious new devices and recommends appropriate security measures.',
        icon: <Smartphone size={18} className="text-red-500" />
      },
      {
        id: 'engagement',
        title: 'Predictive Engagement Metrics',
        description: 'AI identifies which factors most strongly correlate with long-term engagement and retention.',
        icon: <Activity size={18} className="text-green-500" />
      },
      {
        id: 'map',
        title: 'Behavioral Location Analysis',
        description: 'AI identifies unusual login locations and detects potential account sharing or unauthorized access.',
        icon: <MapPin size={18} className="text-indigo-500" />
      },
      {
        id: 'dormant',
        title: 'Predictive Churn Prevention',
        description: 'AI predicts which users are at risk of becoming dormant and suggests re-engagement strategies.',
        icon: <UserX size={18} className="text-amber-500" />
      },
      {
        id: 'social',
        title: 'Network Pattern Analysis',
        description: 'AI identifies community leaders and detects unusual connection patterns that might indicate fake accounts.',
        icon: <Network size={18} className="text-purple-500" />
      },
      {
        id: 'recovery',
        title: 'Risk-Based Recovery Options',
        description: 'AI suggests appropriate account recovery methods based on individual user risk profiles.',
        icon: <Key size={18} className="text-blue-500" />
      },
      {
        id: 'journey',
        title: 'Optimized User Journeys',
        description: 'AI identifies friction points in user flows and suggests optimizations to improve conversion rates.',
        icon: <Route size={18} className="text-green-500" />
      },
      {
        id: 'documents',
        title: 'Document Authentication',
        description: 'AI automatically authenticates documents, extracts relevant information, and detects potential forgeries.',
        icon: <FileText size={18} className="text-indigo-500" />
      },
      {
        id: 'authentication',
        title: 'Predictive Security Alerts',
        description: 'AI identifies suspicious login patterns and predicts potential account compromise before it happens.',
        icon: <Lock size={18} className="text-red-500" />
      },
      {
        id: 'rights',
        title: 'Automated Data Classification',
        description: 'AI assists in classifying user data for efficient handling of privacy and data access requests.',
        icon: <ClipboardCheck size={18} className="text-blue-500" />
      },
      {
        id: 'completeness',
        title: 'Strategic Profile Completion',
        description: 'AI prioritizes the most impactful profile fields based on platform objectives and user engagement.',
        icon: <Percent size={18} className="text-amber-500" />
      },
      {
        id: 'trust',
        title: 'Proactive Risk Management',
        description: 'AI scores user accounts for potential risks and automatically detects policy violations before they escalate.',
        icon: <AlertTriangle size={18} className="text-purple-500" />
      },
      {
        id: 'login',
        title: 'Adaptive Authentication',
        description: 'AI recommends optimal authentication methods based on security needs and user experience considerations.',
        icon: <LogIn size={18} className="text-green-500" />
      }
    ]
  };

  const features = aiFeatures[type] || aiFeatures.all;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  return (
    <div className={cn(
      "rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10", 
      className
    )}>
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={collapsible ? toggleExpand : undefined}>
        <div className="flex items-center">
          <Brain size={24} className="text-tinder-rose mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">{t('admin.ai_powered_admin', 'AI-Powered Administration')}</h3>
            <p className="text-sm text-gray-600">{t('admin.ai_admin_desc', 'Our AI systems enhance administration capabilities across the platform')}</p>
          </div>
        </div>
        {collapsible && (
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        )}
      </div>

      {isExpanded && features.length > 0 && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={cn(
                  "p-3 rounded-md border cursor-pointer transition-all",
                  selectedFeature === feature.id
                    ? "border-tinder-rose/30 bg-tinder-rose/5"
                    : "border-gray-100 hover:border-tinder-rose/20 hover:bg-tinder-rose/5"
                )}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-2">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    {selectedFeature === feature.id && (
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

