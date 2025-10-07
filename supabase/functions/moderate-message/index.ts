import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { messageText, conversationContext } = await req.json();
    
    // Input validation and sanitization
    if (!messageText || typeof messageText !== 'string') {
      throw new Error('Valid message text is required');
    }

    // Check message length
    if (messageText.length > 2000) {
      throw new Error('Message exceeds maximum length of 2000 characters');
    }

    // Remove null bytes and control characters
    const sanitizedMessage = messageText.replace(/[\x00-\x1F\x7F]/g, '');
    
    if (sanitizedMessage.trim().length === 0) {
      throw new Error('Message cannot be empty after sanitization');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a content moderation AI for a dating app. Analyze messages for:
1. Inappropriate content (harassment, explicit content, hate speech)
2. Spam or scam attempts
3. Personal information sharing (phone numbers, addresses, social media)
4. Potential safety concerns

Respond with a JSON object containing:
- "safe": boolean (true if message is appropriate)
- "reason": string (explanation if unsafe)
- "severity": "low" | "medium" | "high" (if unsafe)
- "suggestedAction": "warn" | "block" | "review" (if unsafe)`;

    const contextText = conversationContext ? `\n\nConversation context: ${conversationContext}` : '';

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
          { role: 'user', content: `Message to moderate: "${sanitizedMessage}"${contextText}` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'moderate_content',
            description: 'Analyze message safety and provide moderation decision',
            parameters: {
              type: 'object',
              properties: {
                safe: { type: 'boolean' },
                reason: { type: 'string' },
                severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                suggestedAction: { type: 'string', enum: ['warn', 'block', 'review'] }
              },
              required: ['safe'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'moderate_content' } }
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to moderate message');
    }

    const data = await response.json();
    console.log('Moderation response:', JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No moderation result returned');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in moderate-message:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
