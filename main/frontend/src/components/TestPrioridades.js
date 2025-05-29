import React, { useEffect } from 'react';
import API_PRIORIDAD from '../API_PRIORIDAD';

function TestPrioridades() {
  useEffect(() => {
    fetch(API_PRIORIDAD)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las prioridades');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de PRIORIDAD:", data);
      })
      .catch(error => {
        console.error("Error en la petición de prioridades:", error);
      });
  }, []);

  return <div></div>;
}

export default TestPrioridades;