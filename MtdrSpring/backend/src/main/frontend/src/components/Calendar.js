import React, { useState, useEffect } from 'react';
import './ml-calendar.css'; 
import API_TAREA from '../API_TAREA';
import API_ESTADO from '../API_ESTADO';
import API_PRIORIDAD from '../API_PRIORIDAD';
import API_DEVELOPER from '../API_DEVELOPER';
// Import Material-UI icons as a safer alternative
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskIcon from '@mui/icons-material/Task';
import FlagIcon from '@mui/icons-material/Flag';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

function Calendar() {
  // Change to use current date instead of fixed 2025 date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tareas, setTareas] = useState([]);
  const [tareaDevelopers, setTareaDevelopers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Funciones para cambiar de mes (prev, next, today)
  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentDate(prevDate => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      let newMonth = month - 1;
      let newYear = year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = year - 1;
      }
      return new Date(newYear, newMonth, 1);
    });
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentDate(prevDate => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = year + 1;
      }
      return new Date(newYear, newMonth, 1);
    });
  };

  const handleToday = (e) => {
    e.preventDefault();
    setCurrentDate(new Date());
  };

  // Función para generar la cuadrícula del calendario
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    let startDay = firstDayOfMonth.getDay(); // 0 (Dom) a 6 (Sáb)
    startDay = startDay === 0 ? 7 : startDay;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const calendar = [];
    let week = [];
    let dayCounter = 1;
    let nextMonthDayCounter = 1;

    for (let i = 0; i < 42; i++) {
      let cell = {};
      if (i < (startDay - 1)) {
        cell.day = prevMonthLastDate - (startDay - 1) + i + 1;
        cell.currentMonth = false;
        cell.date = new Date(year, month - 1, cell.day);
      } else if (i >= (startDay - 1) && dayCounter <= daysInMonth) {
        cell.day = dayCounter;
        cell.currentMonth = true;
        cell.date = new Date(year, month, dayCounter);
        dayCounter++;
      } else {
        cell.day = nextMonthDayCounter;
        cell.currentMonth = false;
        cell.date = new Date(year, month + 1, nextMonthDayCounter);
        nextMonthDayCounter++;
      }
      week.push(cell);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    return calendar;
  };

  const weeks = generateCalendar(currentDate);

  // useEffect para obtener las tareas, estados y prioridades
  useEffect(() => {
    Promise.all([
      fetch(API_TAREA).then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las tareas');
        }
        return response.json();
      }),
      fetch(API_ESTADO).then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los estados');
        }
        return response.json();
      }),
      fetch(API_PRIORIDAD).then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las prioridades');
        }
        return response.json();
      }),
      fetch('/tarea-developers').then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las relaciones tarea-developer');
        }
        return response.json();
      }),
      fetch(API_DEVELOPER).then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los developers');
        }
        return response.json();
      })
    ])
    .then(([tareasData, estadosData, prioridadesData, tareaDevelopersData, developersData]) => {
      // Store relation data
      setTareaDevelopers(tareaDevelopersData);
      setDevelopers(developersData);
      
      // Create maps by task ID
      const estadoMap = {};
      estadosData.forEach(estado => {
        estadoMap[estado.id] = estado.estado;
      });
      
      const prioridadMap = {};
      prioridadesData.forEach(prioridad => {
        prioridadMap[prioridad.id] = prioridad.prioridad;
      });
      
      // Create developer map for tasks
      const developerMap = {};
      tareaDevelopersData.forEach(relation => {
        if (relation.tarea && relation.developer) {
          developerMap[relation.tarea.idTarea] = relation.developer;
        }
      });
      
      // Combine information: add status, priority, and developer to each task
      const tareasCombinadas = tareasData.map(tarea => {
        const developer = developerMap[tarea.idTarea];
        return {
          ...tarea,
          estado: estadoMap[tarea.idTarea] || "Pendiente",
          prioridad: prioridadMap[tarea.idTarea] || "Media",
          developer: developer || null
        };
      });
      
      // Filter tasks that are not completed
      const pendientes = tareasCombinadas.filter(tarea => tarea.estado !== "Completada");
      setTareas(pendientes);
    })
    .catch(error => {
      console.error("Error en la petición:", error);
    });
  }, []);

  // Function to get developer name
  const getDeveloperName = (developer) => {
    if (!developer) return "Sin asignar";
    return developer.nombre || `Developer ${developer.idDeveloper}`;
  };

  // Handle clicking outside to close tooltips
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeTooltip && !event.target.closest('.due-marker')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTooltip]);

  // Function to handle marker clicks
  const handleMarkerClick = (taskId, event) => {
    event.stopPropagation();
    if (activeTooltip === taskId) {
      setActiveTooltip(null); // Close if already open
    } else {
      setActiveTooltip(taskId); // Open this tooltip
    }
  };

  return (
    <div className="ml-calendar">
      <section className="calendar-left">
        <div className="sidebar">
          <h2><TaskIcon className="calendar-icon" /> Tareas Pendientes</h2>
          <div className="tareas-container">
            {tareas.length > 0 ? (
              <ul className="tareas-list">
                {tareas.map(tarea => (
                  <li key={tarea.idTarea}>
                    <strong>{tarea.nombreTarea}</strong>
                    <div><FlagIcon className="calendar-icon" /> Estado: {tarea.estado}</div>
                    <div><PriorityHighIcon className="calendar-icon" /> Prioridad: {tarea.prioridad}</div>
                    <div><PersonIcon className="calendar-icon" /> Asignado: {getDeveloperName(tarea.developer)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay tareas pendientes.</p>
            )}
          </div>
        </div>
      </section>

      <section className="calendar-right">
        <div className="calendar">
          <section className="calendar-header">
            <h2>
              <CalendarMonthIcon className="calendar-icon" /> <strong>{monthNames[currentDate.getMonth()]}</strong> {currentDate.getFullYear()}
            </h2>
            <div className="calendar-nav">
              <a aria-label="Previous Month" href="#" onClick={handlePrevMonth}>
                <i className="fas fa-arrow-left"></i>
                <ArrowBackIcon />
              </a>
              <a href="#" onClick={handleToday} className="today-button">
                <TodayIcon fontSize="small" /> Today
              </a>
              <a aria-label="Next Month" href="#" onClick={handleNextMonth}>
                <ArrowForwardIcon />
              </a>
            </div>
          </section>

          <section className="calendar-row">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName, index) => (
              <div key={index} className="calendar-day day-name">
                {dayName}
              </div>
            ))}
          </section>

          {weeks.map((week, index) => (
            <section key={index} className="calendar-row">
              {week.map((cell, idx) => {
                const cellDateStr = cell.date.toISOString().split('T')[0];
                const isToday = new Date().toDateString() === cell.date.toDateString();
                const dueTasks = tareas.filter(tarea => tarea.fechaFin === cellDateStr);

                let priorityClass = '';
                if (dueTasks.length > 0) {
                  const hasPriority = dueTasks.some(task => task.prioridad === "Alta");
                  priorityClass = hasPriority ? 'high-priority' : 'normal-priority';
                }

                // Generate unique ID for this cell's tasks
                const cellTasksId = `cell-${cellDateStr}`;

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${cell.currentMonth ? "" : "inactive"} ${isToday ? "today" : ""}`}
                    style={{ position: 'relative', overflow: 'visible' }}
                  >
                    <span className="calendar-date">{cell.day}</span>
                    {dueTasks.length > 0 && (
                      <div 
                        className={`due-marker ${priorityClass} ${activeTooltip === cellTasksId ? 'active' : ''}`}
                        onClick={(e) => handleMarkerClick(cellTasksId, e)}
                      >
                        <span className="task-count">{dueTasks.length}</span>
                        <div className={`tooltip-content ${activeTooltip === cellTasksId ? 'show' : ''}`}>
                          <div className="tooltip-header">
                            <AssignmentIcon fontSize="small" style={{verticalAlign: 'text-bottom', marginRight: '4px'}} /> 
                            Tareas: {dueTasks.length}
                          </div>
                          <div className="tooltip-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {dueTasks.map(t => (
                              <div key={t.idTarea} className="tooltip-item">
                                <span className={`priority-indicator ${t.prioridad ? t.prioridad.toLowerCase() : 'media'}`}></span>
                                <div>
                                  <div className="task-name">{t.nombreTarea}</div>
                                  <div className="task-assignee">
                                    <PersonIcon style={{fontSize: '0.7rem', marginRight: '2px'}} /> 
                                    {getDeveloperName(t.developer)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </section>
      <div className="clear"></div>
    </div>
  );
}

export default Calendar;