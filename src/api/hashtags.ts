import { supabase } from '@/integrations/supabase/client';

/**
 * Extract hashtags from text content
 */
export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#[\w\u0600-\u06FF]+/g;
  const matches = content.match(hashtagRegex);
  if (!matches) return [];
  
  // Remove # symbol and convert to lowercase
  return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
};

/**
 * Update hashtag usage counts in database
 */
export const updateHashtagUsage = async (hashtags: string[]): Promise<void> => {
  if (hashtags.length === 0) return;

  for (const hashtag of hashtags) {
    const { data: existing } = await supabase
      .from('hashtags')
      .select('id, usage_count')
      .eq('name', hashtag)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('hashtags')
        .update({ 
          usage_count: existing.usage_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('hashtags')
        .insert({ 
          name: hashtag,
          usage_count: 1 
        });
    }
  }
};

/**
 * Get trending hashtags
 */
export const getTrendingHashtags = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Search hashtags by name
 */
export const searchHashtags = async (query: string) => {
  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
};

/**
 * Get posts by hashtag
 */
export const getPostsByHashtag = async (hashtag: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        profile_image,
        verified
      )
    `)
    .contains('hashtags', [hashtag])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
