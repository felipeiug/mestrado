import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ExamplesPage, ForgotPassword, HomePage, Login, Register, ResetPassword, UserData } from '../pages';
import { LayersProvider } from '../context/LayersContext';
import { ProjectPage, ProjectsPage } from '../pages/projects';
import { UserProvider } from '../context';

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

function LoggedApp() {
  return (
    <UserProvider>
      <LayersProvider>
        <Routes>
          <Route path="/*" element={<Navigate to="/app/projects" />} />
          <Route path="/user" element={<UserData />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </LayersProvider>
    </UserProvider>
  );
}