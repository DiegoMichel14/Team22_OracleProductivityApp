import React, { useState } from 'react';
import './ml-calendar.css'; // Asegúrate de que la ruta sea correcta

function Calendar() {
  // Estado inicial: 1 de enero de 2025
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));

  // Array con nombres de los meses
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Funciones para cambiar de mes
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
    // Ajuste: si es domingo, lo tratamos como día 7 para que la semana inicie en lunes
    startDay = startDay === 0 ? 7 : startDay;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const calendar = [];
    let week = [];
    let dayCounter = 1;
    let nextMonthDayCounter = 1;

    // 42 celdas (6 semanas x 7 días)
    for (let i = 0; i < 42; i++) {
      let cell = {};
      if (i < (startDay - 1)) {
        // Días del mes anterior: se corrige la fórmula sumando +1
        cell.day = prevMonthLastDate - (startDay - 1) + i + 1;
        cell.currentMonth = false;
        cell.date = new Date(year, month - 1, cell.day);
      } else if (i >= (startDay - 1) && dayCounter <= daysInMonth) {
        // Días del mes actual
        cell.day = dayCounter;
        cell.currentMonth = true;
        cell.date = new Date(year, month, dayCounter);
        dayCounter++;
      } else {
        // Días del siguiente mes
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

  return (
    <div className="ml-calendar">
      <section className="calendar-left">
        <div className="sidebar">
          <p className="subheading">Today</p>
          <h1>
            Tuesday, <br />January 1st
          </h1>
          <h3 className="primary-color">4 Items</h3>
          <ul className="calendar-events">
            <li>
              <p>
                <strong>8:00 AM</strong>
                <br />
                Team Meeting
              </p>
            </li>
            <li>
              <p>
                <strong>10:00 AM</strong>
                <br />
                Call Jane
              </p>
            </li>
            <li>
              <p>
                <strong>12:00 PM</strong>
                <br />
                Lunch with John
              </p>
            </li>
            <li>
              <p>
                <strong>7:00 PM</strong>
                <br />
                Dinner with Jane
              </p>
            </li>
          </ul>
          <p>
            <a href="#" className="calendar-btn">
              <i className="fas fa-plus"></i> Add new item
            </a>
          </p>
        </div>
      </section>
      <section className="calendar-right">
        <div className="calendar">
          {/* Encabezado dinámico */}
          <section className="calendar-header">
            <h2>
              <strong>{monthNames[currentDate.getMonth()]}</strong> {currentDate.getFullYear()}
            </h2>
            <div className="calendar-nav">
              <a href="#" onClick={handlePrevMonth}>
                <i className="fas fa-arrow-left"></i>
              </a>
              <a href="#" onClick={handleToday}>Today</a>
              <a href="#" onClick={handleNextMonth}>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </section>
          {/* Fila de encabezado con los nombres de los días */}
          <section className="calendar-row">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName, index) => (
              <div key={index} className="calendar-day day-name">
                {dayName}
              </div>
            ))}
          </section>
          {/* Renderizado dinámico de las semanas y días */}
          {weeks.map((week, index) => (
            <section key={index} className="calendar-row">
              {week.map((cell, idx) => (
                <div
                  key={idx}
                  className={`calendar-day ${cell.currentMonth ? "" : "inactive"}`}
                >
                  <span className="calendar-date">{cell.day}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </section>
      <div className="clear"></div>
    </div>
  );
}

export default Calendar;