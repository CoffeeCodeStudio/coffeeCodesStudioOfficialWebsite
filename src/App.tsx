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
import FrisorGoteborg from "./pages/FrisorGoteborg";
import SmaforetagGoteborg from "./pages/SmaforetagGoteborg";
import WebbyraGoteborg from "./pages/WebbyraGoteborg";
import HemsidaFrisorGoteborg from "./pages/HemsidaFrisorGoteborg";
import HemsidaHantverkareGoteborg from "./pages/HemsidaHantverkareGoteborg";
import VadKostarEnHemsida from "./pages/VadKostarEnHemsida";
import OmMig from "./pages/OmMig";

import { CookieConsent } from "./components/CookieConsent";
import { CoffeeBeanCursor } from "./components/CoffeeBeanCursor";
import { LanguageProvider } from "./contexts/LanguageContext";

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
        <LanguageProvider>
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
            <Route path="/frisor-goteborg" element={<FrisorGoteborg />} />
            <Route path="/smaforetag-goteborg" element={<SmaforetagGoteborg />} />
            <Route path="/webbyra-goteborg" element={<WebbyraGoteborg />} />
            <Route path="/hemsida-frisor-goteborg" element={<HemsidaFrisorGoteborg />} />
            <Route path="/hemsida-hantverkare-goteborg" element={<HemsidaHantverkareGoteborg />} />
            <Route path="/vad-kostar-en-hemsida" element={<VadKostarEnHemsida />} />
            <Route path="/om-mig" element={<OmMig />} />
            {/* English /en/* mirrors of every public, indexable page */}
            <Route path="/en/om-mig" element={<OmMig />} />
            <Route path="/en" element={<Index />} />
            <Route path="/en/frisor-goteborg" element={<FrisorGoteborg />} />
            <Route path="/en/smaforetag-goteborg" element={<SmaforetagGoteborg />} />
            <Route path="/en/webbyra-goteborg" element={<WebbyraGoteborg />} />
            <Route path="/en/hemsida-frisor-goteborg" element={<HemsidaFrisorGoteborg />} />
            <Route path="/en/hemsida-hantverkare-goteborg" element={<HemsidaHantverkareGoteborg />} />
            <Route path="/en/vad-kostar-en-hemsida" element={<VadKostarEnHemsida />} />

            <Route path="/en/integritetspolicy" element={<Integritetspolicy />} />
            <Route path="/en/cookiepolicy" element={<Cookiepolicy />} />
            <Route path="/en/anvandardvillkor" element={<Anvandardvillkor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
          <CoffeeBeanCursor />
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;