import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { BarragemConfig, BarragemPage } from '../pages';
import { useUserContext } from '../context';

export const BarragemRoutes: React.FC = () => {
  const user = useUserContext();
  const { barragem } = useParams<{ barragem: string; }>();
  return (
    <Routes>
      <Route path="/*" element={<Navigate to="/" />} />
      <Route path="/" element={<BarragemPage />} />
      <Route
        path="/config"
        element={
          (!user || (!("error" in user) && user.admin)) ?
            <BarragemConfig /> : <Navigate to={`/app/${barragem}`} />
        } />
    </Routes>
  );
};