import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ExamplesPage, FlowPage, ForgotPassword, HomePage, Login, Register, ResetPassword } from '../pages';
import { LayersProvider } from '../context/LayersContext';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Navigate to="/app/examples" />} />
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
    <LayersProvider>
      <Routes>
        <Route path="/*" element={<Navigate to="/app/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </LayersProvider>
    // </UserProvider>
  );
}