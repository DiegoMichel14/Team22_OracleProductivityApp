import React, { useEffect } from 'react';
<<<<<<< HEAD
import API_TAREA from '../API_Tarea';
=======
import API_TAREA from '../API_TAREA';
>>>>>>> c665cdb (Cambios con Las Vistas de Developer y Manager)

function TestTareas() {
  useEffect(() => {
    fetch(API_TAREA)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las tareas');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de TAREA:", data);
      })
      .catch(error => {
        console.error("Error en la petición de tareas:", error);
      });
  }, []);

  return <div></div>;
}

export default TestTareas;