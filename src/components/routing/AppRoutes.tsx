
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SuperAdminRoute from './SuperAdminRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Messages from '@/pages/Messages';
import Discovery from '@/pages/Discovery';
import UserProfile from '@/pages/UserProfile';
import ViewedMe from '@/pages/ViewedMe';
import LikedMe from '@/pages/LikedMe';
import MyProfile from '@/pages/MyProfile';
import ProfilePage from '@/pages/ProfilePage';
import Admin from '@/pages/Admin';
import SuperAdmin from '@/pages/SuperAdmin';
import NotFound from '@/pages/NotFound';
import SuperAdminLogin from '@/components/auth/SuperAdminLogin';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      
      <Route path="/admin-login" element={<SuperAdminLogin />} />
      
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Index />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/viewed-me" element={<ViewedMe />} />
        <Route path="/liked-me" element={<LikedMe />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/admin/*" element={<Admin />} />
      </Route>
      
      <Route element={<SuperAdminRoute />}>
        <Route path="/super-admin/*" element={<SuperAdmin />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
