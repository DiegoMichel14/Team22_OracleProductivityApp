import React, { useEffect, useRef } from 'react';

function ProductividadGrafico({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración de la gráfica
    const anchoBarra = 40;
    const separacion = 20;
    const alturaMaxima = 150;

    datos.forEach((d, i) => {
      const x = i * (anchoBarra + separacion) + 30; // Posición X
      const y = alturaMaxima - d[2]; // Ajuste de altura (horas trabajadas)
      ctx.fillStyle = "blue"; // Color de las barras
      ctx.fillRect(x, y, anchoBarra, d[2]); // Dibujo de la barra

      // Etiqueta con el nombre del sprint
      ctx.fillStyle = "black";
      ctx.fillText(d[0], x + 5, alturaMaxima + 15);
    });
  }, [datos]);

  return <canvas ref={canvasRef} width={400} height={200} />;
}

export default ProductividadGrafico;
