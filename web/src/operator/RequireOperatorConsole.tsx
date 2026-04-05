import { Navigate, Outlet } from "react-router-dom";

/**
 * Solo habilita rutas de consola operador cuando VITE_OPERATOR_CONSOLE=true
 * (p. ej. en .env.local). Los clientes del portal no deben ver playbooks ni escenarios.
 */
export function isOperatorConsoleEnabled(): boolean {
  return import.meta.env.VITE_OPERATOR_CONSOLE === "true";
}

export function RequireOperatorConsole() {
  if (!isOperatorConsoleEnabled()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
