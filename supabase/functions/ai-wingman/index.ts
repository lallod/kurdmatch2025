import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WingmanRequest {
  type: 'opener' | 'reply' | 'continue' | 'flirt' | 'deeper';
  matchedUserId: string;
  conversationContext?: string[];
  lastMessage?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, matchedUserId, conversationContext, lastMessage }: WingmanRequest = await req.json();

    if (!matchedUserId) {
      return new Response(
        JSON.stringify({ error: 'Matched user ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch both profiles with extended data
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id, name, age, gender, interests, hobbies, values, occupation, 
        kurdistan_region, religion, relationship_goals, bio,
        favorite_music, favorite_movies, favorite_foods, dream_vacation
      `)
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

    // Find commonalities
    const commonInterests = currentUserProfile.interests?.filter((i: string) =>
      matchedUserProfile.interests?.includes(i)
    ) || [];
    const commonHobbies = currentUserProfile.hobbies?.filter((h: string) =>
      matchedUserProfile.hobbies?.includes(h)
    ) || [];
    const commonValues = currentUserProfile.values?.filter((v: string) =>
      matchedUserProfile.values?.includes(v)
    ) || [];

    // Build context-aware prompt based on type
    let systemPrompt = `You are an AI dating wingman for a Kurdish dating app. Your suggestions should be:
- Warm, genuine, and culturally appropriate
- Never creepy or too forward
- Engaging and conversation-starting
- Reference shared interests when possible
- Written in a natural, conversational tone

User is ${currentUserProfile.name}, ${currentUserProfile.age}, ${currentUserProfile.gender || 'person'}
Match is ${matchedUserProfile.name}, ${matchedUserProfile.age}, ${matchedUserProfile.gender || 'person'}

${commonInterests.length > 0 ? `Common interests: ${commonInterests.join(', ')}` : ''}
${commonHobbies.length > 0 ? `Common hobbies: ${commonHobbies.join(', ')}` : ''}
${commonValues.length > 0 ? `Shared values: ${commonValues.join(', ')}` : ''}
${currentUserProfile.kurdistan_region === matchedUserProfile.kurdistan_region ? `Both from ${currentUserProfile.kurdistan_region}` : `User from ${currentUserProfile.kurdistan_region}, match from ${matchedUserProfile.kurdistan_region}`}`;

    let userPrompt = '';
    
    switch (type) {
      case 'opener':
        userPrompt = `Generate 3 creative opening messages for ${currentUserProfile.name} to send to ${matchedUserProfile.name}.
${matchedUserProfile.bio ? `Their bio says: "${matchedUserProfile.bio}"` : ''}
${matchedUserProfile.occupation ? `They work as: ${matchedUserProfile.occupation}` : ''}

Make each opener unique:
1. One referencing their shared interests/hobbies
2. One playful/witty message
3. One thoughtful question about their profile

Return ONLY a JSON array: ["message1", "message2", "message3"]`;
        break;

      case 'reply':
        userPrompt = `${matchedUserProfile.name} just sent: "${lastMessage}"

Generate 3 reply suggestions for ${currentUserProfile.name}:
1. A warm, engaging response
2. A playful response that keeps the conversation going
3. A deeper response that shows genuine interest

Return ONLY a JSON array: ["reply1", "reply2", "reply3"]`;
        break;

      case 'continue':
        userPrompt = `The conversation has been:
${conversationContext?.slice(-6).join('\n') || 'Just started'}

Generate 3 messages to keep the conversation flowing:
1. A follow-up question based on what was discussed
2. A new topic based on their shared interests
3. Something fun or playful to add energy

Return ONLY a JSON array: ["message1", "message2", "message3"]`;
        break;

      case 'flirt':
        userPrompt = `Generate 3 tasteful, flirty messages for ${currentUserProfile.name} to send to ${matchedUserProfile.name}.
${conversationContext ? `Recent conversation:\n${conversationContext.slice(-4).join('\n')}` : ''}

Make them:
1. Subtle and sweet
2. Playful with a compliment
3. Confident but respectful

Return ONLY a JSON array: ["flirt1", "flirt2", "flirt3"]`;
        break;

      case 'deeper':
        userPrompt = `Generate 3 thoughtful questions for ${currentUserProfile.name} to ask ${matchedUserProfile.name} to deepen the connection.
${conversationContext ? `They've been talking about:\n${conversationContext.slice(-4).join('\n')}` : ''}

Focus on:
1. Their dreams and aspirations
2. Their values and what matters to them
3. Their Kurdish heritage and family

Return ONLY a JSON array: ["question1", "question2", "question3"]`;
        break;
    }

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
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,
        max_tokens: 400,
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
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to generate suggestions');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      throw new Error('No suggestions generated');
    }

    // Parse the JSON response
    let suggestions: string[];
    try {
      const jsonMatch = generatedContent.match(/\[.*\]/s);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(generatedContent);
      }
    } catch (parseError) {
      console.error('Failed to parse suggestions:', parseError, 'Content:', generatedContent);
      // Fallback suggestions
      suggestions = type === 'opener' ? [
        `Hey ${matchedUserProfile.name}! I noticed we're both into ${commonInterests[0] || 'similar things'}. What got you into that?`,
        `Your profile caught my eye! What's the story behind your bio?`,
        `Hi! Fellow ${currentUserProfile.kurdistan_region} here 👋 How's your day going?`
      ] : [
        "That's really interesting! Tell me more about that.",
        "I love that! What else are you passionate about?",
        "Same here! We should definitely talk more about this."
      ];
    }

    return new Response(
      JSON.stringify({ 
        suggestions: suggestions.slice(0, 3),
        type,
        matchName: matchedUserProfile.name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-wingman function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
