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
import { parseISO, isWithinInterval } from 'date-fns';

function App() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [datosBarras, setDatosBarras] = useState({});
  const [datosPastel, setDatosPastel] = useState({});
  const [sprintSeleccionado, setSprintSeleccionado] = useState(null);
  const [user, setUser] = useState(null);

  const sprints = [
    { name: 'Sprint 1', start: new Date('2025-03-24'), end: new Date('2025-04-04') },
    { name: 'Sprint 2', start: new Date('2025-04-05'), end: new Date('2025-04-24') },
    { name: 'Sprint 3', start: new Date('2025-04-25'), end: new Date('2025-05-16') },
    { name: 'Sprint 4', start: new Date('2025-05-17'), end: new Date('2025-06-01') },
    { name: 'Sprint 5', start: new Date('2025-06-02'), end: new Date('2025-06-13') },
  ];

  useEffect(() => { 
    const storedUser = JSON.parse(localStorage.getItem('usuario')); 
    if (!storedUser) { 
      navigate('/'); 
    } else { 
      setUser(storedUser); 
    } 
  }, [navigate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Función para determinar a qué sprint pertenece una fecha
        const getSprintName = (fecha) => {
          for (const sprint of sprints) {
            if (isWithinInterval(fecha, { start: sprint.start, end: sprint.end })) {
              return sprint.name;
            }
          }
          return 'Fuera de Sprint';
        };
        // 1) Tareas
        const resTareas = await fetch(API_LIST);
        const tareas = await resTareas.json();
        setItems(tareas);

        // 2) KPI por equipo
        const resKPI = await fetch(API_KPI_EQUIPO);
        const kpiData = await resKPI.json();
        const kpiSprints = kpiData.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push(d);
          return acc;
        }, {});
        setDatosBarras(kpiSprints);
        setSprintSeleccionado(Object.keys(kpiSprints)[0] || null);

        // 3) Tareas por desarrollador
        const resPastel = await fetch(API_TAREAS_POR_DESARROLLADOR);
        const pastelData = await resPastel.json();
        const pastelSprints = pastelData.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push([d[1], d[2]]);
          return acc;
        }, {});
        setDatosPastel(pastelSprints);

      } catch (err) {
        setError(err);
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

        {/* Task Summary Cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Task Summary
            </Typography>
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
                  
                  {/* Mostrar solo si el usuario es Diego */}
                  {user?.nombre === 'Diego' && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                      <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />
                    </Box>
                  )}
                  
                  <Typography variant="h6" gutterBottom>
                    Tasks by Developer - {sprintSeleccionado}
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <GraficoPastel datos={datosPastel[sprintSeleccionado]} usuario={user.nombre} />
                  </Box>
                </Box>
              )}
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
              Completed Tasks by Sprint
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

            {!isLoading && !error && (
              <>
                {sprints.map((sprint) => {
                  const tareasSprint = items
                    .filter(item =>
                      item.estado?.estado === 'Completada' &&
                      isWithinInterval(new Date(item.fechaRegistro), {
                        start: sprint.start,
                        end: sprint.end
                      })
                    );

                  return tareasSprint.length > 0 ? (
                    <Box key={sprint.name} sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        {sprint.name}
                      </Typography>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#555' }}>Task Name</th>
                            <th style={{ textAlign: 'right', padding: '10px', color: '#555' }}>Completion Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tareasSprint.map((item) => (
                            <tr key={item.idTarea} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '12px 10px', color: '#333' }}>{item.nombreTarea}</td>
                              <td style={{ padding: '12px 10px', color: '#666', textAlign: 'right' }}>
                                <Moment format="DD/MM/YYYY">{item.fechaRegistro}</Moment>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  ) : null;
                })}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

export default App;