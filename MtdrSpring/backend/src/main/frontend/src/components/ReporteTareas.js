import React, { useEffect, useState } from 'react';
import { API_TAREAS_COMPLETADAS } from '../API_Reportes';

function ReporteTareas() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    fetch(API_TAREAS_COMPLETADAS)
      .then(response => response.json())
      .then(data => setTareas(data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h2>Tareas Completadas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre Tarea</th>
            <th>Horas Estimadas</th>
            <th>Horas Reales</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea, index) => (
            <tr key={index}>
              <td>{tarea.nombre}</td>
              <td>{tarea.horasEstimadas}</td>
              <td>{tarea.horasReales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteTareas;
