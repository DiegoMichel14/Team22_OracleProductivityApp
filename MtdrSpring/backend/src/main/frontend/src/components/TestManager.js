import React, { useEffect } from 'react';
import API_MANAGER from '../API_MANAGER';

function TestManagers() {
  useEffect(() => {
    fetch(API_MANAGER)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los managers');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de MANAGER:", data);
      })
      .catch(error => {
        console.error("Error en la petición de managers:", error);
      });
  }, []);

  return <div></div>;
}

export default TestManagers;