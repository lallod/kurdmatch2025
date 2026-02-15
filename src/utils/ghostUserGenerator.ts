import { supabase } from '@/integrations/supabase/client';
import { kurdishMaleNames, kurdishFemaleNames, kurdishSurnames } from '@/utils/profileGenerator/data/names';
import { locations, kurdishRegions } from '@/utils/profileGenerator/data/locations';
import { maleProfilePhotoUrls, femaleProfilePhotoUrls } from '@/utils/profileGenerator/data/photos';

const bios = [
  "Living life to the fullest 🌟",
  "Coffee lover ☕ | Travel addict ✈️",
  "Kurdistan is my heart ❤️",
  "Making memories every day",
  "Adventure seeker | Food lover",
  "Love, peace, and good vibes",
  "Proud Kurd 🏔️",
  "Looking for something real",
  "Life is beautiful when shared",
  "Dream big, work hard",
  "Family first, always 💫",
  "Music is my language 🎶",
  "Exploring the world one step at a time",
  "Simple soul with big dreams",
  "Here for genuine connections",
];

const postCaptions = [
  "Beautiful sunset today 🌅",
  "Coffee and good vibes ☕",
  "Newroz preparations 🎉🔥",
  "Traditional Kurdish breakfast 🥘",
  "Weekend adventures in Kurdistan 🏔️",
  "Missing home 🏡",
  "Good times with great people",
  "Nature never gets old 🌿",
  "Grateful for this beautiful life ❤️",
  "Exploring new places today",
  "Friday vibes 🎶",
  "Sunset views from Erbil citadel",
  "Kurdish tea time ☕",
  "Mountain views hit different 🏔️",
  "Making memories that last forever",
  "Love this beautiful weather ☀️",
  "Best food in the world 🍽️",
  "Night out in Sulaymaniyah 🌃",
  "Family gathering ❤️",
  "Another blessed day",
];

const storyTexts = [
  "Good morning! ☀️",
  "What a beautiful day!",
  "Kurdish vibes 🎶",
  "Weekend mood 🎉",
  "Feeling blessed 🙏",
  "Love this weather!",
  "Missing Kurdistan 🏔️",
  "Tea time ☕",
  "Friday night 🌙",
  "Hello from Erbil!",
];

const storyMediaUrls = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  "https://images.unsplash.com/photo-1500534314263-0869cdddb572?w=400",
  "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
];

const postMediaUrls = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600",
  "https://images.unsplash.com/photo-1500534314263-0869cdddb572?w=600",
  "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
];

const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Lawyer',
  'Architect', 'Nurse', 'Pharmacist', 'Journalist', 'Designer',
  'Accountant', 'Dentist', 'Artist', 'Student', 'Marketing Manager',
];

const educationOptions = ['High School', "Bachelor's Degree", "Master's Degree", 'PhD', 'Diploma'];
const ethnicityOptions = ['Kurdish', 'Kurdish-Arab', 'Kurdish-Turkish', 'Kurdish-Persian'];
const religionOptions = ['Muslim', 'Yazidi', 'Christian', 'Zoroastrian', 'Spiritual'];
const relationshipGoals = ['Marriage', 'Long-term relationship', 'Friendship', 'Not sure yet'];
const bodyTypes = ['Athletic', 'Average', 'Slim', 'Curvy', 'Muscular', 'Fit'];
const exerciseHabits = ['Daily', 'Several times a week', 'Weekly', 'Occasionally', 'Rarely'];
const wantChildrenOptions = ['Yes', 'No', 'Maybe someday', 'Already have kids'];
const heightOptions = ['155', '160', '165', '170', '175', '180', '185', '190'];
const storyCategories = ['daily_life', 'travel', 'food', 'culture', 'selfie'];
const backgroundColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomAge(): number {
  return Math.floor(Math.random() * 20) + 20; // 20-39
}

function randomRecentDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

function randomFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  d.setHours(Math.floor(Math.random() * 14) + 8); // 8am-10pm
  return d.toISOString();
}

export interface GhostGenerationOptions {
  count: number;
  gender: 'male' | 'female' | 'mixed';
  generatePosts: boolean;
  generateStories: boolean;
  generatePhotos: boolean;
  setVerified: boolean;
  region?: string;
  onProgress?: (current: number, total: number) => void;
}

export async function generateGhostUsers(options: GhostGenerationOptions): Promise<{ success: number; errors: string[] }> {
  const { count, gender, generatePosts, generateStories, generatePhotos, setVerified, region, onProgress } = options;
  let success = 0;
  const errors: string[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const isMale = gender === 'male' ? true : gender === 'female' ? false : Math.random() > 0.5;
      const firstName = isMale ? pick(kurdishMaleNames) : pick(kurdishFemaleNames);
      const surname = pick(kurdishSurnames);
      const name = `${firstName} ${surname}`;
      const profileImage = isMale ? pick(maleProfilePhotoUrls) : pick(femaleProfilePhotoUrls);
      const loc = region
        ? locations.filter(l => l.includes('Kurdistan'))[Math.floor(Math.random() * 28)] || pick(locations)
        : pick(locations);

      const profileId = crypto.randomUUID();

      // Insert profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: profileId,
        name,
        gender: isMale ? 'Male' : 'Female',
        age: randomAge(),
        bio: pick(bios),
        location: loc,
        kurdistan_region: region || pick(kurdishRegions),
        profile_image: profileImage,
        occupation: pick(occupations),
        education: pick(educationOptions),
        ethnicity: pick(ethnicityOptions),
        religion: pick(religionOptions),
        relationship_goals: pick(relationshipGoals),
        body_type: pick(bodyTypes),
        exercise_habits: pick(exerciseHabits),
        want_children: pick(wantChildrenOptions),
        height: pick(heightOptions),
        verified: setVerified,
        is_generated: true,
        last_active: randomRecentDate(2),
      } as any);

      if (profileError) {
        errors.push(`Profile ${name}: ${profileError.message}`);
        continue;
      }

      // Generate photos
      if (generatePhotos) {
        const photoUrls = isMale ? pickN(maleProfilePhotoUrls, 2 + Math.floor(Math.random() * 3)) : pickN(femaleProfilePhotoUrls, 2 + Math.floor(Math.random() * 3));
        const photoInserts = photoUrls.map((url, idx) => ({
          profile_id: profileId,
          url,
          is_primary: idx === 0,
        }));
        await supabase.from('photos').insert(photoInserts);
      }

      // Generate immediate posts
      if (generatePosts) {
        const postCount = 2 + Math.floor(Math.random() * 4);
        const immediatePosts = [];
        for (let p = 0; p < postCount; p++) {
          const hasMedia = Math.random() > 0.3;
          immediatePosts.push({
            user_id: profileId,
            content: pick(postCaptions),
            media_url: hasMedia ? pick(postMediaUrls) : null,
            media_type: hasMedia ? 'image' : null,
            created_at: randomRecentDate(30),
          });
        }
        await supabase.from('posts').insert(immediatePosts);

        // Schedule future posts
        const futurePostCount = 1 + Math.floor(Math.random() * 3);
        const scheduledPosts = [];
        for (let fp = 0; fp < futurePostCount; fp++) {
          const hasMedia = Math.random() > 0.3;
          scheduledPosts.push({
            profile_id: profileId,
            content_type: 'post' as const,
            content: pick(postCaptions),
            media_url: hasMedia ? pick(postMediaUrls) : null,
            scheduled_for: randomFutureDate(30),
          });
        }
        await supabase.from('scheduled_content').insert(scheduledPosts);
      }

      // Generate stories
      if (generateStories) {
        const storyCount = 1 + Math.floor(Math.random() * 2);
        const immediateStories = [];
        for (let s = 0; s < storyCount; s++) {
          const now = new Date();
          const createdAt = new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000);
          immediateStories.push({
            user_id: profileId,
            media_url: pick(storyMediaUrls),
            media_type: 'image',
            text_overlay: pick(storyTexts),
            background_color: pick(backgroundColors),
            category: pick(storyCategories),
            expires_at: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            created_at: createdAt.toISOString(),
          });
        }
        await supabase.from('stories').insert(immediateStories);

        // Schedule future stories
        const futureStoryCount = 1 + Math.floor(Math.random() * 2);
        const scheduledStories = [];
        for (let fs = 0; fs < futureStoryCount; fs++) {
          scheduledStories.push({
            profile_id: profileId,
            content_type: 'story' as const,
            content: pick(storyTexts),
            media_url: pick(storyMediaUrls),
            scheduled_for: randomFutureDate(14),
          });
        }
        await supabase.from('scheduled_content').insert(scheduledStories);
      }

      success++;
      onProgress?.(i + 1, count);
    } catch (err: any) {
      errors.push(`User ${i + 1}: ${err.message}`);
    }
  }

  return { success, errors };
}

export async function deleteAllGhostUsers(): Promise<{ deleted: number; error?: string }> {
  // Get all ghost user IDs
  const { data: ghostUsers, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_generated', true);

  if (fetchError) return { deleted: 0, error: fetchError.message };
  if (!ghostUsers || ghostUsers.length === 0) return { deleted: 0 };

  const ids = ghostUsers.map(u => u.id);

  // Delete in cascading order
  for (const id of ids) {
    await supabase.from('scheduled_content').delete().eq('profile_id', id);
    await supabase.from('stories').delete().eq('user_id', id);
    await supabase.from('posts').delete().eq('user_id', id);
    await supabase.from('photos').delete().eq('profile_id', id);
    await supabase.from('profiles').delete().eq('id', id);
  }

  return { deleted: ids.length };
}

export async function deleteSingleGhostUser(profileId: string): Promise<{ error?: string }> {
  await supabase.from('scheduled_content').delete().eq('profile_id', profileId);
  await supabase.from('stories').delete().eq('user_id', profileId);
  await supabase.from('posts').delete().eq('user_id', profileId);
  await supabase.from('photos').delete().eq('profile_id', profileId);
  const { error } = await supabase.from('profiles').delete().eq('id', profileId);
  return { error: error?.message };
}

export async function publishScheduledContent(): Promise<{ published: number; error?: string }> {
  const { data, error } = await supabase.rpc('publish_scheduled_content');
  if (error) return { published: 0, error: error.message };
  return { published: data as number };
}

export async function regenerateActivity(profileIds: string[]): Promise<{ scheduled: number }> {
  let scheduled = 0;
  for (const profileId of profileIds) {
    const futurePostCount = 1 + Math.floor(Math.random() * 3);
    const items = [];
    for (let i = 0; i < futurePostCount; i++) {
      items.push({
        profile_id: profileId,
        content_type: Math.random() > 0.5 ? 'post' : 'story',
        content: Math.random() > 0.5 ? pick(postCaptions) : pick(storyTexts),
        media_url: pick(postMediaUrls),
        scheduled_for: randomFutureDate(30),
      });
    }
    await supabase.from('scheduled_content').insert(items);
    scheduled += items.length;

    // Update last_active
    await supabase.from('profiles').update({ last_active: new Date().toISOString() } as any).eq('id', profileId);
  }
  return { scheduled };
}
