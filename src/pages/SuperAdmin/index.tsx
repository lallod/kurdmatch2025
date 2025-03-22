
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminLayout from './SuperAdminLayout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import CategoriesPage from './pages/CategoriesPage';
import MessagesPage from './pages/MessagesPage';
import PhotosPage from './pages/PhotosPage';
import SettingsPage from './pages/SettingsPage';

const SuperAdmin = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
