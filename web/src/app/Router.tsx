import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import ServicesPage from '../pages/ServicesPage';
import AreasPage from '../pages/AreasPage';
import AreaCreatePage from '../pages/AreaCreatePage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/areas" element={<AreasPage />} />
      <Route path="/areas/create" element={<AreaCreatePage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
