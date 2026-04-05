import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import { getSupabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

const DEMO_STORAGE_KEY = "matic_panel_session_v1";

export type PortalUser = {
  id: string;
  email: string;
};

type PortalAuthContextValue = {
  user: PortalUser | null;
  isLoading: boolean;
  /** true = Supabase email/contraseña; false = demo local (sin env). */
  isSupabaseMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    companyName?: string
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

function readDemoSession(): PortalUser | null {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { email?: string; id?: string };
    if (data && typeof data.email === "string" && data.email.includes("@")) {
      return { id: data.id ?? "demo", email: data.email };
    }
    return null;
  } catch {
    return null;
  }
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const supabaseMode = isSupabaseConfigured();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabaseMode) {
      setUser(readDemoSession());
      setIsLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUser(sessionUser(session));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(sessionUser(session));
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabaseMode]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed.includes("@") || password.length < 6) {
        return { error: "Correo o contraseña no válidos (mín. 6 caracteres)." };
      }

      if (!supabaseMode) {
        localStorage.setItem(
          DEMO_STORAGE_KEY,
          JSON.stringify({ email: trimmed, id: "demo" })
        );
        setUser({ id: "demo", email: trimmed });
        return { error: null };
      }

      const supabase = getSupabase();
      if (!supabase) {
        return { error: "Supabase no está configurado." };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    },
    [supabaseMode]
  );

  const signUp = useCallback(
    async (email: string, password: string, companyName?: string) => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed.includes("@") || password.length < 6) {
        return {
          error: "Correo o contraseña no válidos (mín. 6 caracteres).",
          needsEmailConfirmation: false,
        };
      }

      if (!supabaseMode) {
        return {
          error:
            "El registro requiere Supabase. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
          needsEmailConfirmation: false,
        };
      }

      const supabase = getSupabase();
      if (!supabase) {
        return {
          error: "Supabase no está configurado.",
          needsEmailConfirmation: false,
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: {
          data: {
            company_name: companyName?.trim() || undefined,
          },
        },
      });

      if (error) {
        return { error: error.message, needsEmailConfirmation: false };
      }

      const needsEmailConfirmation = data.session == null;

      return { error: null, needsEmailConfirmation };
    },
    [supabaseMode]
  );

  const signOut = useCallback(async () => {
    if (!supabaseMode) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setUser(null);
      navigate("/portal/login", { replace: true });
      return;
    }

    const supabase = getSupabase();
    await supabase?.auth.signOut();
    setUser(null);
    navigate("/portal/login", { replace: true });
  }, [navigate, supabaseMode]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isSupabaseMode: supabaseMode,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, supabaseMode, signIn, signUp, signOut]
  );

  return (
    <PortalAuthContext.Provider value={value}>
      {children}
    </PortalAuthContext.Provider>
  );
}

function sessionUser(session: Session | null): PortalUser | null {
  if (!session?.user) return null;
  const email = session.user.email;
  if (!email) return null;
  return { id: session.user.id, email };
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) {
    throw new Error("usePortalAuth debe usarse dentro de PortalAuthProvider");
  }
  return ctx;
}
