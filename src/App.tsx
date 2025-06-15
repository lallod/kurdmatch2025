
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/integrations/supabase/auth";
import { PostLoginWizard } from "@/components/auth/PostLoginWizard";
import { useState, useEffect } from "react";
import { isUserSuperAdmin } from "@/utils/auth/roleUtils";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useSupabaseAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    const checkUserRoleAndShowWizard = async () => {
      if (user && !loading) {
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
      }
    };

    checkUserRoleAndShowWizard();
  }, [user, loading]);

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
          {/* Show wizard if user is authenticated and wizard should be shown */}
          {user && showWizard && (
            <PostLoginWizard onComplete={handleWizardComplete} />
          )}

          {/* Main app routes - only show if wizard is not active */}
          {(!user || !showWizard) && (
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
                element={user ? <Navigate to="/discovery" replace /> : <Register />} 
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
