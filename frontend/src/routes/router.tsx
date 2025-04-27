import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app/*" element={<LoggedApp />} />
      </Routes>
    </BrowserRouter>
  );
};

function LoggedApp() {
  return (
    // <UserProvider>
    <Routes>
      {/* <Route path="/home/:id" element={<HomePage />} />
      <Route path="/hbr/*" element={<HBRApp />} />
      <Route path="/:barragem/*" element={<BarragemApp />} /> */}
    </Routes>
    // </UserProvider>
  );
}