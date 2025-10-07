import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    console.log('Starting create-super-admin function');

    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Creating Supabase admin client');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Step 1: Create user in Auth
    console.log(`Creating user with email: ${email}`);
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name || 'Super Admin'
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      return new Response(
        JSON.stringify({ error: userError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    console.log(`User created successfully with ID: ${userId}`);

    // Step 2: Create profile
    console.log('Creating profile');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        name: name || 'Super Admin',
        age: 30,
        location: 'Kurdistan',
        occupation: 'Administrator',
        bio: 'Super Admin Account',
        gender: 'male',
        kurdistan_region: 'South-Kurdistan',
        exercise_habits: 'Sometimes'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Continue even if profile creation fails
    } else {
      console.log('Profile created successfully');
    }

    // Step 3: Add super_admin role
    console.log('Adding super_admin role');
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'super_admin'
      });

    if (roleError) {
      console.error('Error creating role:', roleError);
      return new Response(
        JSON.stringify({ error: 'User created but failed to assign super_admin role: ' + roleError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Super admin role assigned successfully');

    // Step 4: Log admin activity
    await supabaseAdmin
      .from('admin_activities')
      .insert({
        user_id: userId,
        activity_type: 'super_admin_created',
        description: `Super admin account created for ${email}`
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Super admin user created successfully',
        userId: userId,
        email: email
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});