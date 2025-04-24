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
<<<<<<< HEAD
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import App from './App';
import VistaDeveloper from './components/VistaDeveloper';
import VistaManager from './components/VistaManager';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* Temporarily change the root path to go directly to App for testing */}
      <Route path="/" element={<App />} />
      <Route path="/App" element={<App />} />
      <Route path="/developer" element={<VistaDeveloper />} />
      <Route path="/manager" element={<VistaManager />} />
      {/* Keep this commented out until you're done testing */}
      {/* <Route path="/" element={<Login />} /> */}
    </Routes>
  </BrowserRouter>,
>>>>>>> c665cdb (Cambios con Las Vistas de Developer y Manager)
  document.getElementById('root')
);