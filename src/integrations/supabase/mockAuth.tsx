import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './client';

interface MockProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  profile_image: string;
}

interface MockAuthContextType {
  currentProfile: MockProfile | null;
  loading: boolean;
  selectProfile: (profileId: string) => Promise<void>;
  logout: () => void;
  supabase: typeof supabase;
}

const MockAuthContext = createContext<MockAuthContextType>({
  currentProfile: null,
  loading: true,
  selectProfile: async () => {},
  logout: () => {},
  supabase,
});

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Alias for compatibility
export const useSupabaseAuth = useMockAuth;
export const useAuth = useMockAuth;

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<MockProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfileId = localStorage.getItem('mock_current_profile_id');
    
    if (savedProfileId) {
      loadProfile(savedProfileId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, age, gender, location, profile_image')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      
      setCurrentProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      localStorage.removeItem('mock_current_profile_id');
    } finally {
      setLoading(false);
    }
  };

  const selectProfile = async (profileId: string) => {
    setLoading(true);
    localStorage.setItem('mock_current_profile_id', profileId);
    await loadProfile(profileId);
  };

  const logout = () => {
    localStorage.removeItem('mock_current_profile_id');
    setCurrentProfile(null);
  };

  // Mock user object for compatibility
  const mockUser = currentProfile ? {
    id: currentProfile.id,
    email: `${currentProfile.name.toLowerCase().replace(/\s+/g, '.')}@mockuser.com`,
    user_metadata: {
      name: currentProfile.name,
      avatar_url: currentProfile.profile_image,
    },
  } : null;

  const value: MockAuthContextType & { user: any; session: any; signIn: any; signUp: any; signOut: any; signInWithProvider: any } = {
    currentProfile,
    loading,
    selectProfile,
    logout,
    supabase,
    // Compatibility props
    user: mockUser,
    session: currentProfile ? { user: mockUser } : null,
    signIn: async () => ({ error: new Error('Use profile selector') }),
    signUp: async () => ({ error: new Error('Use profile selector') }),
    signOut: logout,
    signInWithProvider: async () => ({ error: new Error('Use profile selector') }),
  };

  return (
    <MockAuthContext.Provider value={value as any}>
      {children}
    </MockAuthContext.Provider>
  );
};
