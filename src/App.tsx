import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";  
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useSupabaseAuth as useAuth } from '@/integrations/supabase/auth';
import { AppRoutes } from "@/components/app/AppRoutes";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
import { ProfileCompletionGuard } from "@/components/app/ProfileCompletionGuard";

const queryClient = new QueryClient();

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ProfileCompletionGuard>
            <AppRoutes showWizard={false} isOAuthFlow={false} />
          </ProfileCompletionGuard>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;