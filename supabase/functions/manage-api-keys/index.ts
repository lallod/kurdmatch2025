import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const ALLOWED_KEYS = [
  'GIPHY_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_PREMIUM',
  'STRIPE_PRICE_GOLD',
  'GOOGLE_TRANSLATE_API_KEY',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'GOOGLE_VISION_API_KEY',
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check super admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .maybeSingle()

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden: super admin required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, key, value } = await req.json()

    if (action === 'set') {
      if (!ALLOWED_KEYS.includes(key)) {
        return new Response(JSON.stringify({ error: `Key '${key}' is not allowed` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!value || typeof value !== 'string') {
        return new Response(JSON.stringify({ error: 'Value is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { error: upsertError } = await supabase
        .from('app_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        }, { onConflict: 'key' })

      if (upsertError) {
        console.error('Error saving API key:', upsertError)
        return new Response(JSON.stringify({ error: 'Failed to save key' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      await supabase.from('admin_audit_log').insert({
        user_id: user.id,
        action_type: 'api_key_updated',
        table_name: 'app_settings',
        record_id: key,
        changes: { key, action: 'set' },
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      if (!ALLOWED_KEYS.includes(key)) {
        return new Response(JSON.stringify({ error: `Key '${key}' is not allowed` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { error: deleteError } = await supabase
        .from('app_settings')
        .delete()
        .eq('key', key)

      if (deleteError) {
        console.error('Error deleting API key:', deleteError)
        return new Response(JSON.stringify({ error: 'Failed to delete key' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      await supabase.from('admin_audit_log').insert({
        user_id: user.id,
        action_type: 'api_key_deleted',
        table_name: 'app_settings',
        record_id: key,
        changes: { key, action: 'delete' },
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'list') {
      const { data: keys } = await supabase
        .from('app_settings')
        .select('key, updated_at')
        .in('key', ALLOWED_KEYS)

      const configuredKeys: Record<string, boolean> = {}
      ALLOWED_KEYS.forEach(k => { configuredKeys[k] = false })
      keys?.forEach(k => { configuredKeys[k.key] = true })

      return new Response(JSON.stringify({ keys: configuredKeys }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use: set, delete, list' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('manage-api-keys error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
