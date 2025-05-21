import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from './Layout';
import '../styles/Dashboard.css';
import HorasPorSprintGrafico from './HorasPorSprintGrafico';

function VistaManager() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for managing API data
  const [teamWorkloadData, setTeamWorkloadData] = useState([]);
  const [taskCompletionData, setTaskCompletionData] = useState([]);
  const [loadingWorkload, setLoadingWorkload] = useState(true);
  const [loadingCompletion, setLoadingCompletion] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch developer and task data
  const fetchTeamWorkloadData = async () => {
    setLoadingWorkload(true);
    try {
      // Fetch all developers
      const devsResponse = await fetch('/developers');
      if (!devsResponse.ok) throw new Error('Failed to fetch developers');
      const developers = await devsResponse.json();
      
      // Fetch tarea-developer relationships to know which developer has which tasks
      const tdResponse = await fetch('/tarea-developers');
      if (!tdResponse.ok) throw new Error('Failed to fetch tarea-developers');
      const tareaDevelopers = await tdResponse.json();
      
      // Calculate how many tasks each developer has
      const workloadData = developers.map(dev => {
        const tasksCount = tareaDevelopers.filter(td => 
          td.developer && td.developer.idDeveloper === dev.idDeveloper
        ).length;
        
        return {
          id: dev.idDeveloper,
          name: dev.nombre || `Developer ${dev.idDeveloper}`,
          tasks: tasksCount
        };
      });
      
      setTeamWorkloadData(workloadData);
    } catch (err) {
      console.error("Error fetching team workload data:", err);
      setError("Error loading workload data. Please try again.");
    } finally {
      setLoadingWorkload(false);
    }
  };

  // Function to fetch task completion data
  const fetchTaskCompletionData = async () => {
    setLoadingCompletion(true);
    try {
      // Fetch all developers
      const devsResponse = await fetch('/developers');
      if (!devsResponse.ok) throw new Error('Failed to fetch developers');
      const developers = await devsResponse.json();
      
      // Fetch tarea-developer relationships
      const tdResponse = await fetch('/tarea-developers');
      if (!tdResponse.ok) throw new Error('Failed to fetch tarea-developers');
      const tareaDevelopers = await tdResponse.json();
      
      // Fetch estados to determine if tasks are ongoing or completed
      const estadosResponse = await fetch('/estados');
      if (!estadosResponse.ok) throw new Error('Failed to fetch estados');
      const estados = await estadosResponse.json();
      
      // Calculate ongoing and completed tasks for each developer
      const completionData = await Promise.all(developers.map(async (dev) => {
        // Get all tasks for this developer
        const devTasks = tareaDevelopers
          .filter(td => td.developer && td.developer.idDeveloper === dev.idDeveloper)
          .map(td => td.tarea.idTarea);
        
        // For each task, check its estado
        let ongoing = 0;
        let completed = 0;
        
        for (const taskId of devTasks) {
          const estado = estados.find(e => e.id === taskId);
          if (estado) {
            if (estado.estado === 'Completada') {
              completed++;
            } else {
              ongoing++;
            }
          }
        }
        
        return {
          id: dev.idDeveloper,
          name: dev.nombre || `Developer ${dev.idDeveloper}`,
          ongoing,
          completed
        };
      }));
      
      setTaskCompletionData(completionData);
    } catch (err) {
      console.error("Error fetching task completion data:", err);
      setError("Error loading task completion data. Please try again.");
    } finally {
      setLoadingCompletion(false);
    }
  };

  // Function to refresh all data
  const refreshData = () => {
    fetchTeamWorkloadData();
    fetchTaskCompletionData();
  };

  // Fetch data on component mount only
  useEffect(() => {
    fetchTeamWorkloadData();
    fetchTaskCompletionData();
    
    // Removed the interval setup and cleanup
  }, []);

  return (
    <Layout>
      {/* Breadcrumb navigation */}
      <Box sx={{ 
        backgroundColor: '#f0f0f0', 
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #ddd',
        width: '100%'
      }}>
        <Typography variant="caption" color="textSecondary">
          Management Reports / Reports
        </Typography>
      </Box>
      
      {/* Main content area */}
      <Box sx={{ 
        py: 3, 
        px: { xs: 2, sm: 3, md: 4 }, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ mb: isMobile ? 2 : 0 }}
          >
            Manager Reports
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={refreshData} title="Refresh Data">
              <RefreshIcon />
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Team Workload Section */}
        <Card sx={{ mb: 4, width: '100%', boxShadow: 2, maxWidth: '800px', mx: 'auto' }}>
          <CardContent sx={{ width: '100%', padding: 3 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>Team Workload</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'hidden' }}>
              {loadingWorkload ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : teamWorkloadData.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No developer data available</Typography>
                </Box>
              ) : (
                <Table size={isMobile ? "small" : "medium"} sx={{ width: '100%', tableLayout: 'fixed', minWidth: '300px' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '70%', pl: 3 }}>Developer Name</TableCell>
                      <TableCell align="right" sx={{ width: '30%', pr: 5 }}>Tasks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamWorkloadData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ pl: 3 }}>{row.name}</TableCell>
                        <TableCell align="right" sx={{ pr: 5 }}>{row.tasks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </CardContent>
        </Card>

        {/* Task Completion Section */}
        <Card sx={{ width: '100%', boxShadow: 2, mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent sx={{ width: '100%', padding: 3 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>Task Completion</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'hidden' }}>
              {loadingCompletion ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : taskCompletionData.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No task completion data available</Typography>
                </Box>
              ) : (
                <Table size={isMobile ? "small" : "medium"} sx={{ width: '100%', tableLayout: 'fixed', minWidth: '300px' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '60%', pl: 3 }}>Developer Name</TableCell>
                      <TableCell align="right" sx={{ width: '20%' }}>Ongoing</TableCell>
                      <TableCell align="right" sx={{ width: '20%', pr: 5 }}>Completed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taskCompletionData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ pl: 3 }}>{row.name}</TableCell>
                        <TableCell align="right">{row.ongoing}</TableCell>
                        <TableCell align="right" sx={{ pr: 5 }}>{row.completed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </CardContent>
        </Card>

        {/* New Section: Horas Por Sprint Grafico */}
        <Card sx={{ width: '100%', boxShadow: 2, mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <CardContent sx={{ width: '100%', padding: 3 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>Horas Por Sprint</Typography>
            <HorasPorSprintGrafico />
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 'auto', mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')} 
            sx={{ 
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            VOLVER A LA PÁGINA PRINCIPAL
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

export default VistaManager;
