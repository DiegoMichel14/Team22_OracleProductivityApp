import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import App from './App';
import VistaDeveloper from './components/VistaDeveloper';
import VistaManager from './components/VistaManager';
import ReportePage from './components/ReportePage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/developer" element={<VistaDeveloper />} />
      <Route path="/manager" element={<VistaManager />} />
      <Route path="/reports" element={<ReportePage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);