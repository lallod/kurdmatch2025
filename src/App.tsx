
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useSupabaseAuth } from "@/integrations/supabase/auth";
import { PostLoginWizard } from "@/components/auth/PostLoginWizard";
import { AppRoutes } from "@/components/app/AppRoutes";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
import { useWizardManager } from "@/hooks/useWizardManager";

const queryClient = new QueryClient();

function App() {
  const { user } = useSupabaseAuth();
  const {
    showWizard,
    isOAuthFlow,
    handleWizardComplete,
    loading
  } = useWizardManager();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* Show wizard only if user is authenticated, wizard should be shown, and not in OAuth flow */}
          {user && showWizard && !isOAuthFlow && (
            <PostLoginWizard onComplete={handleWizardComplete} />
          )}

          <AppRoutes showWizard={showWizard} isOAuthFlow={isOAuthFlow} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
