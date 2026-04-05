import { MessageSquarePlus, Send } from "lucide-react";
import * as React from "react";

import { classifyUserMessage } from "@/command-center/classifyIntent";
import { appendCaseMessages, insertPortalCaseWithMessages } from "@/lib/casesDb";
import { getSupabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";
import { isOperatorConsoleEnabled } from "@/operator/RequireOperatorConsole";
import { formatClientRequestAck } from "@/portal/formatClientRequestAck";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { usePortalAuth } from "./PortalAuthContext";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const INTRO_TEXT =
  "Hola. Describid con el mayor detalle posible lo que necesitáis: objetivo, plazo si lo tenéis y sistemas o equipos implicados. Nos llegará al equipo y os responderemos con los siguientes pasos.";

function makeId() {
  return crypto.randomUUID();
}

export function ImplementationRequestChat() {
  const { user } = usePortalAuth();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    { id: "intro", role: "assistant", text: INTRO_TEXT },
  ]);
  const [sending, setSending] = React.useState(false);
  const activeCaseIdRef = React.useRef<string | null>(null);
  const endRef = React.useRef<HTMLDivElement>(null);

  const persistEnabled =
    isSupabaseConfigured() && user != null && user.id !== "demo";

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  React.useEffect(() => {
    if (open) {
      activeCaseIdRef.current = null;
      setMessages([{ id: "intro", role: "assistant", text: INTRO_TEXT }]);
    }
  }, [open]);

  const send = React.useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setSending(true);
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text }]);

    const classified = classifyUserMessage(text);
    if (import.meta.env.DEV && isOperatorConsoleEnabled()) {
      console.info("[Matic operador] Clasificación demo:", {
        scenarioId: classified.scenario.id,
        playbookId: classified.scenario.playbookId,
        dept: classified.scenario.primaryDept,
        score: classified.score,
        fallback: classified.isFallback,
      });
    }
    const reply = formatClientRequestAck(classified);

    try {
      if (persistEnabled) {
        const supabase = getSupabase();
        if (!supabase) {
          throw new Error("Cliente Supabase no disponible");
        }
        const uid = user!.id;
        let err: string | null = null;

        if (!activeCaseIdRef.current) {
          const created = await insertPortalCaseWithMessages(
            supabase,
            uid,
            text,
            reply,
            classified
          );
          err = created.error;
          if (!err && created.caseId) {
            activeCaseIdRef.current = created.caseId;
          }
        } else {
          const appended = await appendCaseMessages(
            supabase,
            activeCaseIdRef.current,
            text,
            reply,
            classified
          );
          err = appended.error;
        }

        if (err) {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: "assistant",
              text: `No pudimos guardar la petición en este momento (${err}). Podéis reintentar o escribirnos por correo.`,
            },
          ]);
          return;
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", text: reply },
      ]);
    } finally {
      setSending(false);
    }
  }, [draft, sending, persistEnabled, user]);

  return (
    <>
      <span className="relative inline-flex shrink-0">
        <span
          className="pointer-events-none motion-safe:animate-pulse absolute -inset-1 rounded-full bg-primary/35 blur-md motion-reduce:animate-none"
          aria-hidden
        />
        <span
          className="pointer-events-none motion-safe:animate-ping absolute inset-0 rounded-full bg-primary/25 motion-reduce:animate-none [animation-duration:2.8s]"
          aria-hidden
        />
        <Button
          type="button"
          variant="default"
          size="sm"
          className={cn(
            "relative h-9 gap-2 rounded-full px-3.5 font-semibold shadow-lg shadow-primary/40",
            "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
            "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50 active:scale-[0.98]",
            "motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
          )}
          onClick={() => setOpen(true)}
          aria-label="Abrir chat para solicitar una nueva implementación"
        >
          <MessageSquarePlus
            className="size-4 shrink-0 sm:size-[1.125rem]"
            aria-hidden
          />
          <span className="max-sm:sr-only">Nueva implementación</span>
        </Button>
      </span>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton
          className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <SheetHeader className="shrink-0 space-y-1 border-b px-6 pt-6 pb-4">
            <SheetTitle className="text-base">
              Nueva implementación
            </SheetTitle>
            <SheetDescription>
              Chat con el equipo para pedir alcance, integraciones o
              ampliaciones.
            </SheetDescription>
          </SheetHeader>

          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <ul className="flex flex-col gap-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[min(100%,20rem)] rounded-2xl px-3 py-2 text-xs leading-relaxed break-words",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                </li>
              ))}
            </ul>
            <div ref={endRef} className="h-px shrink-0" aria-hidden />
          </div>

          <div className="shrink-0 border-t bg-background p-4">
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={2}
                placeholder="Escribid vuestra petición… (Enter envía, Mayús+Enter salto)"
                className={cn(
                  "min-h-[2.75rem] w-full min-w-0 flex-1 resize-none rounded-md border border-input bg-input/20 px-2 py-2 text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
                  "disabled:pointer-events-none disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
                )}
                aria-label="Mensaje para solicitar implementación"
                disabled={sending}
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0 self-end"
                onClick={() => void send()}
                disabled={!draft.trim() || sending}
                aria-label="Enviar mensaje"
              >
                <Send className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
