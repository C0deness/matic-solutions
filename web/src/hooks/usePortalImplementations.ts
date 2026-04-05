import * as React from "react";

import { fetchPortalImplementations } from "@/lib/portalDb";
import { getSupabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

import { usePortalAuth } from "@/portal/PortalAuthContext";

export function usePortalImplementations() {
  const { user } = usePortalAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<
    Awaited<ReturnType<typeof fetchPortalImplementations>>["rows"]
  >([]);

  React.useEffect(() => {
    if (!user?.id || user.id === "demo" || !isSupabaseConfigured()) {
      setLoading(false);
      setRows([]);
      setError(null);
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

    void fetchPortalImplementations(supabase, user.id).then((res) => {
      if (cancelled) return;
      setRows(res.rows);
      setError(res.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { loading, error, rows };
}
