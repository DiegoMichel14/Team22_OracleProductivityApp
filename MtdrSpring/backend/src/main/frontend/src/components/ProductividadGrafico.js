import React, { useEffect, useRef } from 'react';

function ProductividadGrafico({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = 80; // Barras más anchas
    const separacion = 200; // Más separación
    const alturaMaxima = 400; // Altura total de la gráfica

    datos.forEach((d, i) => {
      const xGrupo = i * (anchoBarra + separacion) + 300; // Mayor espacio inicial
      const xEstimadas = xGrupo;
      const xReales = xGrupo + anchoBarra + 30;
      const xCostos = xReales + anchoBarra + 30;

      // Dibujar barras
      ctx.fillStyle = "blue"; // Horas estimadas
      ctx.fillRect(xEstimadas, alturaMaxima - d[1], anchoBarra, d[1]);

      ctx.fillStyle = "red"; // Horas reales
      ctx.fillRect(xReales, alturaMaxima - d[2], anchoBarra, d[2]);

      ctx.fillStyle = "green"; // Costos en USD
      ctx.fillRect(xCostos, alturaMaxima - (d[4] / 2), anchoBarra, d[4] / 2);

      // Agregar etiquetas sobre las barras
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`Horas estimadas: ${d[1]}`, xEstimadas + 10, alturaMaxima - d[1] - 10);
      ctx.fillText(`Horas Reales: ${d[2]}`, xReales + 10, alturaMaxima - d[2] - 10);
      ctx.fillText(`Costo total: $${Math.round(d[4])}`, xCostos + 10, alturaMaxima - (d[4] / 2) - 10);

      // Agregar nombres de los sprints abajo
      ctx.fillStyle = "white";
      ctx.fillText(d[0], xGrupo, alturaMaxima + 30);
    });
  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", margin: "auto" }}>
      <canvas ref={canvasRef} width={1200} height={600} style={{ display: "block" }} />
    </div>
  );
}

export default ProductividadGrafico;
