/**
 * Manages global authentication state and Supabase session synchronization so the
 * rest of the app can gate Storage/Postgres calls without each screen re-implementing auth listeners.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  /** `user` / `session` mirror Supabase Auth; `loading` avoids flashing logged-out UI before the first hydration. */
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Side effect: hydrate React state from Supabase Auth on mount and on every auth transition
   * (login, refresh, logout). Dependency array is empty because the listener is app-lifetime.
   * Cleanup unsubscribes the listener to avoid duplicate handlers if the provider ever remounts
   * (e.g. in tests or strict mode double-invocation).
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Exposed auth API: thin wrappers around Supabase Auth. The JWT in the session is what PostgREST uses for RLS
   * on subsequent `supabase.from(...)` calls anywhere under this provider.
   */
  const value = {
    user,
    session,
    loading,
    signUp: async (email, password, metadata = {}) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      return data;
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

