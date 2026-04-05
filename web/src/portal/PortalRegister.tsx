import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export function PortalRegister() {
  const { signUp, user, isLoading, isSupabaseMode } = usePortalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/portal", { replace: true });
    }
  }, [isLoading, user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canRegister = useMemo(() => isSupabaseMode, [isSupabaseMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    try {
      const { error: err, needsEmailConfirmation } = await signUp(
        email,
        password,
        companyName
      );
      if (err) {
        setError(err);
        return;
      }
      if (needsEmailConfirmation) {
        setInfo(
          "Revisad el correo: hay un enlace para confirmar la cuenta antes de entrar."
        );
        return;
      }
      navigate("/portal", { replace: true });
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
            <p className="text-sm text-muted-foreground">Crear cuenta</p>
          </div>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Registro</CardTitle>
            <CardDescription>
              {canRegister
                ? "Cuenta con correo y contraseña (Supabase Auth). Podéis activar confirmación por email en el panel de Supabase."
                : "Configurad VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el registro."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Correo</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                  disabled={!canRegister}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-company">Empresa (opcional)</Label>
                <Input
                  id="reg-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Nombre de la empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10"
                  disabled={!canRegister}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Contraseña</Label>
                <Input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                  minLength={6}
                  required
                  disabled={!canRegister}
                />
              </div>
              {error ? (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              {info ? (
                <p className="text-xs text-muted-foreground" role="status">
                  {info}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={!canRegister || pending}
              >
                {pending ? "Creando…" : "Crear cuenta"}
              </Button>
              <Link
                to="/portal/login"
                className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ¿Ya tenéis cuenta? Entrar
              </Link>
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
