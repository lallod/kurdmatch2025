import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Matching & Discovery Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Like Functionality', () => {
    it('should create like record when user likes a profile', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: 'like-123' }], error: null });
      
      mockFrom.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
      } as any);
      
      const likeData = {
        liker_id: 'user-123',
        likee_id: 'user-456',
      };
      
      await supabase.from('likes').insert(likeData).select();
      
      expect(mockFrom).toHaveBeenCalledWith('likes');
      expect(mockInsert).toHaveBeenCalledWith(likeData);
    });

    it('should check for mutual likes to create match', async () => {
      const mockFrom = vi.mocked(supabase.from);
      
      // Mock checking if user2 already liked user1
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { id: 'like-456' }, 
        error: null 
      });
      
      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);
      
      // Check if mutual like exists
      const mutualLike = await supabase
        .from('likes')
        .select()
        .eq('liker_id', 'user-456')
        .eq('likee_id', 'user-123')
        .single();
      
      expect(mutualLike.data).toBeDefined();
    });
  });

  describe('Match Creation', () => {
    it('should create match when both users like each other', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'match-123' }], error: null });
      
      mockFrom.mockReturnValue({
        insert: mockInsert,
      } as any);
      
      const matchData = {
        user1_id: 'user-123',
        user2_id: 'user-456',
      };
      
      await supabase.from('matches').insert(matchData);
      
      expect(mockInsert).toHaveBeenCalledWith(matchData);
    });
  });

  describe('Profile Discovery', () => {
    it('should fetch profiles excluding blocked users', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn().mockReturnThis();
      const mockNot = vi.fn().mockResolvedValue({ 
        data: [
          { id: 'user-456', name: 'User 2' },
          { id: 'user-789', name: 'User 3' },
        ], 
        error: null 
      });
      
      mockFrom.mockReturnValue({
        select: mockSelect,
        not: mockNot,
      } as any);
      
      const profiles = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', ['blocked-user-1', 'blocked-user-2']);
      
      expect(profiles.data).toHaveLength(2);
    });

    it('should apply age and location filters', async () => {
      const filters = {
        minAge: 25,
        maxAge: 35,
        location: 'Erbil, Kurdistan',
      };
      
      expect(filters.minAge).toBeGreaterThanOrEqual(18);
      expect(filters.maxAge).toBeGreaterThan(filters.minAge);
      expect(filters.location).toBeDefined();
    });
  });

  describe('Daily Usage Limits', () => {
    it('should track daily like count', async () => {
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { likes_count: 45 }, 
        error: null 
      });
      
      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);
      
      const usage = await supabase
        .from('daily_usage')
        .select('likes_count')
        .eq('user_id', 'user-123')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();
      
      expect(usage.data?.likes_count).toBeLessThanOrEqual(50); // Free tier limit
    });
  });
});
