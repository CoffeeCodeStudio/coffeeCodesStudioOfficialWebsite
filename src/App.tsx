import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SetPassword from "./pages/SetPassword";
import Integritetspolicy from "./pages/Integritetspolicy";
import Cookiepolicy from "./pages/Cookiepolicy";
import Anvandardvillkor from "./pages/Anvandardvillkor";
import Projektfragor from "./pages/Projektfragor";
import { CookieConsent } from "./components/CookieConsent";

const queryClient = new QueryClient();

function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (accessToken && (type === 'invite' || type === 'recovery' || type === 'signup') && location.pathname !== '/set-password') {
      navigate('/set-password' + window.location.hash);
    }
  }, [location, navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthRedirectHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portal/login" element={<ClientLogin />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/integritetspolicy" element={<Integritetspolicy />} />
          <Route path="/cookiepolicy" element={<Cookiepolicy />} />
          <Route path="/anvandardvillkor" element={<Anvandardvillkor />} />
          <Route path="/projektfragor" element={<Projektfragor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;