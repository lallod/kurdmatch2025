import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, partnerId } = await req.json();
    
    if (!userId || !partnerId) {
      throw new Error('Both userId and partnerId are required');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get recent messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('text, sender_id, created_at')
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (messagesError) throw messagesError;

    // Get both profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, interests, hobbies, values')
      .in('id', [userId, partnerId]);

    if (profilesError) throw profilesError;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const conversationText = messages?.map(m => m.text).join('\n') || '';
    const userProfile = profiles?.find(p => p.id === userId);
    const partnerProfile = profiles?.find(p => p.id === partnerId);

    const systemPrompt = `You are an AI relationship advisor. Analyze conversation patterns and profiles to provide helpful insights.
Generate insights about:
1. Shared interests and values
2. Suggested conversation topics
3. Communication style observations
4. Compatibility indicators

Be positive, constructive, and helpful.`;

    const userPrompt = `Analyze this conversation and profiles:

User Profile: ${JSON.stringify(userProfile)}
Partner Profile: ${JSON.stringify(partnerProfile)}

Recent conversation:
${conversationText}

Provide insights to help improve their connection.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_insights',
            description: 'Generate conversation insights and suggestions',
            parameters: {
              type: 'object',
              properties: {
                sharedInterests: {
                  type: 'array',
                  items: { type: 'string' }
                },
                suggestedTopics: {
                  type: 'array',
                  items: { type: 'string' }
                },
                conversationSummary: { type: 'string' },
                communicationStyle: { type: 'string' }
              },
              required: ['sharedInterests', 'suggestedTopics'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_insights' } }
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits depleted' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();
    console.log('Insights response:', JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No insights returned');
    }

    const insights = JSON.parse(toolCall.function.arguments);

    // Store insights in database
    const { error: insertError } = await supabase
      .from('ai_conversation_insights')
      .upsert({
        user_id: userId,
        conversation_partner_id: partnerId,
        shared_interests: insights.sharedInterests,
        suggested_topics: insights.suggestedTopics,
        conversation_summary: insights.conversationSummary,
        communication_style: insights.communicationStyle,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id,conversation_partner_id'
      });

    if (insertError) {
      console.error('Error storing insights:', insertError);
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
