
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action } = await req.json()

    if (action === 'setup') {
      // Get admin credentials from Supabase secrets
      const adminEmail = Deno.env.get('SUPER_ADMIN_EMAIL')
      const adminPassword = Deno.env.get('SUPER_ADMIN_PASSWORD')

      if (!adminEmail || !adminPassword) {
        return new Response(
          JSON.stringify({ 
            error: 'Admin credentials not configured in Supabase secrets' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
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
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
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
          .insert({
            user_id: userId,
            role: 'super_admin'
          })

        if (roleError) {
          return new Response(
            JSON.stringify({ error: 'Failed to assign admin role' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          )
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Admin setup completed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
