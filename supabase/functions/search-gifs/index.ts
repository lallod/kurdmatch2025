import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    let query = url.searchParams.get('q') || ''
    let limit = url.searchParams.get('limit') || '20'
    
    // Also support POST body
    if (req.method === 'POST') {
      try {
        const body = await req.json()
        if (body.q) query = body.q
        if (body.limit) limit = body.limit
      } catch {}
    }

    // Try env, then app_settings table, then Giphy public beta key
    let apiKey = Deno.env.get('GIPHY_API_KEY')
    
    if (!apiKey) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'GIPHY_API_KEY')
          .maybeSingle()
        if (data?.value) apiKey = data.value
      } catch (e) {
        console.warn('Could not read app_settings:', e)
      }
    }
    
    if (!apiKey) apiKey = 'dc6zaTOxFJmzC'

    const endpoint = query.trim()
      ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&rating=pg-13`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&rating=pg-13`

    const response = await fetch(endpoint)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Giphy API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ error: 'Giphy API error', gifs: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const data = await response.json()
    const gifs = data.data.map((gif: any) => ({
      id: gif.id,
      url: gif.images.fixed_height.url,
      preview: gif.images.fixed_height_small?.url || gif.images.fixed_height.url,
      title: gif.title,
    }))

    return new Response(
      JSON.stringify({ gifs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('search-gifs error:', error)
    return new Response(
      JSON.stringify({ error: error.message, gifs: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
