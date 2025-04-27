import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HBRHomePage } from '../pages/HBR';
import { BeforeUnload } from '../context/UnloadEventContext';
import { EditPage } from '../pages';

export const HBRRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to="/hbr/home/pendencias" />} />
      <Route path="/home/:tipo" element={<HBRHomePage />} />
      <Route path="/edit/:company/:barragem/:section" element={
        <BeforeUnload>
          <EditPage />
        </BeforeUnload>
      } />
    </Routes>
  );
};