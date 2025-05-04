import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ForgotPassword, Login, Register, ResetPassword } from '../pages';
import { HomePage } from '../pages/home';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Navigate to="/app/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/app/*" element={<LoggedApp />} />
      </Routes>
    </BrowserRouter>
  );
};

function LoggedApp() {
  return (
    // <UserProvider>
    <Routes>
      <Route path="/home" element={<HomePage />} />
    </Routes>
    // </UserProvider>
  );
}