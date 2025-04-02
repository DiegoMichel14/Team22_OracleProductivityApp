import React, { useEffect } from 'react';
import API_TAREA_DEVELOPER from '../API_TAREA_DEVELOPER';

function TestTareaDevelopers() {
  useEffect(() => {
    fetch(API_TAREA_DEVELOPER)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las asociaciones Tarea-Developer');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de TAREA_DEVELOPER:", data);
      })
      .catch(error => {
        console.error("Error en la petición de TAREA_DEVELOPER:", error);
      });
  }, []);

  return <div></div>;
}

export default TestTareaDevelopers;