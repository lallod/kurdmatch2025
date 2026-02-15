import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";  
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from '@/integrations/supabase/auth';
import { AppRoutes } from "@/components/app/AppRoutes";
import ErrorBoundary from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <LanguageProvider>
                <AppRoutes />
                <CookieConsentBanner />
              </LanguageProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
