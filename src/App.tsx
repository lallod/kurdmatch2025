import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/integrations/supabase/auth";
import { PostLoginWizard } from "@/components/auth/PostLoginWizard";
import { useState, useEffect } from "react";
import { isUserSuperAdmin } from "@/utils/auth/roleUtils";
import { checkProfileCompleteness } from "@/utils/auth/profileUtils";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Discovery from "./pages/Discovery";
import LikedMe from "./pages/LikedMe";
import ViewedMe from "./pages/ViewedMe";
import Messages from "./pages/Messages";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import ProfilePage from "./pages/ProfilePage";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import SuperAdminLogin from "./components/auth/SuperAdminLogin";
import AuthCallback from "./components/auth/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle register route protection
const RegisterProtection = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const isComplete = await checkProfileCompleteness(user.id);
        setHasCompleteProfile(isComplete);
      } catch (error) {
        console.error('Error checking profile completeness:', error);
        setHasCompleteProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated and has complete profile, redirect to discovery
  if (user && hasCompleteProfile) {
    return <Navigate to="/discovery" replace />;
  }

  // Allow access to registration for:
  // 1. Unauthenticated users (manual registration)
  // 2. Authenticated users with incomplete profiles (OAuth users)
  return <>{children}</>;
};

function App() {
  const { user, loading } = useSupabaseAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [isOAuthFlow, setIsOAuthFlow] = useState(false);

  useEffect(() => {
    // Check if this is an OAuth flow by looking at the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isOAuth = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token') || 
                    window.location.pathname === '/auth/callback';
    
    setIsOAuthFlow(isOAuth);
    
    // Only check for wizard if not in OAuth flow
    if (!isOAuth && user && !loading) {
      checkUserRoleAndShowWizard();
    }
  }, [user, loading]);

  const checkUserRoleAndShowWizard = async () => {
    if (!user) return;
    
    setCheckingRole(true);
    try {
      // Check if user is super-admin
      const isSuperAdmin = await isUserSuperAdmin(user.id);
      
      // Only show wizard for non-super-admin users
      if (!isSuperAdmin) {
        setShowWizard(true);
      } else {
        setShowWizard(false);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // Default to showing wizard if role check fails
      setShowWizard(true);
    } finally {
      setCheckingRole(false);
    }
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
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

          {/* Main app routes - only show if wizard is not active or during OAuth flow */}
          {(!user || !showWizard || isOAuthFlow) && (
            <Routes>
              <Route 
                path="/" 
                element={user ? <Navigate to="/discovery" replace /> : <Landing />} 
              />
              <Route 
                path="/auth" 
                element={user ? <Navigate to="/discovery" replace /> : <Auth />} 
              />
              <Route 
                path="/register" 
                element={
                  <RegisterProtection>
                    <Register />
                  </RegisterProtection>
                } 
              />
              
              {/* OAuth Callback Route */}
              <Route 
                path="/auth/callback" 
                element={<AuthCallback />} 
              />
              
              {/* Super Admin Login Route */}
              <Route 
                path="/admin-login" 
                element={<SuperAdminLogin />} 
              />
              
              {/* Protected routes */}
              <Route 
                path="/discovery" 
                element={user ? <Discovery /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/liked-me" 
                element={user ? <LikedMe /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/viewed-me" 
                element={user ? <ViewedMe /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/messages" 
                element={user ? <Messages /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/my-profile" 
                element={user ? <MyProfile /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/user/:id" 
                element={user ? <UserProfile /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/profile/:id" 
                element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/admin" 
                element={user ? <Admin /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/super-admin/*" 
                element={user ? <SuperAdmin /> : <Navigate to="/admin-login" replace />} 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
