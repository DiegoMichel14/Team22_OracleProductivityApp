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
  Alert,
  Tabs,
  Tab,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';

function VistaDeveloper() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for managing API data
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Fetch all developers for the dropdown selector
  const fetchDevelopers = async () => {
    try {
      const response = await fetch('/developers');
      if (!response.ok) throw new Error('Failed to fetch developers');
      const data = await response.json();
      setDevelopers(data);
      
      // Select the first developer by default if none is selected
      if (data.length > 0 && !selectedDeveloper) {
        setSelectedDeveloper(data[0].idDeveloper);
      }
    } catch (err) {
      console.error("Error fetching developers:", err);
      setError("Error loading developers. Please try again.");
    }
  };

  // Fetch tasks for the selected developer
  const fetchTasks = async () => {
    if (!selectedDeveloper) return;
    
    setLoading(true);
    try {
      // Get tarea-developer relationships
      const tdResponse = await fetch('/tarea-developers');
      if (!tdResponse.ok) throw new Error('Failed to fetch tarea-developers');
      const tareaDevelopers = await tdResponse.json();
      
      // Get tasks for the selected developer
      const devTasks = tareaDevelopers
        .filter(td => td.developer && td.developer.idDeveloper === selectedDeveloper)
        .map(td => td.tarea);
      
      // Get estados for those tasks
      const estadosResponse = await fetch('/estados');
      if (!estadosResponse.ok) throw new Error('Failed to fetch estados');
      const estados = await estadosResponse.json();
      
      // Get prioridades for those tasks
      const prioridadesResponse = await fetch('/prioridades');
      if (!prioridadesResponse.ok) throw new Error('Failed to fetch prioridades');
      const prioridades = await prioridadesResponse.json();
      
      // Combine all data for complete task information
      const taskData = devTasks.map(task => {
        const estado = estados.find(e => e.id === task.idTarea);
        const prioridad = prioridades.find(p => p.id === task.idTarea);
        
        return {
          ...task,
          estado: estado ? estado.estado : 'Unknown',
          prioridad: prioridad ? prioridad.prioridad : 'Normal'
        };
      });
      
      setTasks(taskData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error loading task data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the data
  const refreshData = () => {
    fetchDevelopers();
    fetchTasks();
  };

  // Handle developer selection change
  const handleDeveloperChange = (event) => {
    setSelectedDeveloper(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Initial data loading
  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Fetch tasks whenever the selected developer changes
  useEffect(() => {
    if (selectedDeveloper) {
      fetchTasks();
    }
  }, [selectedDeveloper]);

  // Get the current developer name
  const getCurrentDeveloperName = () => {
    if (!selectedDeveloper || developers.length === 0) return "Developer";
    const dev = developers.find(d => d.idDeveloper === selectedDeveloper);
    return dev ? dev.nombre || `Developer ${dev.idDeveloper}` : `Developer ${selectedDeveloper}`;
  };

  // Filter tasks based on tab selection
  const getFilteredTasks = () => {
    switch (tabValue) {
      case 0: // All tasks
        return tasks;
      case 1: // Pending tasks
        return tasks.filter(task => task.estado === 'Pendiente');
      case 2: // In progress tasks
        return tasks.filter(task => task.estado === 'En progreso');
      case 3: // Completed tasks
        return tasks.filter(task => task.estado === 'Completada');
      default:
        return tasks;
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pendiente':
        return 'warning';
      case 'En progreso':
        return 'primary';
      case 'Completada':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get priority chip color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Alta':
        return 'error';
      case 'Media':
        return 'warning';
      case 'Baja':
        return 'success';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Top navigation */}
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
          Developer Dashboard / Tasks
        </Typography>
      </Box>
      
      {/* Main content area */}
      <Box sx={{ 
        flex: 1, 
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
          mb: 3,
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ mb: isMobile ? 2 : 0 }}
          >
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {getCurrentDeveloperName()}'s Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={refreshData} title="Refresh Data">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Developer selector - only for testing */}
        <Card sx={{ mb: 3, width: '100%', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Developer Selection (For Testing)
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="developer-select-label">Select Developer</InputLabel>
              <Select
                labelId="developer-select-label"
                id="developer-select"
                value={selectedDeveloper || ''}
                label="Select Developer"
                onChange={handleDeveloperChange}
                disabled={loading || developers.length === 0}
              >
                {developers.map((dev) => (
                  <MenuItem key={dev.idDeveloper} value={dev.idDeveloper}>
                    {dev.nombre || `Developer ${dev.idDeveloper}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Developer Stats */}
        <Card sx={{ mb: 3, width: '100%', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Task Stats
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary">
                    {tasks.filter(t => t.estado === 'Pendiente').length}
                  </Typography>
                  <Typography variant="body1">Pending Tasks</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="info.main">
                    {tasks.filter(t => t.estado === 'En progreso').length}
                  </Typography>
                  <Typography variant="body1">In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="success.main">
                    {tasks.filter(t => t.estado === 'Completada').length}
                  </Typography>
                  <Typography variant="body1">Completed</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tasks Section with Tabs */}
        <Card sx={{ width: '100%', boxShadow: 2, mb: 4 }}>
          <CardContent sx={{ padding: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="All Tasks" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="Pending" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="In Progress" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="Completed" icon={<AssignmentTurnedInIcon />} iconPosition="start" />
            </Tabs>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                {tabValue === 0 ? "All Tasks" : 
                 tabValue === 1 ? "Pending Tasks" : 
                 tabValue === 2 ? "In Progress Tasks" : "Completed Tasks"}
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : getFilteredTasks().length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No tasks available</Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ width: '100%' }}>
                  <Table size={isMobile ? "small" : "medium"} sx={{ width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Estimated Hours</TableCell>
                        <TableCell>Actual Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredTasks().map((task) => (
                        <TableRow key={task.idTarea}>
                          <TableCell>{task.nombreTarea}</TableCell>
                          <TableCell>
                            <Chip 
                              label={task.estado} 
                              color={getStatusColor(task.estado)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={task.prioridad} 
                              color={getPriorityColor(task.prioridad)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                              {formatDate(task.fechaFin)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimerIcon fontSize="small" sx={{ mr: 1 }} />
                              {task.horasEstimadas || 'N/A'}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimerIcon fontSize="small" sx={{ mr: 1 }} />
                              {task.horasReales || 'N/A'}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 'auto', mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')} 
            sx={{ 
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            VOLVER A LA PÁGINA PRINCIPAL
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default VistaDeveloper;
