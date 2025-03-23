
import { supabase } from '@/integrations/supabase/client';
import { getRandomElement } from '../../utils/helpers';

/**
 * Generate random user activity - likes, matches, and messages
 * @param count Maximum number of users to process
 */
export const generateRandomUserActivity = async (count: number = 50): Promise<{
  likesGenerated: number,
  matchesGenerated: number,
  messagesGenerated: number
}> => {
  let likesGenerated = 0;
  let matchesGenerated = 0;
  let messagesGenerated = 0;
  
  try {
    // Get a list of user IDs to work with
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name')
      .limit(Math.max(count, 20)); // Ensure we have at least 20 profiles to work with
    
    if (fetchError || !profiles || profiles.length < 2) {
      console.error('Error fetching profiles for activity generation:', fetchError);
      return { likesGenerated, matchesGenerated, messagesGenerated };
    }
    
    const userCount = profiles.length;
    console.log(`Generating activity among ${userCount} users`);
    
    // Clear existing activity data to prevent duplicates
    try {
      await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log("Cleared existing activity data");
    } catch (clearError) {
      console.error("Error clearing existing activity data:", clearError);
    }
    
    // Generate random likes (each user likes ~10 other users)
    for (const user of profiles) {
      // Select 10 random users to like (or fewer if not enough users)
      const likesCount = Math.min(10, userCount - 1);
      const potentialLikes = profiles.filter(p => p.id !== user.id);
      const usersToLike = [];
      
      // Select random users to like
      while (usersToLike.length < likesCount && potentialLikes.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialLikes.length);
        usersToLike.push(potentialLikes[randomIndex]);
        potentialLikes.splice(randomIndex, 1);
      }
      
      // Create likes
      for (const likedUser of usersToLike) {
        const { error: likeError } = await supabase
          .from('likes')
          .insert({
            liker_id: user.id,
            likee_id: likedUser.id
          });
          
        if (!likeError) {
          likesGenerated++;
          
          // Check if this creates a mutual match (50% chance)
          if (Math.random() > 0.5) {
            // Create a mutual like
            const { error: mutualLikeError } = await supabase
              .from('likes')
              .insert({
                liker_id: likedUser.id,
                likee_id: user.id
              });
              
            if (!mutualLikeError) {
              likesGenerated++;
              
              // Create a match
              const { error: matchError } = await supabase
                .from('matches')
                .insert({
                  user1_id: user.id,
                  user2_id: likedUser.id
                });
                
              if (!matchError) {
                matchesGenerated++;
                
                // Generate 1-5 messages between the matched users
                await generateConversation(user.id, likedUser.id, messagesGenerated);
                messagesGenerated += Math.floor(Math.random() * 5) + 1;
              }
            }
          }
        }
      }
      
      // Log progress
      if (profiles.indexOf(user) % 5 === 0) {
        console.log(`Processed ${profiles.indexOf(user) + 1}/${userCount} users`);
      }
    }
    
    console.log(`Activity generation complete. Generated ${likesGenerated} likes, ${matchesGenerated} matches, and ${messagesGenerated} messages`);
    return { likesGenerated, matchesGenerated, messagesGenerated };
    
  } catch (error) {
    console.error('Error generating random user activity:', error);
    return { likesGenerated, matchesGenerated, messagesGenerated };
  }
};

/**
 * Generate a conversation between two users with 1-5 messages
 * @param user1Id First user's ID
 * @param user2Id Second user's ID
 */
async function generateConversation(user1Id: string, user2Id: string, currentCount: number): Promise<void> {
  // Message templates
  const messageTemplates = [
    "Hi there! How are you doing?",
    "Nice to meet you! I like your profile.",
    "Hello! What are your interests?",
    "Hey! What's up?",
    "I noticed we have some things in common.",
    "Would you like to chat sometime?",
    "I'm interested in getting to know you better.",
    "What do you enjoy doing in your free time?",
    "How's your day going?",
    "Do you have any plans for the weekend?"
  ];
  
  // Generate 1-5 messages
  const messageCount = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < messageCount; i++) {
    // 50% chance for each user to be the sender
    const isSenderFirstUser = Math.random() > 0.5;
    const senderId = isSenderFirstUser ? user1Id : user2Id;
    const recipientId = isSenderFirstUser ? user2Id : user1Id;
    
    // Create message
    await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        text: getRandomElement(messageTemplates),
        read: Math.random() > 0.3 // 70% chance message is read
      });
  }
}
