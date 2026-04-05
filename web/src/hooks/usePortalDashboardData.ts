import * as React from "react";

import { fetchPortalDashboardData } from "@/lib/portalDb";
import { getSupabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

import { usePortalAuth } from "@/portal/PortalAuthContext";

export function usePortalDashboardData() {
  const { user } = usePortalAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Awaited<
    ReturnType<typeof fetchPortalDashboardData>
  > | null>(null);

  React.useEffect(() => {
    if (!user?.id || user.id === "demo" || !isSupabaseConfigured()) {
      setLoading(false);
      setData(null);
      setError(
        !isSupabaseConfigured()
          ? "Supabase no configurado"
          : "Iniciá sesión para ver los datos"
      );
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setError("Cliente Supabase no disponible");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchPortalDashboardData(supabase, user.id).then((res) => {
      if (cancelled) return;
      setData(res);
      setError(res.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { loading, error, data };
}
