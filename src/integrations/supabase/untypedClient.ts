/**
 * Typed helper for Supabase tables not yet in generated types.
 * Use this instead of `(supabase as any).from('table')` to centralize
 * type assertions and make future cleanup easier when types are regenerated.
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Access a Supabase table that isn't in the generated types yet.
 * When types are regenerated, replace usages of this with direct `supabase.from()`.
 */
export const fromUntyped = (table: string) => {
  return (supabase as any).from(table);
};

/**
 * Call a Supabase RPC function that isn't in the generated types yet.
 * When types are regenerated, replace usages of this with direct `supabase.rpc()`.
 */
export const rpcUntyped = (fn: string, params?: Record<string, any>) => {
  return (supabase as any).rpc(fn, params);
};
