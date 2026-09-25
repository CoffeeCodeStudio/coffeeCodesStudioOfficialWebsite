import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Integritetspolicy from "./pages/Integritetspolicy";
import Cookiepolicy from "./pages/Cookiepolicy";
import { CookieConsent } from "./components/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/en" element={<Index />} />
            <Route path="/integritetspolicy" element={<Integritetspolicy />} />
            <Route path="/cookiepolicy" element={<Cookiepolicy />} />
            <Route path="/en/integritetspolicy" element={<Integritetspolicy />} />
            <Route path="/en/cookiepolicy" element={<Cookiepolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
