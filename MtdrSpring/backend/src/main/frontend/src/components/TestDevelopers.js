// TestDevelopers.js
import React, { useEffect } from 'react';
import API_DEVELOPER from '../API_DEVELOPER';

function TestDevelopers() {
  useEffect(() => {
    fetch(API_DEVELOPER)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los developers');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de DEVELOPER:", data);
      })
      .catch(error => {
        console.error("Error en la petición de developers:", error);
      });
  }, []);

  return <div></div>;
}

export default TestDevelopers;