import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ClientPortalLayout } from "@/portal/ClientPortalLayout";
import { PortalAuthProvider } from "@/portal/PortalAuthContext";
import { OperatorCommandCenterPage } from "@/operator/OperatorCommandCenterPage";
import { RequireOperatorConsole } from "@/operator/RequireOperatorConsole";
import { PortalComparison } from "@/portal/PortalComparison";
import { PortalDashboard } from "@/portal/PortalDashboard";
import { PortalImplementations } from "@/portal/PortalImplementations";
import { PortalLogin } from "@/portal/PortalLogin";
import { PortalRegister } from "@/portal/PortalRegister";
import { RequirePortalAuth } from "@/portal/RequirePortalAuth";

import { LandingPage } from "./components/landing/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <PortalAuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/registro" element={<PortalRegister />} />
          <Route element={<RequirePortalAuth />}>
            <Route path="/portal" element={<ClientPortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route
                path="implementaciones"
                element={<PortalImplementations />}
              />
              <Route path="comparativa" element={<PortalComparison />} />
            </Route>
          </Route>
          <Route element={<RequireOperatorConsole />}>
            <Route
              path="/operator/centro-de-mando"
              element={<OperatorCommandCenterPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PortalAuthProvider>
    </BrowserRouter>
  );
}
