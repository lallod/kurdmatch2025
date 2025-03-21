
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ViewedMe from "./pages/ViewedMe";
import LikedMe from "./pages/LikedMe";
import Messages from "./pages/Messages";
import MyProfile from "./pages/MyProfile";
import ProfilePage from "./pages/ProfilePage";
import Discovery from "./pages/Discovery";
import BottomNavigation from "./components/BottomNavigation";
import SuperAdmin from "./pages/SuperAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="w-full pb-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/super-admin/*" element={<SuperAdmin />} />
            <Route path="/viewed-me" element={<ViewedMe />} />
            <Route path="/liked-me" element={<LikedMe />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
