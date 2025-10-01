import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";  
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MockAuthProvider, useMockAuth } from '@/integrations/supabase/mockAuth';
import { AppRoutes } from "@/components/app/AppRoutes";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <MockAuthProvider>
            <AppRoutes showWizard={false} isOAuthFlow={false} />
          </MockAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;