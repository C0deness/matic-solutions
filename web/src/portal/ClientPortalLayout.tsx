import {
  LayoutDashboard,
  Layers,
  LineChart,
  LogOut,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ImplementationRequestChat } from "./ImplementationRequestChat";
import { usePortalAuth } from "./PortalAuthContext";

const navItems = [
  {
    to: "/portal",
    label: "Resumen",
    end: true,
    icon: LayoutDashboard,
  },
  {
    to: "/portal/implementaciones",
    label: "Implementaciones",
    end: false,
    icon: Layers,
  },
  {
    to: "/portal/comparativa",
    label: "Inversión y retorno",
    end: false,
    icon: LineChart,
  },
] as const;

function PortalSidebar() {
  const { pathname } = useLocation();
  const { signOut } = usePortalAuth();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <NavLink
          to="/portal"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1"
        >
          <span className="flex size-9 shrink-0 flex-none items-center justify-center">
            <img
              src="/favicon.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 min-h-9 min-w-9 max-w-none shrink-0 rounded-lg object-contain shadow-sm ring-1 ring-sidebar-border"
            />
          </span>
          <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              Matic AIgency
            </p>
            <p className="truncate text-[0.65rem] font-medium text-muted-foreground">
              Panel
            </p>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="pt-2">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.end
                  ? pathname === item.to
                  : pathname === item.to;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <NavLink to={item.to} end={item.end}>
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="default"
              type="button"
              className="text-muted-foreground group-data-[collapsible=icon]:justify-center"
              tooltip="Cerrar sesión"
              asChild={false}
              onClick={() => signOut()}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Cerrar sesión
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="mt-2 px-2 text-[0.65rem] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Datos demo. En producción conectamos a vuestras métricas acordadas.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function ClientPortalLayout() {
  const { user, isSupabaseMode } = usePortalAuth();

  return (
    <SidebarProvider defaultOpen>
      <PortalSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-3 md:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="flex min-w-0 flex-1 items-center gap-2 truncate text-xs text-muted-foreground sm:text-sm">
              <span className="hidden sm:inline">Panel cliente · </span>
              <span className="truncate text-foreground/80">{user?.email}</span>
              {!isSupabaseMode ? (
                <Badge variant="secondary" className="shrink-0 text-[0.65rem]">
                  Auth demo
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ImplementationRequestChat />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
