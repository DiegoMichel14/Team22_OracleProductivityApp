import React, { useEffect, useRef } from 'react';

function GraficoPastel({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalTareas = datos.reduce((acc, d) => acc + d[1], 0);
    let anguloInicio = 0;
    const colores = ["red", "blue", "green", "orange", "purple"];

    datos.forEach((d, i) => {
      const porcentaje = d[1] / totalTareas;
      const anguloFin = anguloInicio + porcentaje * Math.PI * 2;

      ctx.fillStyle = colores[i % colores.length];
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 100, anguloInicio, anguloFin);
      ctx.closePath();
      ctx.fill();

      // Dibujar cuadrado de color
      ctx.fillRect(240, 45 + i * 20, 15, 15); // Pequeño cuadrado junto al texto

      // Etiqueta del desarrollador
      ctx.fillStyle = "white";
      ctx.fillText(`${d[0]}: ${d[1]}`, 260, 50 + i * 20);

      anguloInicio = anguloFin;
    });
  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef} width={350} height={300} />
    </div>
  );
}

export default GraficoPastel;