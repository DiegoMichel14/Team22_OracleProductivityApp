import React, { useEffect } from 'react';
import API_ESTADO from '../API_ESTADO';

function TestEstados() {
  useEffect(() => {
    fetch(API_ESTADO)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los estados');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de ESTADO:", data);
      })
      .catch(error => {
        console.error("Error en la petición de estados:", error);
      });
  }, []);

  return <div></div>;
}

export default TestEstados;