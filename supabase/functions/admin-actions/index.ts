import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_ACTIONS = [
  "delete_user",
  "unblock_user",
  "update_profile",
  "toggle_flag",
  "delete_content",
  "update_record",
  "delete_record",
  "insert_record",
] as const;

type Action = (typeof ALLOWED_ACTIONS)[number];

const ALLOWED_TABLES = [
  "profiles",
  "blocked_users",
  "message_safety_flags",
  "moderation_actions",
  "groups",
  "virtual_gifts",
  "ghost_profiles",
  "stories",
  "calls",
  "date_proposals",
  "marriage_intentions",
  "scheduled_content",
  "profile_section_views",
  "profile_details",
  "profile_preferences",
  "posts",
  "post_comments",
  "reports",
  "notifications",
  "photos",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify JWT
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Verify super_admin role using service-role client
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData, error: roleError } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden: super_admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { action, table, recordId, data } = await req.json() as {
      action: Action;
      table: string;
      recordId?: string;
      data?: Record<string, unknown>;
    };

    if (!ALLOWED_ACTIONS.includes(action)) {
      return new Response(
        JSON.stringify({ error: `Invalid action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(
        JSON.stringify({ error: `Table not allowed: ${table}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: unknown = null;

    switch (action) {
      case "delete_user":
      case "delete_content":
      case "delete_record": {
        if (!recordId) throw new Error("recordId required for delete");
        const { error } = await serviceClient.from(table).delete().eq("id", recordId);
        if (error) throw error;
        result = { deleted: recordId };
        break;
      }

      case "unblock_user": {
        if (!recordId) throw new Error("recordId required for unblock");
        const { error } = await serviceClient.from("blocked_users").delete().eq("id", recordId);
        if (error) throw error;
        result = { unblocked: recordId };
        break;
      }

      case "update_profile":
      case "update_record": {
        if (!recordId || !data) throw new Error("recordId and data required for update");
        const { data: updated, error } = await serviceClient
          .from(table)
          .update(data)
          .eq("id", recordId)
          .select()
          .maybeSingle();
        if (error) throw error;
        result = updated;
        break;
      }

      case "toggle_flag": {
        if (!recordId || !data) throw new Error("recordId and data required for toggle_flag");
        const { data: updated, error } = await serviceClient
          .from(table)
          .update(data)
          .eq("id", recordId)
          .select()
          .maybeSingle();
        if (error) throw error;
        result = updated;
        break;
      }

      case "insert_record": {
        if (!data) throw new Error("data required for insert");
        const { data: inserted, error } = await serviceClient
          .from(table)
          .insert(data)
          .select()
          .maybeSingle();
        if (error) throw error;
        result = inserted;
        break;
      }
    }

    // Write audit log
    await serviceClient.from("admin_audit_log").insert({
      user_id: userId,
      action_type: action,
      table_name: table,
      record_id: recordId || null,
      changes: data || null,
    });

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("admin-actions error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
