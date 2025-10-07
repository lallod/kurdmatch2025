import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("No Stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log(`Webhook received: ${event.type}`);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer.deleted) {
          console.error("Customer was deleted");
          break;
        }

        const email = customer.email;
        if (!email) {
          console.error("No email found for customer");
          break;
        }

        // Get user by email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
        if (userError) {
          console.error("Error fetching users:", userError);
          break;
        }

        const user = userData.users.find(u => u.email === email);
        if (!user) {
          console.error(`No user found with email: ${email}`);
          break;
        }

        // Determine subscription type based on product
        const productId = subscription.items.data[0].price.product as string;
        let subscriptionType = "free";
        
        if (productId === "prod_SEXvI0ivqA0Yyf") {
          subscriptionType = "basic";
        } else if (productId === "prod_SEXxVvh07LbZIy") {
          subscriptionType = "premium";
        } else if (productId === "prod_SEXyD9PPXeVVbM") {
          subscriptionType = "gold";
        }

        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

        // Update or insert subscription
        const { error: upsertError } = await supabaseClient
          .from("user_subscriptions")
          .upsert({
            user_id: user.id,
            subscription_type: subscriptionType,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id",
          });

        if (upsertError) {
          console.error("Error upserting subscription:", upsertError);
        } else {
          console.log(`Subscription updated for user ${user.id}: ${subscriptionType} until ${expiresAt}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer.deleted) break;

        const email = customer.email;
        if (!email) break;

        const { data: userData } = await supabaseClient.auth.admin.listUsers();
        const user = userData?.users.find(u => u.email === email);
        if (!user) break;

        // Set back to free tier
        await supabaseClient
          .from("user_subscriptions")
          .upsert({
            user_id: user.id,
            subscription_type: "free",
            expires_at: null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id",
          });

        console.log(`Subscription cancelled for user ${user.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for invoice: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for invoice: ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
