/*import React, { useEffect, useRef, useState } from "react";
import { API_HORAS_SPRINT } from "../API_Reportes";

function HorasPorSprintGrafico() {
  const canvasRef = useRef(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch(API_HORAS_SPRINT)
      .then(response => response.json())
      .then(data => setDatos(data))
      .catch(error => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (datos.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = 60;
    const separacion = 40;
    const alturaMaxima = 200;
    const margenIzquierdo = 80;

    const maxHoras = Math.max(...datos.map(d => d[1])) || 1;

    datos.forEach((d, i) => {
      const xBarra = margenIzquierdo + i * (anchoBarra + separacion);
      const alturaBarra = (d[1] / maxHoras) * alturaMaxima;

      ctx.fillStyle = "blue";
      ctx.fillRect(xBarra, alturaMaxima - alturaBarra, anchoBarra, alturaBarra);

      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`${d[1]}h`, xBarra + 10, alturaMaxima - alturaBarra - 10);
      ctx.fillText(d[0], xBarra, alturaMaxima + 30);
    });
  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", margin: "auto" }}>
      <canvas ref={canvasRef} width={1200} height={600} style={{ display: "block" }} />
    </div>
  );
}

export default HorasPorSprintGrafico;
*/

import React, { useEffect, useRef, useState } from "react";
import { API_HORAS_SPRINT } from "../API_Reportes";

function HorasPorSprintGrafico() {
  const canvasRef = useRef(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch(API_HORAS_SPRINT)
      .then(response => response.json())
      .then(data => setDatos(data))
      .catch(error => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const padding = 80;
    const axisYMax = 50;
    const numLines = 10;

    const barWidth = 50;
    const gap = 40;
    const maxBarHeight = chartHeight - padding * 2;
    const barSpacing = barWidth + gap;

    // Dibujar fondo blanco con bordes redondeados y sombra
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 10;
    ctx.fillRect(20, 20, chartWidth - 40, chartHeight - 40);
    ctx.shadowBlur = 0;

    // Título
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Horas Trabajadas por Sprint", chartWidth / 2, 60);

    // Líneas de guía
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= numLines; i++) {
      const y = padding + (i * maxBarHeight) / numLines;
      ctx.moveTo(padding, y);
      ctx.lineTo(chartWidth - padding, y);
      ctx.fillStyle = "#666";
      ctx.font = "14px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`${axisYMax - (i * axisYMax) / numLines}`, padding - 10, y + 5);
    }
    ctx.stroke();

    // Dibujar barras
    datos.forEach((d, i) => {
      const [label, value] = d;
      const x = padding + i * barSpacing + 40;
      const barHeight = (value / axisYMax) * maxBarHeight;
      const y = chartHeight - padding - barHeight;

      ctx.fillStyle = "rgba(153, 102, 255, 0.5)";
      ctx.fillRect(x, y, barWidth, barHeight);

      // Etiqueta valor
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${value}`, x + barWidth / 2, y - 10);

      // Etiqueta sprint
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(label, x + barWidth / 2, chartHeight - padding + 20);
    });

    // Leyenda
    ctx.fillStyle = "rgba(153, 102, 255, 0.5)";
    ctx.fillRect(chartWidth / 2 - 60, 90, 20, 20);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Horas invertidas", chartWidth / 2 - 30, 105);
  }, [datos]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      width: "100%", 
      margin: "auto", 
      backgroundColor: "#f9f9f9", 
      padding: "20px", 
      borderRadius: "16px", 
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" 
    }}>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
}

export default HorasPorSprintGrafico;
