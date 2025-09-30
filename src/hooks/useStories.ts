import { useState, useEffect } from 'react';
import { getStoriesByUserId } from '@/api/posts';
import { Story } from '@/api/posts';

export const useStories = (userId: string) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const userStories = await getStoriesByUserId(userId);
      // Filter out expired stories (older than 24 hours)
      const activeStories = userStories.filter(
        story => new Date(story.expires_at) > new Date()
      );
      setStories(activeStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStories();
    }
  }, [userId]);

  return { stories, loading, refetch: fetchStories };
};
