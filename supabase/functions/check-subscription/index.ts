import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // Get subscription from database
    const { data: subscription, error: subError } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subError && subError.code !== "PGRST116") {
      throw subError;
    }

    // If no subscription exists, create free tier
    if (!subscription) {
      const { data: newSub, error: insertError } = await supabaseClient
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          subscription_type: "free",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({
          subscription_type: "free",
          expires_at: null,
          is_active: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Check if subscription is active
    const isActive = subscription.expires_at
      ? new Date(subscription.expires_at) > new Date()
      : subscription.subscription_type === "free";

    // If expired, downgrade to free
    if (!isActive && subscription.subscription_type !== "free") {
      await supabaseClient
        .from("user_subscriptions")
        .update({
          subscription_type: "free",
          expires_at: null,
        })
        .eq("user_id", user.id);

      return new Response(
        JSON.stringify({
          subscription_type: "free",
          expires_at: null,
          is_active: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({
        subscription_type: subscription.subscription_type,
        expires_at: subscription.expires_at,
        is_active: isActive,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
