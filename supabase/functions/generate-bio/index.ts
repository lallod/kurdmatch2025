import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileId } = await req.json();

    // Input validation
    if (!profileId || typeof profileId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid Profile ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profileId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Profile ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare context for AI
    const interests = profile.interests?.slice(0, 3).join(', ') || 'exploring new experiences';
    const hobbies = profile.hobbies?.slice(0, 2).join(', ') || 'spending time with friends';
    const values = profile.values?.slice(0, 2).join(', ') || 'honesty and family';
    const kurdistanRegion = profile.kurdistan_region || 'Kurdistan';
    const age = profile.age || 25;
    const occupation = profile.occupation || 'professional';

    const prompt = `Write a compelling and authentic dating profile bio for a ${age}-year-old from ${kurdistanRegion}. 

Profile details:
- Occupation: ${occupation}
- Interests: ${interests}
- Hobbies: ${hobbies}
- Values: ${values}
- Relationship goals: ${profile.relationship_goals || 'meaningful connections'}

Create a bio that is:
- 2-3 sentences long
- Warm, genuine, and engaging
- Incorporates their Kurdish heritage naturally
- Highlights their personality and interests
- Ends with something inviting or intriguing

Do not use generic phrases or clichés. Make it feel personal and authentic.`;

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
            content: 'You are a professional dating profile writer who creates authentic, engaging bios that highlight people\'s best qualities while staying genuine and relatable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('Failed to generate bio');
    }

    const aiData = await aiResponse.json();
    const generatedBio = aiData.choices[0]?.message?.content?.trim();

    if (!generatedBio) {
      throw new Error('No bio generated');
    }

    // Update profile with generated bio
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ bio: generatedBio })
      .eq('id', profileId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    return new Response(
      JSON.stringify({ bio: generatedBio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-bio function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
