/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2021 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * @author  jean.de.lavarene@oracle.com
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import App from './App';
import VistaDeveloper from './components/VistaDeveloper';
import VistaManager from './components/VistaManager';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/developer" element={<VistaDeveloper />} />
      <Route path="/manager" element={<VistaManager />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);