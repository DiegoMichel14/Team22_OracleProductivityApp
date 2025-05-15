/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_LIST from './API';
import { API_KPI_EQUIPO, API_TAREAS_POR_DESARROLLADOR } from './API_Reportes';
import { 
  Alert, 
  Box,
  Button, 
  Card,
  CardContent,
  CircularProgress, 
  Grid,
  TableBody,
  Typography
} from '@mui/material';
import Moment from 'react-moment';

// Import components
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import ProductividadGrafico from './components/ProductividadGrafico';
import GraficoPastel from './components/GraficoPastel';

// Import styles
import './index.css';
import './styles/Dashboard.css';

function App() {
  const navigate = useNavigate();

  // Estados principales
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [datosBarras, setDatosBarras] = useState({});
  const [datosPastel, setDatosPastel] = useState({});
  const [sprintSeleccionado, setSprintSeleccionado] = useState(null);

  // Usuario simulado
  const user = { nombre: 'Test User' };

  useEffect(() => {
    // 1) Cargar todas las tareas
    setLoading(true);
    fetch(API_LIST)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

    // 2) Cargar KPI por equipo (gráfica de barras)
    fetch(API_KPI_EQUIPO)
      .then(res => res.json())
      .then(data => {
        const sprints = data.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push(d);
          return acc;
        }, {});
        setDatosBarras(sprints);
        setSprintSeleccionado(Object.keys(sprints)[0] || null);
      })
      .catch(console.error);

    // 3) Cargar tareas por desarrollador (gráfica de pastel)
    fetch(API_TAREAS_POR_DESARROLLADOR)
      .then(res => res.json())
      .then(data => {
        const sprints = data.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push([d[1], d[2]]);
          return acc;
        }, {});
        setDatosPastel(sprints);
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      {/* Main Content */}
      <Box sx={{ padding: '20px', maxWidth: '1200px', mx: 'auto', width: '100%' }}>
        {/* Dashboard Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              Welcome, {user.nombre}
            </Typography>
          )}
        </Box>

        {/* Main Quick Links Section */}
        <Card sx={{ mb: 4, p: 2, maxWidth: '800px', mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Welcome to the Oracle Productivity App Dashboard. Use the sidebar for navigation or these quick links.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Task Summary Cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Task Summary
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/developer')}
              sx={{ borderRadius: 1 }}
            >
              Developer View
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Ongoing
                  </Typography>
                  <Box className="task-card" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Task 1
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due date: May 15, 2025
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    Not Started
                  </Typography>
                  <Box className="task-card" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Task 2
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due date: May 20, 2025
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Completed
                  </Typography>
                  <Box className="task-card" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Task 3
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed on: May 10, 2025
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Sprint Reports Section */}
        <Card sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Sprint Reports
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {Object.keys(datosBarras).map(sprint => (
                <Button
                  key={sprint}
                  variant={sprint === sprintSeleccionado ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setSprintSeleccionado(sprint)}
                  sx={{ minWidth: '80px' }}
                >
                  {sprint}
                </Button>
              ))}
            </Box>
            
            {/* Sprint graphs */}
            {sprintSeleccionado &&
              datosBarras[sprintSeleccionado] &&
              datosPastel[sprintSeleccionado] && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Sprint Productivity Charts - {sprintSeleccionado}
                  </Typography>
                  
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Tasks by Developer - {sprintSeleccionado}
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <GraficoPastel datos={datosPastel[sprintSeleccionado]} />
                  </Box>
                </Box>
              )}
          </CardContent>
        </Card>
        
        {/* Team Management Section */}
        <Card sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Team Management
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/manager')}
                sx={{ borderRadius: 1 }}
              >
                Manager View
              </Button>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              <Typography variant="body1">
                Access the Manager View to see team workload, task distribution, and progress reports.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Calendar
            </Typography>
            <Box>
              <Calendar />
            </Box>
          </CardContent>
        </Card>

        {/* Completed Tasks Section */}
        <Card sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Completed Tasks
            </Typography>
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            )}
            
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#555', fontWeight: '500' }}>Task Name</th>
                    <th style={{ textAlign: 'right', padding: '10px', color: '#555', fontWeight: '500' }}>Completion Date</th>
                  </tr>
                </thead>
                <TableBody>
                  {items
                    .filter(item => item.estado && item.estado.estado === 'Completada')
                    .map(item => (
                      <tr key={item.idTarea} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '12px 10px', color: '#333' }}>{item.nombreTarea}</td>
                        <td style={{ padding: '12px 10px', color: '#666', textAlign: 'right' }}>
                          <Moment format="DD/MM/YYYY">{item.fechaRegistro}</Moment>
                        </td>
                      </tr>
                    ))}
                </TableBody>
              </table>
            )
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

export default App;
