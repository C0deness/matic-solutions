import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePortalAuth } from "./PortalAuthContext";

export function RequirePortalAuth() {
  const { user, isLoading } = usePortalAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Cargando panel…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/portal/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
