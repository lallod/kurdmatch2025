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
    const { matchedUserId } = await req.json();

    if (!matchedUserId) {
      return new Response(
        JSON.stringify({ error: 'Matched user ID is required' }),
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

    // Fetch both profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, age, interests, hobbies, values, occupation, kurdistan_region')
      .in('id', [user.id, matchedUserId]);

    if (profileError || !profiles || profiles.length !== 2) {
      console.error('Error fetching profiles:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profiles not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentUserProfile = profiles.find(p => p.id === user.id)!;
    const matchedUserProfile = profiles.find(p => p.id === matchedUserId)!;

    // Find common interests
    const commonInterests = currentUserProfile.interests?.filter((interest: string) =>
      matchedUserProfile.interests?.includes(interest)
    ) || [];

    const commonHobbies = currentUserProfile.hobbies?.filter((hobby: string) =>
      matchedUserProfile.hobbies?.includes(hobby)
    ) || [];

    const commonValues = currentUserProfile.values?.filter((value: string) =>
      matchedUserProfile.values?.includes(value)
    ) || [];

    // Create prompt for AI
    const prompt = `Generate 3 creative conversation starters for two people who just matched on a dating app.

Person 1: ${currentUserProfile.name}, ${currentUserProfile.age}, from ${currentUserProfile.kurdistan_region}
- Occupation: ${currentUserProfile.occupation}
- Interests: ${currentUserProfile.interests?.slice(0, 3).join(', ') || 'various interests'}
- Hobbies: ${currentUserProfile.hobbies?.slice(0, 2).join(', ') || 'various hobbies'}

Person 2: ${matchedUserProfile.name}, ${matchedUserProfile.age}, from ${matchedUserProfile.kurdistan_region}
- Occupation: ${matchedUserProfile.occupation}
- Interests: ${matchedUserProfile.interests?.slice(0, 3).join(', ') || 'various interests'}
- Hobbies: ${matchedUserProfile.hobbies?.slice(0, 2).join(', ') || 'various hobbies'}

${commonInterests.length > 0 ? `Common interests: ${commonInterests.slice(0, 2).join(', ')}` : ''}
${commonHobbies.length > 0 ? `Common hobbies: ${commonHobbies.slice(0, 2).join(', ')}` : ''}
${commonValues.length > 0 ? `Shared values: ${commonValues.slice(0, 2).join(', ')}` : ''}

Requirements:
- Each starter should be engaging, friendly, and natural
- Reference their shared interests or complementary traits when possible
- Keep it light and inviting
- Make it culturally appropriate for Kurdish dating context
- Avoid generic questions

Return ONLY a JSON array with 3 icebreakers, no other text:
["First icebreaker here", "Second icebreaker here", "Third icebreaker here"]`;

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
            content: 'You are a creative dating conversation expert who generates culturally appropriate, engaging conversation starters. Always return valid JSON arrays only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 300,
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
      
      throw new Error('Failed to generate icebreakers');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      throw new Error('No icebreakers generated');
    }

    // Parse the JSON response
    let icebreakers: string[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = generatedContent.match(/\[.*\]/s);
      if (jsonMatch) {
        icebreakers = JSON.parse(jsonMatch[0]);
      } else {
        icebreakers = JSON.parse(generatedContent);
      }
    } catch (parseError) {
      console.error('Failed to parse icebreakers:', parseError, 'Content:', generatedContent);
      // Fallback to generic icebreakers
      icebreakers = [
        `I noticed you're also interested in ${commonInterests[0] || currentUserProfile.interests?.[0] || 'exploring new things'}. What got you into that?`,
        `${matchedUserProfile.name}, tell me about your experience in ${matchedUserProfile.kurdistan_region}. What's your favorite thing about it?`,
        "What's something you're passionate about that most people don't know?"
      ];
    }

    return new Response(
      JSON.stringify({ icebreakers: icebreakers.slice(0, 3) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-icebreakers function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
