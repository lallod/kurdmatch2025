
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { action } = await req.json()

    if (action !== 'setup') {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Security: Only allow setup if NO super_admin exists yet (first-time bootstrap)
    const { data: existingAdmins, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1)

    if (checkError) {
      return new Response(
        JSON.stringify({ error: 'Failed to check existing admins' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (existingAdmins && existingAdmins.length > 0) {
      // Super admin already exists — require authentication
      const authHeader = req.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'Super admin already exists. Authentication required.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      })
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: caller }, error: authError } = await anonClient.auth.getUser(token)

      if (authError || !caller) {
        return new Response(
          JSON.stringify({ error: 'Invalid authentication' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const { data: callerRole } = await supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', caller.id)
        .eq('role', 'super_admin')
        .maybeSingle()

      if (!callerRole) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: super_admin role required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }
    }

    // Get admin credentials from Supabase secrets
    const adminEmail = Deno.env.get('SUPER_ADMIN_EMAIL')
    const adminPassword = Deno.env.get('SUPER_ADMIN_PASSWORD')

    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Admin credentials not configured in Supabase secrets' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Check if admin user exists
    const { data: users } = await supabaseClient.auth.admin.listUsers()
    const existingUser = users.users?.find(u => u.email === adminEmail)

    let userId = existingUser?.id

    // Create user if doesn't exist
    if (!userId) {
      const { data: newUser, error: signUpError } = await supabaseClient.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: 'Super Admin' }
      })

      if (signUpError || !newUser.user) {
        return new Response(
          JSON.stringify({ error: 'Failed to create admin user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      userId = newUser.user.id
    }

    // Ensure super admin role exists
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle()

    if (!roleData) {
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({ user_id: userId, role: 'super_admin' })

      if (roleError) {
        return new Response(
          JSON.stringify({ error: 'Failed to assign admin role' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin setup completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})