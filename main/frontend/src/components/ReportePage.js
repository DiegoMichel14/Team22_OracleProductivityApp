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
import { API_KPI_EQUIPO, API_TAREAS_POR_DESARROLLADOR } from '../API_Reportes';

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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Load data
  useEffect(() => {
    setLoading(true);
    const promises = [];

    // 1. Load KPI by team (bar chart)
    promises.push(
      fetch('/mockData.json')
        .then(res => res.json())
        .then(data => {
          // Check if API data exists, otherwise use mock
          if (data && data.horasSprint) {
            setDatosHorasSprint(data.horasSprint);
          }
          if (data && data.horasDeveloper) {
            setDatosHorasDeveloper(data.horasDeveloper);
          }

          // For demo purposes - static data for other charts
          setDatosBarras({
            'Sprint 1': [
              ['Sprint 1', 'Team A', 85],
              ['Sprint 1', 'Team B', 75],
              ['Sprint 1', 'Team C', 92],
            ],
            'Sprint 2': [
              ['Sprint 2', 'Team A', 80],
              ['Sprint 2', 'Team B', 85],
              ['Sprint 2', 'Team C', 78],
            ],
            'Sprint 3': [
              ['Sprint 3', 'Team A', 90],
              ['Sprint 3', 'Team B', 88],
              ['Sprint 3', 'Team C', 95],
            ]
          });
          
          setDatosPastel({
            'Sprint 1': [
              ['Juan', 5],
              ['Ana', 8],
              ['Diego', 4],
              ['Maria', 7]
            ],
            'Sprint 2': [
              ['Juan', 7],
              ['Ana', 6],
              ['Diego', 8],
              ['Maria', 5]
            ],
            'Sprint 3': [
              ['Juan', 6],
              ['Ana', 9],
              ['Diego', 7],
              ['Maria', 8]
            ]
          });
          
          setSprintSeleccionado('Sprint 1');
        })
        .catch(error => {
          console.error("Error loading data:", error);
          setError("Failed to load report data. Please try again later.");
        })
    );

    // Wait for all data loading to complete
    Promise.all(promises)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
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
          onClick={() => navigate('/')}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          Back to Home
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
              
              {/* Sprint selector */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {Object.keys(datosBarras).map(sprint => (
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
              
              {/* Sprint selector */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {Object.keys(datosPastel).map(sprint => (
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
                <Typography variant="h3" color="primary">5</Typography>
                <Typography variant="body2" color="textSecondary">Completed Sprints</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">42</Typography>
                <Typography variant="body2" color="textSecondary">Total Tasks</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">85%</Typography>
                <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">108</Typography>
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
