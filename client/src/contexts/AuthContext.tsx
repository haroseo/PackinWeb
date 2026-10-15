import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  isAnonymous: boolean;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    void client.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setLoading(false);
        if (!data.session) {
          void client.auth
            .signInAnonymously()
            .then(({ data: anonymousData }) => {
              if (active) setUser(anonymousData.user ?? null);
            });
        }
      }
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (!supabase) {
      return { error: new Error("Supabase가 아직 연결되지 않았습니다.") };
    }
    const { data } = await supabase.auth.getSession();
    const { error } = data.session?.user.is_anonymous
      ? await supabase.auth.linkIdentity({ provider: "google" })
      : await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
    return { error };
  }

  async function signOut() {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAnonymous: Boolean(user?.is_anonymous),
        loading,
        configured: Boolean(supabase),
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is missing");
  return value;
}
