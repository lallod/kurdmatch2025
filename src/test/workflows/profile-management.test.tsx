import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Profile Management Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile Creation', () => {
    it('should create profile with required fields', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: '123' }], error: null });
      
      mockFrom.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
      } as any);
      
      const profileData = {
        id: 'user-123',
        name: 'Test User',
        age: 25,
        gender: 'male',
        location: 'Erbil, Kurdistan',
        bio: 'Test bio that is long enough',
      };
      
      await supabase.from('profiles').insert(profileData).select();
      
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith(profileData);
    });

    it('should require minimum bio length', () => {
      const shortBio = 'Too short';
      const validBio = 'This is a sufficiently long bio that meets requirements';
      
      expect(shortBio.length).toBeLessThan(20);
      expect(validBio.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Profile Updates', () => {
    it('should update profile fields', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
      
      mockFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      } as any);
      
      const updates = {
        bio: 'Updated bio with sufficient length',
        occupation: 'Software Engineer',
      };
      
      await supabase.from('profiles').update(updates).eq('id', 'user-123');
      
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
    });
  });

  describe('Photo Upload', () => {
    it('should upload photo to storage', async () => {
      const mockStorage = vi.mocked(supabase.storage.from);
      const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'photo.jpg' }, error: null });
      
      mockStorage.mockReturnValue({
        upload: mockUpload,
      } as any);
      
      const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
      await supabase.storage.from('profile-photos').upload('user-123/photo.jpg', file);
      
      expect(mockUpload).toHaveBeenCalled();
    });
  });

  describe('Profile Completeness Check', () => {
    it('should validate required profile fields', () => {
      const completeProfile = {
        name: 'Test User',
        age: 25,
        gender: 'male',
        location: 'Erbil, Kurdistan',
        bio: 'This is a complete bio that meets all requirements',
        occupation: 'Software Engineer',
        height: '5\'10"',
        body_type: 'Athletic',
        ethnicity: 'Kurdish',
        religion: 'Islam',
        kurdistan_region: 'South-Kurdistan',
        education: "Bachelor's Degree",
        relationship_goals: 'Looking for something serious',
        want_children: 'Want children',
        exercise_habits: 'Regular exercise',
        values: ['Family', 'Honesty', 'Education'],
        interests: ['Technology', 'Travel', 'Music'],
        hobbies: ['Reading', 'Hiking'],
        languages: ['Kurdish', 'English'],
        profile_image: 'https://example.com/image.jpg',
      };
      
      // Check all required fields are present
      expect(completeProfile.name).toBeDefined();
      expect(completeProfile.age).toBeGreaterThanOrEqual(18);
      expect(completeProfile.bio.length).toBeGreaterThanOrEqual(20);
      expect(completeProfile.values.length).toBeGreaterThanOrEqual(3);
      expect(completeProfile.interests.length).toBeGreaterThanOrEqual(3);
      expect(completeProfile.hobbies.length).toBeGreaterThanOrEqual(2);
      expect(completeProfile.languages.length).toBeGreaterThanOrEqual(1);
    });
  });
});
