import React, { useEffect } from 'react';
import API_EQUIPO from '../API_EQUIPO';

function TestEquipos() {
  useEffect(() => {
    fetch(API_EQUIPO)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los equipos');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de EQUIPO:", data);
      })
      .catch(error => {
        console.error("Error en la petición de equipos:", error);
      });
  }, []);

  return <div></div>;
}

export default TestEquipos;