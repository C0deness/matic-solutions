import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { usePortalAuth } from "./PortalAuthContext";

export function PortalLogin() {
  const { signIn, user, isLoading, isSupabaseMode } = usePortalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const raw = (location.state as { from?: string } | null)?.from;
    if (
      raw &&
      raw.startsWith("/portal") &&
      !raw.startsWith("/portal/login")
    ) {
      return raw;
    }
    return "/portal";
  }, [location.state]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, user, navigate, redirectTo]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        return;
      }
      navigate(redirectTo, { replace: true });
    } finally {
      setPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-lg shadow-sm ring-1 ring-border"
          />
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Matic AIgency
            </p>
            <p className="text-sm text-muted-foreground">Panel cliente</p>
          </div>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Acceder al panel</CardTitle>
            <CardDescription>
              {isSupabaseMode
                ? "Acceso con correo y contraseña (Supabase Auth)."
                : "Modo local sin Supabase: cualquier email y contraseña de al menos 6 caracteres (solo esta máquina)."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portal-email">Correo</Label>
                <Input
                  id="portal-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portal-password">Contraseña</Label>
                <Input
                  id="portal-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                  minLength={6}
                  required
                />
              </div>
              {error ? (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Entrando…" : "Entrar"}
              </Button>
              {isSupabaseMode ? (
                <Link
                  to="/portal/registro"
                  className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Crear cuenta
                </Link>
              ) : null}
              <Link
                to="/"
                className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Volver a la web pública
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
