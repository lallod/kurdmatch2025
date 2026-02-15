import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const query = url.searchParams.get('q') || ''
    const limit = url.searchParams.get('limit') || '20'

    // Use configured key or fall back to Giphy public beta key
    const apiKey = Deno.env.get('GIPHY_API_KEY') || 'dc6zaTOxFJmzC'

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
