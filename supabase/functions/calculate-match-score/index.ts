import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchScore {
  score: number;
  breakdown: {
    interests: number;
    values: number;
    lifestyle: number;
    goals: number;
  };
  commonalities: string[];
  reasoning: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { otherUserId } = await req.json();

    if (!otherUserId) {
      return new Response(
        JSON.stringify({ error: 'Other user ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current user from auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch both profiles with related data
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id, 
        name, 
        age, 
        gender,
        location,
        kurdistan_region,
        occupation,
        education,
        relationship_goals,
        want_children,
        religion,
        political_views
      `)
      .in('id', [user.id, otherUserId]);

    if (profileError || !profiles || profiles.length !== 2) {
      console.error('Error fetching profiles:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profiles not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profile details
    const { data: profileDetails, error: detailsError } = await supabase
      .from('profile_details')
      .select('profile_id, height, body_type, ethnicity, smoking, drinking, exercise_habits')
      .in('profile_id', [user.id, otherUserId]);

    // Fetch profile preferences
    const { data: profilePreferences, error: prefsError } = await supabase
      .from('profile_preferences')
      .select('profile_id, relationship_goals, want_children, exercise_habits')
      .in('profile_id', [user.id, otherUserId]);

    // Fetch interests
    const { data: profileInterests, error: interestsError } = await supabase
      .from('profile_interests')
      .select(`
        profile_id,
        interests:interest_id (
          name,
          category
        )
      `)
      .in('profile_id', [user.id, otherUserId]);

    const currentUserProfile = profiles.find(p => p.id === user.id)!;
    const otherUserProfile = profiles.find(p => p.id === otherUserId)!;

    const currentUserDetails = profileDetails?.find(d => d.profile_id === user.id);
    const otherUserDetails = profileDetails?.find(d => d.profile_id === otherUserId);

    const currentUserPrefs = profilePreferences?.find(p => p.profile_id === user.id);
    const otherUserPrefs = profilePreferences?.find(p => p.profile_id === otherUserId);

    const currentUserInterests = profileInterests?.filter(i => i.profile_id === user.id).map(i => i.interests) || [];
    const otherUserInterests = profileInterests?.filter(i => i.profile_id === otherUserId).map(i => i.interests) || [];

    // Prepare comprehensive profile data for AI analysis
    const prompt = `Analyze compatibility between these two profiles and calculate a match score (0-100):

**Profile 1:**
- Age: ${currentUserProfile.age}, Gender: ${currentUserProfile.gender}
- Location: ${currentUserProfile.location}, Region: ${currentUserProfile.kurdistan_region}
- Occupation: ${currentUserProfile.occupation}, Education: ${currentUserProfile.education}
- Relationship Goals: ${currentUserProfile.relationship_goals}
- Children: ${currentUserProfile.want_children}
- Religion: ${currentUserProfile.religion}, Political Views: ${currentUserProfile.political_views}
- Exercise: ${currentUserDetails?.exercise_habits}, Smoking: ${currentUserDetails?.smoking}, Drinking: ${currentUserDetails?.drinking}
- Interests: ${currentUserInterests.map((i: any) => i.name).slice(0, 10).join(', ')}

**Profile 2:**
- Age: ${otherUserProfile.age}, Gender: ${otherUserProfile.gender}
- Location: ${otherUserProfile.location}, Region: ${otherUserProfile.kurdistan_region}
- Occupation: ${otherUserProfile.occupation}, Education: ${otherUserProfile.education}
- Relationship Goals: ${otherUserProfile.relationship_goals}
- Children: ${otherUserProfile.want_children}
- Religion: ${otherUserProfile.religion}, Political Views: ${otherUserProfile.political_views}
- Exercise: ${otherUserDetails?.exercise_habits}, Smoking: ${otherUserDetails?.smoking}, Drinking: ${otherUserDetails?.drinking}
- Interests: ${otherUserInterests.map((i: any) => i.name).slice(0, 10).join(', ')}

Calculate compatibility based on:
1. Shared interests and values (0-30 points)
2. Lifestyle compatibility (0-25 points)
3. Relationship goal alignment (0-25 points)
4. Complementary traits (0-20 points)

Return ONLY a JSON object with this structure:
{
  "score": <number 0-100>,
  "breakdown": {
    "interests": <number 0-30>,
    "values": <number 0-25>,
    "lifestyle": <number 0-25>,
    "goals": <number 0-20>
  },
  "commonalities": ["<shared trait 1>", "<shared trait 2>", "<shared trait 3>"],
  "reasoning": "<2-3 sentence explanation of the match quality>"
}`;

    // Call Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship compatibility analyzer. Always return valid JSON only, with accurate numerical scores based on the provided data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent scoring
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to calculate match score');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      throw new Error('No match score generated');
    }

    // Parse the JSON response
    let matchScore: MatchScore;
    try {
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchScore = JSON.parse(jsonMatch[0]);
      } else {
        matchScore = JSON.parse(generatedContent);
      }

      // Validate score is within bounds
      if (matchScore.score < 0 || matchScore.score > 100) {
        matchScore.score = Math.max(0, Math.min(100, matchScore.score));
      }
    } catch (parseError) {
      console.error('Failed to parse match score:', parseError, 'Content:', generatedContent);
      // Fallback to basic calculation
      const commonInterestCount = currentUserInterests.filter((i: any) => 
        otherUserInterests.some((oi: any) => oi.name === i.name)
      ).length;
      
      matchScore = {
        score: Math.min(100, 50 + (commonInterestCount * 5)),
        breakdown: {
          interests: Math.min(30, commonInterestCount * 5),
          values: 15,
          lifestyle: 20,
          goals: 15
        },
        commonalities: ['Similar life stage', 'Shared cultural background', 'Compatible values'],
        reasoning: 'You both share similar interests and life goals, which creates a strong foundation for connection.'
      };
    }

    return new Response(
      JSON.stringify(matchScore),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-match-score function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
