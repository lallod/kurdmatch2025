import { supabase } from '@/integrations/supabase/client';
import { generateRandomUserActivity } from '../profileGenerator/generators/updaters/activityGenerator';

// Sample data arrays
const postContents = [
  'Just had the most amazing Kurdish tea at a local café ☕️',
  'Exploring the beautiful mountains of Kurdistan today 🏔️',
  'Missing home and the taste of authentic dolma 🍽️',
  'Attended a wonderful Kurdish cultural event tonight 🎉',
  'Learning to play the daf. Our traditional music is beautiful 🥁',
  'Reading beautiful Kurdish poetry tonight 📖',
  'Family gathering today! Nothing is more important ❤️',
  'Started my day with traditional Kurdish breakfast 🌅',
  'Practicing my languages. Learning is a journey! 📚',
  'Just finished an amazing workout session 💪',
  'Watching the sunset from the citadel 🌇',
  'Coffee date with friends. Good company ☕',
  'Working on my new project. Excited! 🚀',
  'Celebrating Newroz with family! Happy New Year! 🔥',
  'Beautiful day in Kurdistan 🌸',
  'Cooking traditional Kurdish dishes today 🍲'
];

const storyCategories = ['general', 'culture', 'lifestyle', 'travel', 'food'];
const eventCategories = ['social', 'cultural', 'professional', 'sports', 'education'];

const commentTexts = [
  'Love this! 😍',
  'Amazing post!',
  'So beautiful!',
  'Great to see this',
  'Wonderful!',
  'This is awesome',
  'Can\'t wait!',
  'Looks great!',
  'Interesting perspective',
  'Thanks for sharing!'
];

const eventTitles = [
  'Kurdish Cultural Night',
  'Community Meetup',
  'Traditional Dance Workshop',
  'Kurdish Language Class',
  'Mountain Hiking Trip',
  'Food Festival',
  'Poetry Reading Evening',
  'Music Concert',
  'Art Exhibition',
  'Newroz Celebration'
];

/**
 * Generate comprehensive data for all users
 */
export const generateAllData = async (): Promise<{
  success: boolean;
  stats: {
    likes: number;
    matches: number;
    messages: number;
    posts: number;
    comments: number;
    stories: number;
    events: number;
    followers: number;
  };
  error?: string;
}> => {
  const stats = {
    likes: 0,
    matches: 0,
    messages: 0,
    posts: 0,
    comments: 0,
    stories: 0,
    events: 0,
    followers: 0
  };

  try {
    console.log('Starting comprehensive data generation...');
    
    // Get all profiles
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, gender')
      .limit(1000);
      
    if (fetchError || !profiles || profiles.length === 0) {
      return { success: false, stats, error: 'Failed to fetch profiles' };
    }

    console.log(`Generating data for ${profiles.length} users`);

    // 1. Generate likes, matches, and messages using existing function
    console.log('Generating likes, matches, and messages...');
    const activityResults = await generateRandomUserActivity(profiles.length);
    stats.likes = activityResults.likesGenerated;
    stats.matches = activityResults.matchesGenerated;
    stats.messages = activityResults.messagesGenerated;

    // 2. Generate posts (2-4 per user)
    console.log('Generating posts...');
    for (const profile of profiles) {
      const postCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < postCount; i++) {
        const { error } = await supabase.from('posts').insert({
          user_id: profile.id,
          content: postContents[Math.floor(Math.random() * postContents.length)],
          media_type: Math.random() > 0.5 ? 'image' : null,
          media_url: Math.random() > 0.5 ? `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800` : null,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        if (!error) stats.posts++;
      }
    }

    // 3. Get all posts for comments and reactions
    const { data: posts } = await supabase.from('posts').select('id, user_id');
    
    if (posts) {
      // 4. Generate comments (1-5 per post)
      console.log('Generating comments...');
      for (const post of posts) {
        const commentCount = Math.floor(Math.random() * 5) + 1;
        const commenters = profiles.filter(p => p.id !== post.user_id).slice(0, commentCount);
        
        for (const commenter of commenters) {
          const { error } = await supabase.from('post_comments').insert({
            post_id: post.id,
            user_id: commenter.id,
            content: commentTexts[Math.floor(Math.random() * commentTexts.length)]
          });
          if (!error) stats.comments++;
        }
      }

      // 5. Generate post reactions (2-10 per post)
      console.log('Generating post reactions...');
      const reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'fire', 'applause', 'thoughtful'];
      for (const post of posts) {
        const reactionCount = Math.floor(Math.random() * 9) + 2;
        const reactors = profiles.filter(p => p.id !== post.user_id).slice(0, reactionCount);
        
        for (const reactor of reactors) {
          await supabase.from('post_reactions').insert({
            post_id: post.id,
            user_id: reactor.id,
            reaction_type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)]
          });
        }
      }
    }

    // 6. Generate stories (20% of users)
    console.log('Generating stories...');
    const storyUsers = profiles.slice(0, Math.floor(profiles.length * 0.2));
    for (const user of storyUsers) {
      const { data: story, error } = await supabase.from('stories').insert({
        user_id: user.id,
        media_url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400`,
        media_type: 'image',
        category: storyCategories[Math.floor(Math.random() * storyCategories.length)],
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }).select();
      
      if (!error && story) {
        stats.stories++;
        
        // Generate story views (5-20 per story)
        const viewCount = Math.floor(Math.random() * 16) + 5;
        const viewers = profiles.filter(p => p.id !== user.id).slice(0, viewCount);
        for (const viewer of viewers) {
          await supabase.from('story_views').insert({
            story_id: story[0].id,
            viewer_id: viewer.id
          });
        }
      }
    }

    // 7. Generate events (5% of users create events)
    console.log('Generating events...');
    const eventCreators = profiles.slice(0, Math.floor(profiles.length * 0.05));
    for (const creator of eventCreators) {
      const { data: event, error } = await supabase.from('events').insert({
        user_id: creator.id,
        title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
        description: 'Join us for an amazing experience!',
        location: 'Erbil, Kurdistan',
        category: eventCategories[Math.floor(Math.random() * eventCategories.length)],
        event_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_attendees: Math.floor(Math.random() * 50) + 20
      }).select();
      
      if (!error && event) {
        stats.events++;
        
        // Generate event attendees (5-15 per event)
        const attendeeCount = Math.floor(Math.random() * 11) + 5;
        const attendees = profiles.filter(p => p.id !== creator.id).slice(0, attendeeCount);
        for (const attendee of attendees) {
          await supabase.from('event_attendees').insert({
            event_id: event[0].id,
            user_id: attendee.id
          });
        }
      }
    }

    // 8. Generate followers (each user follows 5-20 others)
    console.log('Generating followers...');
    for (const user of profiles) {
      const followCount = Math.floor(Math.random() * 16) + 5;
      const toFollow = profiles.filter(p => p.id !== user.id).slice(0, followCount);
      
      for (const followed of toFollow) {
        const { error } = await supabase.from('followers').insert({
          follower_id: user.id,
          following_id: followed.id
        });
        if (!error) stats.followers++;
      }
    }

    console.log('Data generation complete!', stats);
    return { success: true, stats };
    
  } catch (error) {
    console.error('Error generating data:', error);
    return { 
      success: false, 
      stats, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
