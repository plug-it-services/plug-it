import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import ServicesPage from '../pages/ServicesPage';
import PlugsPage from '../pages/PlugsPage';
import AreaCreatePage from '../pages/AreaCreatePage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import AreaUltraGenericCreatePage from '../pages/AreaUltraGenericCreatePage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/plugs" element={<PlugsPage />} />
      <Route path="/plugs/create" element={<AreaUltraGenericCreatePage />} />
      <Route path="*" element={<Navigate to={'/'} replace />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
