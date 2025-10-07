import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationResult {
  approved: boolean;
  reason?: string;
  confidence: number;
  flags: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photoUrl, photoId } = await req.json();

    if (!photoUrl) {
      return new Response(
        JSON.stringify({ error: 'Photo URL is required' }),
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

    // Download the image to analyze it
    let imageData: ArrayBuffer;
    try {
      const imageResponse = await fetch(photoUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to download image');
      }
      imageData = await imageResponse.arrayBuffer();
    } catch (downloadError) {
      console.error('Error downloading image:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to access image' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert image to base64 for AI analysis
    const base64Image = btoa(
      new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // Create prompt for AI visual analysis
    const prompt = `Analyze this profile photo for a dating app. Determine if it meets community guidelines:

**Approval Criteria:**
✓ Clear face visible
✓ Appropriate clothing
✓ Single person (no group photos for profile picture)
✓ Real person (not cartoon/anime)
✓ No inappropriate gestures
✓ No violence or weapons
✓ No nudity or sexually explicit content
✓ No hate symbols or offensive content
✓ Good quality (not too blurry or dark)

Return ONLY a JSON object with this structure:
{
  "approved": <true/false>,
  "reason": "<brief explanation if rejected>",
  "confidence": <0.0-1.0>,
  "flags": ["<issue1>", "<issue2>"]
}

If approved, set flags to empty array and reason to null.
If rejected, list specific issues in flags array.`;

    // Call Lovable AI with vision capabilities
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
        model: 'google/gemini-2.5-flash', // Supports vision
        messages: [
          {
            role: 'system',
            content: 'You are a professional content moderator for a dating app. You analyze photos objectively and enforce community guidelines consistently. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.2, // Low temperature for consistent moderation
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
      
      throw new Error('Failed to moderate photo');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      throw new Error('No moderation result generated');
    }

    // Parse the JSON response
    let moderationResult: ModerationResult;
    try {
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moderationResult = JSON.parse(jsonMatch[0]);
      } else {
        moderationResult = JSON.parse(generatedContent);
      }

      // Validate confidence is within bounds
      if (moderationResult.confidence < 0 || moderationResult.confidence > 1) {
        moderationResult.confidence = Math.max(0, Math.min(1, moderationResult.confidence));
      }
    } catch (parseError) {
      console.error('Failed to parse moderation result:', parseError, 'Content:', generatedContent);
      // Default to approved with low confidence if parsing fails
      moderationResult = {
        approved: true,
        confidence: 0.5,
        flags: [],
        reason: null
      };
    }

    // Log moderation result for audit trail
    console.log('Photo moderation result:', {
      userId: user.id,
      photoId,
      approved: moderationResult.approved,
      confidence: moderationResult.confidence,
      flags: moderationResult.flags
    });

    // If photo was rejected, optionally store in moderation log
    if (!moderationResult.approved && photoId) {
      try {
        await supabase
          .from('moderation_actions')
          .insert({
            content_id: photoId,
            content_type: 'photo',
            action_type: 'rejected',
            admin_id: user.id, // System moderation
            reason: moderationResult.reason || 'Automated moderation',
          });
      } catch (logError) {
        console.error('Failed to log moderation action:', logError);
        // Don't fail the request if logging fails
      }
    }

    return new Response(
      JSON.stringify(moderationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in moderate-photo function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
