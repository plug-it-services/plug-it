import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import ServicesPage from '../pages/ServicesPage';
import PlugsPage from '../pages/PlugsPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import PlugCreatePage from '../pages/PlugCreatePage';
import PlugEditPage from '../pages/PlugEditPage';
import { NavigablePage } from './NavigablePage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigablePage page={<HomePage />} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/services" element={<NavigablePage page={<ServicesPage />} />} />
      <Route path="/plugs" element={<NavigablePage page={<PlugsPage />} />} />
      <Route path="/plugs/create" element={<NavigablePage page={<PlugCreatePage />} />} />
      <Route path="/plugs/edit/:plugId" element={<NavigablePage page={<PlugEditPage />} />} />
      <Route path="*" element={<Navigate to={'/'} replace />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
