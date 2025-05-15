/*import React, { useEffect, useRef } from 'react';

function ProductividadGrafico({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = 150; // Barras más anchas
    const separacion = 350; // Más separación
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
      ctx.fillText(`Horas estimadas: ${d[1]}`, xEstimadas + 20, alturaMaxima - d[1] - 20);
      ctx.fillText(`Horas Reales: ${d[2]}`, xReales + 20, alturaMaxima - d[2] - 20);
      ctx.fillText(`Costo total: $${Math.round(d[4])}`, xCostos + 20, alturaMaxima - (d[4] / 2) - 20);


      // Agregar porcentaje de productividad al lado
      ctx.fillStyle = "white";
      ctx.fillText(`Productividad: ${(d[5] * 100).toFixed(1)}%`, xReales + anchoBarra + 200, alturaMaxima - d[2] - 10);
      
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
*/

import React, { useEffect, useRef } from 'react';

function ProductividadGrafico({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!datos || datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = 30;
    const separacion = 20;
    const alturaMaxima = 300;
    const margenIzquierdo = 100;
    const margenSuperior = 60;

    // Calcular máximos para escalar las barras proporcionalmente
    const maxHoras = Math.max(...datos.flatMap(d => [d[1], d[2]])) || 1;
    const maxCostos = Math.max(...datos.map(d => d[4])) || 1;

    datos.forEach((d, i) => {
      const sprint = d[0];
      const horasEstimadas = d[1];
      const horasReales = d[2];
      const costo = d[4];

      const xGrupo = margenIzquierdo + i * (anchoBarra * 3 + separacion);
      
      // Alturas escaladas
      const hEstimadas = (horasEstimadas / maxHoras) * alturaMaxima;
      const hReales = (horasReales / maxHoras) * alturaMaxima;
      const hCostos = (costo / maxCostos) * alturaMaxima;

      const xEstimadas = xGrupo;
      const xReales = xGrupo + anchoBarra;
      const xCostos = xGrupo + anchoBarra * 2;

      // Dibujar barras
      ctx.fillStyle = "blue";
      ctx.fillRect(xEstimadas, margenSuperior + alturaMaxima - hEstimadas, anchoBarra, hEstimadas);

      ctx.fillStyle = "red";
      ctx.fillRect(xReales, margenSuperior + alturaMaxima - hReales, anchoBarra, hReales);

      ctx.fillStyle = "green";
      ctx.fillRect(xCostos, margenSuperior + alturaMaxima - hCostos, anchoBarra, hCostos);

      // Etiquetas encima de cada barra
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(`${horasEstimadas}h`, xEstimadas, margenSuperior + alturaMaxima - hEstimadas - 5);
      ctx.fillText(`${horasReales}h`, xReales, margenSuperior + alturaMaxima - hReales - 5);
      ctx.fillText(`$${Math.round(costo)}`, xCostos, margenSuperior + alturaMaxima - hCostos - 5);

      // Etiqueta del sprint debajo del grupo
      ctx.fillStyle = "white";
      ctx.fillText(sprint, xGrupo + 10, margenSuperior + alturaMaxima + 20);
    });

    // Leyenda
    const leyendaX = margenIzquierdo;
    const leyendaY = 10;

    const leyenda = [
      { color: "blue", label: "Horas Estimadas" },
      { color: "red", label: "Horas Reales" },
      { color: "green", label: "Costo Total (USD)" },
    ];

    leyenda.forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(leyendaX + i * 150, leyendaY, 15, 15);
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(item.label, leyendaX + i * 150 + 20, leyendaY + 12);
    });

  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <canvas ref={canvasRef} width={800} height={400} style={{ display: "block" }} />
    </div>
  );
}

export default ProductividadGrafico;
