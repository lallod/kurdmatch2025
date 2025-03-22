
// Types for AI-enhanced features across the Super Admin dashboard

export interface AIEnhancement {
  id: string;
  name: string;
  description: string;
  confidence: number; // 0-100 confidence score
  suggestedAction?: string;
  timestamp: string;
}

export interface AIFeatureSuggestion {
  featureId: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementationComplexity: 'high' | 'medium' | 'low';
  suggestedRollout: string;
}

export interface AIRiskAssessment {
  userId: string;
  riskScore: number; // 0-100 risk score
  factors: {
    name: string;
    impact: number; // -10 to 10, negative is good, positive is bad
    description: string;
  }[];
  suggestedActions: string[];
  lastUpdated: string;
}

export interface AIAnomaly {
  id: string;
  type: 'login' | 'payment' | 'content' | 'messaging' | 'profile' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  userId: string;
  description: string;
  detectedAt: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  suggestedActions: string[];
}

export interface AIInsight {
  id: string;
  category: 'user' | 'content' | 'payment' | 'performance' | 'security' | 'growth';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  createdAt: string;
  expiresAt?: string;
  actionable: boolean;
  suggestedActions?: string[];
}

// Mock data generator functions for AI features
export const generateMockAIRiskAssessment = (userId: string): AIRiskAssessment => {
  const riskScore = Math.floor(Math.random() * 100);
  
  return {
    userId,
    riskScore,
    factors: [
      {
        name: 'Login Patterns',
        impact: Math.floor(Math.random() * 21) - 10,
        description: 'User login times and frequencies are consistent with historical patterns'
      },
      {
        name: 'IP Locations',
        impact: Math.floor(Math.random() * 21) - 10,
        description: 'User has logged in from 3 different countries in the past week'
      },
      {
        name: 'Profile Completeness',
        impact: Math.floor(Math.random() * 21) - 10,
        description: 'User has a fully completed profile with verified information'
      }
    ],
    suggestedActions: [
      'Enable additional verification for international logins',
      'Review recent account changes',
      'Monitor messaging patterns for next 7 days'
    ],
    lastUpdated: new Date().toISOString()
  };
};

export const generateMockAIInsights = (count: number = 3): AIInsight[] => {
  const categories = ['user', 'content', 'payment', 'performance', 'security', 'growth'] as const;
  const impacts = ['high', 'medium', 'low'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `insight-${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    title: `AI Insight #${i + 1}`,
    description: 'Our AI system has detected a pattern worth your attention that could improve platform performance.',
    impact: impacts[Math.floor(Math.random() * impacts.length)],
    createdAt: new Date().toISOString(),
    actionable: Math.random() > 0.3,
    suggestedActions: Math.random() > 0.3 ? [
      'Review the affected area',
      'Consider implementing suggested changes',
      'Monitor metrics after changes'
    ] : undefined
  }));
};

export const generateMockAIAnomalies = (count: number = 2): AIAnomaly[] => {
  const types = ['login', 'payment', 'content', 'messaging', 'profile', 'other'] as const;
  const severities = ['critical', 'high', 'medium', 'low'] as const;
  const statuses = ['new', 'investigating', 'resolved', 'false_positive'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `anomaly-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    userId: `user-${Math.floor(Math.random() * 1000)}`,
    description: 'Unusual pattern detected that deviates from normal user behavior.',
    detectedAt: new Date().toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    suggestedActions: [
      'Review recent account activity',
      'Contact user for verification',
      'Temporarily limit account capabilities'
    ]
  }));
};

