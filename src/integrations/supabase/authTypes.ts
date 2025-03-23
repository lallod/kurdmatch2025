
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthActions {
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  ensureAdminExists: (email: string, password: string) => Promise<boolean>;
}

export type SupabaseAuthHook = AuthState & AuthActions & {
  supabase: any;
};
