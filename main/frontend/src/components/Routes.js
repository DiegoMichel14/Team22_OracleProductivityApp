import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import AppPage from './AppPage';

const Routes = () => {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/App" element={<AppPage />} />

    </>
  );
};

export default Routes;
