import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompatibilityFactors {
  baseScore: number;
  chatEngagement: number;
  responseQuality: number;
  sharedInterests: number;
  profileCompleteness: number;
  verificationBonus: number;
  activityScore: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { targetUserId, mode = 'full' } = await req.json();

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: 'Target user ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating compatibility for ${user.id} with ${targetUserId}, mode: ${mode}`);

    // Fetch both user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', [user.id, targetUserId]);

    if (profilesError || !profiles || profiles.length !== 2) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Could not fetch profiles', score: 50 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentUserProfile = profiles.find(p => p.id === user.id);
    const targetProfile = profiles.find(p => p.id === targetUserId);

    if (!currentUserProfile || !targetProfile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found', score: 50 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate compatibility factors
    const factors: CompatibilityFactors = {
      baseScore: 50, // Start at 50%
      chatEngagement: 0,
      responseQuality: 0,
      sharedInterests: 0,
      profileCompleteness: 0,
      verificationBonus: 0,
      activityScore: 0,
    };

    // 1. Shared Interests (up to 15 points)
    const userInterests = currentUserProfile.interests || [];
    const targetInterests = targetProfile.interests || [];
    const sharedInterests = userInterests.filter((i: string) => 
      targetInterests.some((t: string) => t.toLowerCase() === i.toLowerCase())
    );
    factors.sharedInterests = Math.min(15, sharedInterests.length * 3);

    // 2. Shared Values (up to 10 points)
    const userValues = currentUserProfile.values || [];
    const targetValues = targetProfile.values || [];
    const sharedValues = userValues.filter((v: string) => 
      targetValues.some((t: string) => t.toLowerCase() === v.toLowerCase())
    );
    factors.sharedInterests += Math.min(10, sharedValues.length * 2);

    // 3. Chat Engagement Score (up to 20 points)
    if (mode === 'full') {
      const { data: messages } = await supabase
        .from('messages')
        .select('id, sender_id, text, created_at')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
        .limit(100);

      if (messages && messages.length > 0) {
        // Count messages from each user
        const userMessages = messages.filter(m => m.sender_id === user.id);
        const targetMessages = messages.filter(m => m.sender_id === targetUserId);
        
        // Engagement balance (better if both contribute equally)
        const totalMessages = messages.length;
        const balanceRatio = Math.min(userMessages.length, targetMessages.length) / 
                            Math.max(userMessages.length, targetMessages.length, 1);
        
        // Message frequency bonus
        const conversationDays = messages.length > 1 
          ? (new Date(messages[messages.length - 1].created_at).getTime() - 
             new Date(messages[0].created_at).getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        
        const messagesPerDay = conversationDays > 0 ? totalMessages / conversationDays : totalMessages;
        
        // Quality score based on message length average
        const avgMessageLength = messages.reduce((sum, m) => sum + (m.text?.length || 0), 0) / messages.length;
        const qualityBonus = Math.min(5, avgMessageLength / 50);
        
        factors.chatEngagement = Math.min(15, (totalMessages / 10) * 3 + (balanceRatio * 5));
        factors.responseQuality = Math.min(5, qualityBonus);
      }
    }

    // 4. Profile Completeness (up to 10 points)
    const profileFields = [
      'bio', 'occupation', 'education', 'height', 'body_type',
      'religion', 'interests', 'hobbies', 'values', 'languages',
      'relationship_goals', 'love_language', 'personality_type'
    ];
    const filledFields = profileFields.filter(field => {
      const value = targetProfile[field];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });
    factors.profileCompleteness = Math.round((filledFields.length / profileFields.length) * 10);

    // 5. Verification Bonus (up to 10 points)
    if (targetProfile.verified) factors.verificationBonus += 5;
    if (targetProfile.video_verified) factors.verificationBonus += 5;

    // 6. Activity Score (up to 5 points)
    if (targetProfile.last_active) {
      const lastActive = new Date(targetProfile.last_active);
      const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
      if (hoursSinceActive < 1) factors.activityScore = 5;
      else if (hoursSinceActive < 24) factors.activityScore = 4;
      else if (hoursSinceActive < 72) factors.activityScore = 3;
      else if (hoursSinceActive < 168) factors.activityScore = 2;
      else factors.activityScore = 1;
    }

    // 7. Lifestyle Compatibility (up to 10 points)
    let lifestyleScore = 0;
    
    // Smoking/drinking preferences match
    if (currentUserProfile.smoking === targetProfile.smoking) lifestyleScore += 2;
    if (currentUserProfile.drinking === targetProfile.drinking) lifestyleScore += 2;
    
    // Relationship goals match
    if (currentUserProfile.relationship_goals === targetProfile.relationship_goals) lifestyleScore += 3;
    
    // Want children match
    if (currentUserProfile.want_children === targetProfile.want_children) lifestyleScore += 3;

    // Calculate final score
    const totalScore = Math.min(100, Math.round(
      factors.baseScore +
      factors.sharedInterests +
      factors.chatEngagement +
      factors.responseQuality +
      factors.profileCompleteness +
      factors.verificationBonus +
      factors.activityScore +
      lifestyleScore
    ));

    console.log(`Compatibility score calculated: ${totalScore}`, factors);

    return new Response(
      JSON.stringify({
        score: totalScore,
        factors: {
          sharedInterests: factors.sharedInterests,
          chatEngagement: factors.chatEngagement,
          responseQuality: factors.responseQuality,
          profileCompleteness: factors.profileCompleteness,
          verificationBonus: factors.verificationBonus,
          activityScore: factors.activityScore,
          lifestyleMatch: lifestyleScore,
        },
        sharedInterests,
        sharedValues,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', score: 50 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
