import React, { useEffect } from 'react';
import API_SPRINT from '../API_SPRINT';

function TestSprints() {
  useEffect(() => { 
    fetch(API_SPRINT)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los sprints');
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos de SPRINT:", data);
      })
      .catch(error => {
        console.error("Error en la petición de sprints:", error);
      });
  }, []);

  return <div></div>;
}

export default TestSprints;