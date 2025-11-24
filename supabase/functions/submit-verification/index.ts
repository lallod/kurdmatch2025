import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  verificationType: 'selfie' | 'id_document';
  imageData: string; // base64 encoded image
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the authorization header
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { verificationType, imageData }: VerificationRequest = await req.json();

    console.log(`Processing ${verificationType} verification for user ${user.id}`);

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const fileName = `${user.id}/${verificationType}_${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('verification-documents')
      .upload(fileName, bytes, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload document' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('verification-documents')
      .getPublicUrl(fileName);

    // Create verification request
    const { data: verificationData, error: verificationError } = await supabaseClient
      .from('verification_requests')
      .insert({
        user_id: user.id,
        verification_type: verificationType,
        [verificationType === 'selfie' ? 'selfie_url' : 'document_url']: publicUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (verificationError) {
      console.error('Verification request error:', verificationError);
      return new Response(JSON.stringify({ error: 'Failed to create verification request' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Verification request created successfully:', verificationData.id);

    return new Response(
      JSON.stringify({
        success: true,
        verificationRequest: verificationData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in submit-verification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
