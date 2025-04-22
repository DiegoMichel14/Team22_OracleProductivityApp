import React, { useState, useEffect } from 'react';
import './ml-calendar.css'; 
import API_TAREA from '../API_Tarea';
import API_ESTADO from '../API_ESTADO';
import API_PRIORIDAD from '../API_Prioridad';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [tareas, setTareas] = useState([]);

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
    setCurrentDate(new Date(2025, 0, 1));
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
      })
    ])
    .then(([tareasData, estadosData, prioridadesData]) => {
      // Crear mapas por ID de tarea
      const estadoMap = {};
      estadosData.forEach(estado => {
        // Suponemos que la propiedad "id" corresponde al id de la tarea
        estadoMap[estado.id] = estado.estado;
      });
      const prioridadMap = {};
      prioridadesData.forEach(prioridad => {
        prioridadMap[prioridad.id] = prioridad.prioridad;
      });
      // Combinar la información: agregar estado y prioridad a cada tarea
      const tareasCombinadas = tareasData.map(tarea => ({
        ...tarea,
        estado: estadoMap[tarea.idTarea],       // Nota: tarea.idTarea
        prioridad: prioridadMap[tarea.idTarea]
      }));
      // Filtrar tareas que no estén completadas
      const pendientes = tareasCombinadas.filter(tarea => tarea.estado !== "Completada");
      setTareas(pendientes);
    })
    .catch(error => {
      console.error("Error en la petición:", error);
    });
  }, []);

  return (
    <div className="ml-calendar">
      <section className="calendar-left">
        <div className="sidebar">
          <h2>Tareas Pendientes</h2>
          {tareas.length > 0 ? (
            <ul className="tareas-list">
              {tareas.map(tarea => (
                <li key={tarea.idTarea}>
                  <strong>{tarea.nombreTarea}</strong> - Estado: {tarea.estado} - Prioridad: {tarea.prioridad}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay tareas pendientes.</p>
          )}
        </div>
      </section>

      <section className="calendar-right">
        <div className="calendar">
          <section className="calendar-header">
            <h2>
              <strong>{monthNames[currentDate.getMonth()]}</strong> {currentDate.getFullYear()}
            </h2>
            <div className="calendar-nav">
              <a aria-label="Previous Month" href="#" onClick={handlePrevMonth}>
                <i className="fas fa-arrow-left"></i>
              </a>
              <a href="#" onClick={handleToday}>Today</a>
              <a href="#" onClick={handleNextMonth}>
                <i className="fas fa-arrow-right"></i>
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
                // Filtrar las tareas que vencen en esta fecha, comparando con fechaFin
                const dueTasks = tareas.filter(tarea => {
                  // Suponiendo que tarea.fechaFin se recibe como string en formato "YYYY-MM-DD"
                  return tarea.fechaFin === cellDateStr;
                });

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${cell.currentMonth ? "" : "inactive"}`}
                    style={{ position: 'relative' }}
                  >
                    <span className="calendar-date">{cell.day}</span>
                    {dueTasks.length > 0 && (
                      <div className="due-marker">
                        <div className="tooltip-content">
                          {dueTasks.map(t => (
                            <div key={t.idTarea} className="tooltip-item">
                              {t.nombreTarea}
                            </div>
                          ))}
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