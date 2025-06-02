import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button,
  Card, 
  CardContent, 
  CircularProgress,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Import graph components
import ProductividadGrafico from './ProductividadGrafico';
import GraficoPastel from './GraficoPastel';
import HorasPorSprintGrafico from './HorasPorSprintGrafico';
import HorasPorDeveloperGrafico from './HorasPorDeveloperGrafico';

// Import API endpoints
import { API_KPI_EQUIPO, API_TAREAS_POR_DESARROLLADOR, API_TAREAS_COMPLETADAS } from '../API_Reportes';
import API_LIST from '../API';


function ReportePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [datosBarras, setDatosBarras] = useState({});
  const [datosPastel, setDatosPastel] = useState({});
  const [datosHorasSprint, setDatosHorasSprint] = useState([]);
  const [datosHorasDeveloper, setDatosHorasDeveloper] = useState([]);
  const [sprintSeleccionado, setSprintSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [resumen, setResumen] = useState({
    totalTareas: 0,
    tareasCompletadas: 0,
    porcentajeCompletadas: 0,
    horasTotales: 0,
    sprintsCompletados: 0
  });


  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Load data
 useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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

      // 4) Datos para resumen
        const resTareasCompletadas = await fetch(API_TAREAS_COMPLETADAS);
        const tareasCompletadas = await resTareasCompletadas.json();

        const total = tareasCompletadas.length;
        const horasTotales = tareasCompletadas.reduce((acc, tarea) => acc + (parseFloat(tarea[2]) || 0), 0);
        const sprints = new Set(tareasCompletadas.map(t => t[3])); // Asumiendo que el sprint está en la posición 3

        setResumen({
          totalTareas: total,
          tareasCompletadas: total, // si solo llegan las completadas
          porcentajeCompletadas: 100, // si son todas completadas
          horasTotales: horasTotales,
          sprintsCompletados: 4
        });

    };


    fetchData();
  }, []);


  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8, backgroundColor: '#FFFFFF'}}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        mb: 4 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <AssessmentIcon sx={{ mr: 1, verticalAlign: 'bottom', fontSize: 30 }} />
          Project Analytics Dashboard
        </Typography>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          VOLVER A LA PÁGINA PRINCIPAL
        </Button>
      </Box>
      
      {/* Tab navigation */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant={isMedium ? "scrollable" : "fullWidth"}
        scrollButtons={isMedium ? "auto" : false}
        sx={{ 
          mb: 4,
          '& .MuiTab-root': {
            minHeight: '72px',
          }
        }}
      >
        <Tab 
          icon={<BarChartIcon />} 
          label="Productivity" 
          iconPosition="start"
        />
        <Tab 
          icon={<PieChartIcon />} 
          label="Task Distribution" 
          iconPosition="start"
        />
        <Tab 
          icon={<TimelineIcon />} 
          label="Sprint Hours" 
          iconPosition="start"
        />
        <Tab 
          icon={<BarChartIcon />} 
          label="Developer Hours" 
          iconPosition="start"
        />
      </Tabs>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'error.lighter',
          borderRadius: 2
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          {/* Tab content */}
          {/* Tab 1: Team Productivity */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>Team Productivity by Sprint</Typography>
              
              {/* Sprint selector en Productividad */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                 {Object.keys(datosBarras)
                   .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                   .map(sprint => (
                     <Button
                       key={sprint}
                       variant={sprint === sprintSeleccionado ? "contained" : "outlined"}
                       color="primary"
                       onClick={() => setSprintSeleccionado(sprint)}
                       sx={{ minWidth: '120px' }}
                     >
                       {sprint}
                     </Button>
                 ))}
               </Box>

              
              {sprintSeleccionado && datosBarras[sprintSeleccionado] && (
                <Card sx={{ mb: 4, overflow: 'hidden' }}>
                  <CardContent>
                    <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
          
          {/* Tab 2: Task Distribution */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>Task Distribution by Developer</Typography>
              
              {/* Sprint selector en Distribución de Tareas */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {Object.keys(datosPastel)
                  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                  .map(sprint => (
                    <Button
                      key={sprint}
                      variant={sprint === sprintSeleccionado ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setSprintSeleccionado(sprint)}
                      sx={{ minWidth: '120px' }}
                    >
                      {sprint}
                    </Button>
                ))}
              </Box>


              {/* Graph */}
              {sprintSeleccionado && datosPastel[sprintSeleccionado] && (
                <Card sx={{ mb: 4, overflow: 'hidden' }}>
                  <CardContent>
                    <GraficoPastel datos={datosPastel[sprintSeleccionado]} />
                  </CardContent>
                </Card>
              )}
            </Box>
          )}


          {/* Tab 3: Hours by Sprint */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>Hours Worked by Sprint</Typography>
              <Card sx={{ mb: 4, overflow: 'hidden' }}>
                <CardContent>
                  <HorasPorSprintGrafico datos={datosHorasSprint} />
                </CardContent>
              </Card>
            </Box>
          )}
          
          {/* Tab 4: Hours by Developer */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>Hours Worked by Developer</Typography>
              <Card sx={{ mb: 4, overflow: 'hidden' }}>
                <CardContent>
                  <HorasPorDeveloperGrafico datos={datosHorasDeveloper} />
                </CardContent>
              </Card>
            </Box>
          )}
        </>
      )}
      
      {/* Summary section - always visible */}
      <Card sx={{ mt: 6, backgroundColor: theme.palette.background.paper }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Project Summary</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{resumen.sprintsCompletados}</Typography>
                <Typography variant="body2" color="textSecondary">Completed Sprints</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{resumen.totalTareas}</Typography>
                <Typography variant="body2" color="textSecondary">Total Tasks</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{resumen.porcentajeCompletadas}%</Typography>
                <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{resumen.horasTotales}</Typography>
                <Typography variant="body2" color="textSecondary">Development Hours</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ReportePage;