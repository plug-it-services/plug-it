import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import ServicesPage from '../pages/ServicesPage';
import AreasPage from '../pages/AreasPage';
import AreaCreatePage from '../pages/AreaCreatePage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/areas" element={<AreasPage />} />
      <Route path="/areas/create" element={<AreaCreatePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
