import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import { DonatorFormPage  } from './pages/donatorForm';
import { CharityFormPage } from './pages/charityForm';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/donator" element={<Layout><DonatorFormPage /></Layout>} />
      <Route path="/charity" element={<Layout><CharityFormPage /></Layout>} />
    </Routes>
    
  );
}
