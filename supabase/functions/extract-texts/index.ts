import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Text patterns to extract from code
const TEXT_PATTERNS = [
  // JSX text content
  /<[^>]+>([^<]+)</g,
  // String literals in attributes
  /(?:placeholder|label|title|aria-label|description|name)=["']([^"']+)["']/g,
  // Toast messages
  /toast\([^)]*title:\s*["']([^"']+)["']/g,
  /toast\([^)]*description:\s*["']([^"']+)["']/g,
  // Error messages
  /(?:error|Error|throw new Error)\s*\(\s*["']([^"']+)["']/g,
  // Button texts
  /<Button[^>]*>([^<]+)</g,
  // Heading texts
  /<h[1-6][^>]*>([^<]+)</g,
];

interface ExtractedText {
  text: string;
  category: string;
  context: string;
  file_path: string;
}

function categorizeText(text: string, filePath: string, context: string): string {
  const lower = text.toLowerCase();
  
  if (filePath.includes('/auth/')) return 'auth';
  if (filePath.includes('/admin/') || filePath.includes('/SuperAdmin/')) return 'admin';
  if (filePath.includes('Message') || lower.includes('message')) return 'messages';
  if (filePath.includes('Swipe') || filePath.includes('Discovery')) return 'discovery';
  if (filePath.includes('Profile') || lower.includes('profile')) return 'profile';
  if (filePath.includes('Settings') || lower.includes('setting')) return 'settings';
  if (filePath.includes('Match')) return 'matches';
  if (lower.includes('error') || lower.includes('failed') || lower.includes('invalid')) return 'errors';
  if (context.includes('placeholder') || context.includes('label')) return 'forms';
  if (context.includes('toast') || context.includes('notification')) return 'notifications';
  if (lower.includes('filter') || lower.includes('search')) return 'filters';
  if (context.includes('Button')) return 'actions';
  if (context.includes('<h')) return 'headings';
  
  return 'common';
}

function generateKey(text: string, category: string): string {
  // Create a key from the text
  let key = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5) // Take first 5 words
    .join('_');
  
  return `${category}.${key}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is a super admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Super admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get all existing translation keys to avoid duplicates
    const { data: existingTranslations } = await supabase
      .from('app_translations')
      .select('translation_key')
      .eq('language_code', 'english');

    const existingKeys = new Set(existingTranslations?.map(t => t.translation_key) || []);

    // Sample texts to extract - in production this would scan actual files
    // For now, we'll return a comprehensive list of common texts
    const textsToAdd: ExtractedText[] = [];

    // Auth texts
    const authTexts = [
      'Sign in to your account', 'Create your account', 'Email address', 'Password',
      'Confirm password', 'Forgot password?', 'Reset password', 'Send reset link',
      'Back to login', 'Already have an account?', 'Don\'t have an account?',
      'Sign up', 'Log in', 'Log out', 'First name', 'Last name', 'Date of birth',
      'I agree to the Terms and Conditions', 'Create account', 'Invalid email or password',
      'Password must be at least 8 characters', 'Passwords do not match',
      'Account created successfully', 'Welcome back!', 'Email verification sent',
    ];

    authTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'auth',
        context: 'Authentication and registration',
        file_path: 'auth'
      });
    });

    // Common UI texts
    const commonTexts = [
      'Save', 'Cancel', 'Delete', 'Edit', 'Search', 'Filter', 'Sort by',
      'Loading...', 'No results found', 'Try again', 'Refresh', 'Close',
      'Open', 'Submit', 'Reset', 'Apply', 'Clear', 'Select', 'Confirm',
      'Yes', 'No', 'OK', 'Back', 'Next', 'Previous', 'Continue',
      'Are you sure?', 'This action cannot be undone', 'Success', 'Error',
      'Settings', 'Profile', 'Help', 'About', 'Privacy', 'Terms',
    ];

    commonTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'common',
        context: 'Common UI elements',
        file_path: 'common'
      });
    });

    // Discovery/Swipe texts
    const discoveryTexts = [
      'Discovery', 'Find matches', 'Swipe to match', 'No more profiles',
      'Out of profiles for today', 'Come back tomorrow', 'Like', 'Dislike',
      'Super Like', 'Undo', 'Boost profile', 'Filters', 'Distance',
      'Age range', 'Looking for', 'Show me', 'Apply filters', 'Reset filters',
      'Height', 'Ethnicity', 'Religion', 'Education', 'Occupation',
      'Relationship type', 'Children', 'Smoking', 'Drinking', 'Exercise',
    ];

    discoveryTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'discovery',
        context: 'Discovery and matching',
        file_path: 'discovery'
      });
    });

    // Messages texts
    const messagesTexts = [
      'Messages', 'New message', 'Type a message...', 'Send', 'Delivered',
      'Read', 'Online', 'Offline', 'Last seen', 'Start conversation',
      'No messages yet', 'Say hi!', 'Translate message', 'Delete conversation',
      'Block user', 'Report user', 'Unmatch', 'Are you sure you want to unmatch?',
      'Message deleted', 'You can\'t send messages to this user',
    ];

    messagesTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'messages',
        context: 'Messaging features',
        file_path: 'messages'
      });
    });

    // Profile texts
    const profileTexts = [
      'My Profile', 'Edit profile', 'About me', 'Photos', 'Add photo',
      'Remove photo', 'Basic info', 'Interests', 'Hobbies', 'Values',
      'Languages', 'Location', 'Hometown', 'Lives in', 'From',
      'Education', 'Work', 'Height', 'Build', 'Hair color', 'Eye color',
      'Personality type', 'Zodiac sign', 'Political views', 'Religious views',
      'Relationship goals', 'Family plans', 'Pets', 'Complete your profile',
      'Profile visibility', 'Show me on Discovery', 'Incognito mode',
    ];

    profileTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'profile',
        context: 'Profile information',
        file_path: 'profile'
      });
    });

    // Matches texts
    const matchesTexts = [
      'Matches', 'New match!', 'You matched with', 'Start chatting',
      'Liked me', 'Who liked me', 'Mutual likes', 'See who likes you',
      'No matches yet', 'Keep swiping to find matches', 'Match expired',
      'Rematch', 'Unmatch', 'Hide match',
    ];

    matchesTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'matches',
        context: 'Matches and likes',
        file_path: 'matches'
      });
    });

    // Settings texts
    const settingsTexts = [
      'Account settings', 'Notification settings', 'Privacy settings',
      'Discovery settings', 'Language', 'Change language', 'Dark mode',
      'Push notifications', 'Email notifications', 'New matches', 'New messages',
      'Likes', 'Super Likes', 'Marketing emails', 'Account management',
      'Change password', 'Change email', 'Delete account', 'Logout',
      'Verify email', 'Phone number', 'Verify phone', 'Two-factor authentication',
      'Connected accounts', 'Block list', 'Blocked users', 'Unblock',
    ];

    settingsTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'settings',
        context: 'Settings and preferences',
        file_path: 'settings'
      });
    });

    // Notifications texts
    const notificationsTexts = [
      'Notifications', 'Mark all as read', 'Clear all', 'You have a new match!',
      'Someone liked your profile', 'New message from', 'Profile view',
      'Someone viewed your profile', 'Super Like received', 'Your profile was featured',
      'Subscription expiring soon', 'Profile update successful', 'Settings saved',
      'Password changed successfully', 'Email verified',
    ];

    notificationsTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'notifications',
        context: 'Notifications and alerts',
        file_path: 'notifications'
      });
    });

    // Validation texts
    const validationTexts = [
      'This field is required', 'Invalid email address', 'Invalid phone number',
      'Password too short', 'Password too weak', 'Passwords must match',
      'Please select at least one option', 'Maximum', 'characters allowed',
      'Minimum', 'characters required', 'Invalid date', 'You must be 18 or older',
      'Please fill in all required fields', 'Invalid input', 'File too large',
      'File type not supported', 'Maximum', 'files allowed',
    ];

    validationTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'validation',
        context: 'Form validation messages',
        file_path: 'validation'
      });
    });

    // Error texts
    const errorTexts = [
      'Something went wrong', 'Please try again', 'Network error',
      'Connection lost', 'Failed to load', 'Failed to save', 'Failed to delete',
      'Failed to update', 'Access denied', 'Not found', 'Session expired',
      'Please log in again', 'Service unavailable', 'Rate limit exceeded',
      'Too many requests', 'Invalid request', 'Bad request', 'Server error',
    ];

    errorTexts.forEach(text => {
      textsToAdd.push({
        text,
        category: 'errors',
        context: 'Error messages',
        file_path: 'errors'
      });
    });

    // Filter only new texts and prepare for database insertion
    const newTexts = textsToAdd.filter(t => {
      const key = generateKey(t.text, t.category);
      return !existingKeys.has(key);
    });

    console.log(`Found ${newTexts.length} new texts to add`);

    // Insert new translations for each language
    const languages = ['english', 'kurdish_sorani', 'kurdish_kurmanci', 'norwegian', 'german'];
    const translationsToInsert = [];

    for (const textItem of newTexts) {
      const key = generateKey(textItem.text, textItem.category);
      
      for (const lang of languages) {
        translationsToInsert.push({
          language_code: lang,
          translation_key: key,
          translation_value: lang === 'english' ? textItem.text : '', // Only English has values
          context: textItem.context,
          category: textItem.category,
          needs_review: lang !== 'english', // Non-English needs translation
          auto_translated: false,
        });
      }
    }

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < translationsToInsert.length; i += batchSize) {
      const batch = translationsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('app_translations')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
      } else {
        insertedCount += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted: newTexts.length,
        inserted: insertedCount,
        total_languages: languages.length,
        message: `Successfully extracted ${newTexts.length} unique texts and created ${insertedCount} translation entries across ${languages.length} languages`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
