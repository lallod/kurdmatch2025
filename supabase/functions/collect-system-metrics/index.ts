import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SystemMetric {
  metric_type: 'api_performance' | 'resource_usage' | 'incident';
  metric_data: any;
  severity?: 'info' | 'warning' | 'critical';
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Collecting system metrics...');

    const metrics: SystemMetric[] = [];
    const now = new Date().toISOString();

    // 1. Collect API Performance Metrics
    // This would normally query your API gateway/load balancer logs
    // For now, we'll create simulated metrics based on database performance
    const apiMetric: SystemMetric = {
      metric_type: 'api_performance',
      metric_data: {
        responseTime: Math.floor(Math.random() * 200) + 150, // 150-350ms
        errorRate: Math.random() * 1, // 0-1%
        requests: Math.floor(Math.random() * 1000) + 500, // 500-1500 requests
      },
      severity: 'info',
      timestamp: now,
    };
    metrics.push(apiMetric);

    // 2. Collect Resource Usage Metrics
    // In production, this would query actual system resources
    const resources = ['API Server', 'Database', 'Cache Server', 'Storage Server'];
    
    for (const resource of resources) {
      const cpu = Math.floor(Math.random() * 60) + 20; // 20-80%
      const memory = Math.floor(Math.random() * 50) + 30; // 30-80%
      const disk = Math.floor(Math.random() * 70) + 20; // 20-90%
      
      let severity: 'info' | 'warning' | 'critical' = 'info';
      if (cpu > 80 || memory > 80 || disk > 85) {
        severity = 'critical';
      } else if (cpu > 60 || memory > 70 || disk > 70) {
        severity = 'warning';
      }

      const resourceMetric: SystemMetric = {
        metric_type: 'resource_usage',
        metric_data: {
          resource,
          cpu,
          memory,
          disk,
          status: severity === 'critical' ? 'critical' : severity === 'warning' ? 'warning' : 'healthy',
        },
        severity,
        timestamp: now,
      };
      metrics.push(resourceMetric);
    }

    // 3. Check for incidents (query recent error logs, slow queries, etc.)
    // This would normally check your monitoring system
    // For demo purposes, randomly generate incidents
    if (Math.random() < 0.1) { // 10% chance of incident
      const incidents = [
        { title: 'High database latency detected', impact: 'Minor impact on query performance' },
        { title: 'API rate limiting triggered', impact: 'Brief slowdown in requests' },
        { title: 'Elevated error rate', impact: 'Some requests failing' },
      ];
      
      const incident = incidents[Math.floor(Math.random() * incidents.length)];
      
      const incidentMetric: SystemMetric = {
        metric_type: 'incident',
        metric_data: {
          title: incident.title,
          impact: incident.impact,
          status: 'investigating',
          id: `INC-${new Date().getTime()}`,
        },
        severity: 'warning',
        timestamp: now,
      };
      metrics.push(incidentMetric);
    }

    // Insert all metrics into the database
    const { data, error } = await supabaseClient
      .from('system_metrics')
      .insert(metrics)
      .select();

    if (error) {
      console.error('Error inserting metrics:', error);
      throw error;
    }

    console.log(`Successfully collected ${metrics.length} metrics`);

    // Clean up old metrics (keep only last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: deleteError } = await supabaseClient
      .from('system_metrics')
      .delete()
      .lt('timestamp', sevenDaysAgo);

    if (deleteError) {
      console.error('Error cleaning up old metrics:', deleteError);
    } else {
      console.log('Cleaned up old metrics');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        metricsCollected: metrics.length,
        message: 'System metrics collected successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in collect-system-metrics function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
