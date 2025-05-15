/*import React, { useEffect, useRef, useState } from "react";
import { API_HORAS_DEVELOPER } from "../API_Reportes";

function HorasPorDeveloperGrafico() {
  const canvasRef = useRef(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch(API_HORAS_DEVELOPER)
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colores = ["blue", "lightblue", "green", "cyan", "orange", "purple"];
    const anchoBarra = 30;
    const separacion = 20;
    const margenIzquierdo = 150;
    const alturaMaxima = 200;
    const sprints = [...new Set(datos.map(d => d[0]))]; 
    const developers = [...new Set(datos.map(d => d[1]))];

    const maxHoras = Math.max(...datos.map(d => d[2])) || 1;

    developers.forEach((dev, j) => {
      const color = colores[j % colores.length];

      // ⬇ Dibujar etiqueta con el nombre del Developer y su color
      ctx.fillStyle = color;
      ctx.fillRect(margenIzquierdo - 100, 50 + j * 25, 15, 15);

      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(dev, margenIzquierdo - 80, 63 + j * 25);
    });

    sprints.forEach((sprint, i) => {
      developers.forEach((dev, j) => {
        const horas = datos.find(d => d[0] === sprint && d[1] === dev)?.[2] || 0;
        const xBarra = margenIzquierdo + i * (anchoBarra * developers.length + separacion) + j * anchoBarra;
        const alturaBarra = (horas / maxHoras) * alturaMaxima;

        ctx.fillStyle = colores[j % colores.length];
        ctx.fillRect(xBarra, alturaMaxima - alturaBarra, anchoBarra, alturaBarra);

        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(`${horas}h`, xBarra + 5, alturaMaxima - alturaBarra - 5);
      });

      ctx.fillStyle = "white";
      ctx.fillText(sprint, margenIzquierdo + i * (anchoBarra * developers.length + separacion), alturaMaxima + 30);
    });
  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", margin: "auto" }}>
      <canvas ref={canvasRef} width={1200} height={600} style={{ display: "block" }} />
    </div>
  );
}

export default HorasPorDeveloperGrafico;
*/

import React, { useEffect, useRef, useState } from "react";
import { API_HORAS_DEVELOPER } from "../API_Reportes";

function HorasPorDeveloperGrafico() {
  const canvasRef = useRef(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch(API_HORAS_DEVELOPER)
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colores = ["#9c755f", "#59a14f", "#4e79a7", "#f28e2b", "#edc948", "#bab0ab"];
    const anchoBarra = 30;
    const separacion = 30;
    const padding = 80;
    const alturaGrafica = canvas.height - padding * 2;
    const anchoGrafica = canvas.width - padding * 2;

    const sprints = [...new Set(datos.map(d => d[0]))];
    const developers = [...new Set(datos.map(d => d[1]))];

    const maxHoras = Math.max(...datos.map(d => d[2])) || 1;
    const numLineasY = 5;

    // Título
    ctx.fillStyle = "#333";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Horas trabajadas por sprint por desarrollador", canvas.width / 2, 40);

    // Eje Y: líneas horizontales + etiquetas
    ctx.strokeStyle = "#e0e0e0";
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= numLineasY; i++) {
      const valor = Math.round((maxHoras / numLineasY) * i);
      const y = canvas.height - padding - (valor / maxHoras) * alturaGrafica;

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      ctx.fillText(`${valor}`, padding - 10, y + 5);
    }

    // Eje X: etiquetas de sprints
    ctx.textAlign = "center";
    sprints.forEach((sprint, i) => {
      const grupoX = padding + i * ((developers.length * anchoBarra) + separacion) + (developers.length * anchoBarra) / 2;
      ctx.fillText(sprint, grupoX, canvas.height - padding + 30);
    });

    // Barras por developer
    sprints.forEach((sprint, i) => {
      developers.forEach((dev, j) => {
        const horas = datos.find(d => d[0] === sprint && d[1] === dev)?.[2] || 0;
        const altura = (horas / maxHoras) * alturaGrafica;

        const x = padding + i * ((developers.length * anchoBarra) + separacion) + j * anchoBarra;
        const y = canvas.height - padding - altura;

        ctx.fillStyle = colores[j % colores.length];
        ctx.fillRect(x, y, anchoBarra, altura);

        // Etiqueta de horas encima de cada barra
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText(`${horas}`, x + anchoBarra / 2, y - 5);
      });
    });

    // Leyenda
    developers.forEach((dev, j) => {
      const legendX = canvas.width - padding + 20;
      const legendY = padding + j * 25;

      ctx.fillStyle = colores[j % colores.length];
      ctx.fillRect(legendX, legendY, 15, 15);

      ctx.fillStyle = "#000";
      ctx.font = "10px Arial";
      ctx.textAlign = "left";
      ctx.fillText(dev, legendX + 20, legendY + 12);
    });

    // Eje Y - etiqueta
    ctx.save();
    ctx.translate(40, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Horas trabajadas", 0, 0);
    ctx.restore();
  }, [datos]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      width: "100%", 
      margin: "auto", 
      backgroundColor: "#fff", 
      padding: "20px", 
      borderRadius: "12px", 
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" 
    }}>
      <canvas ref={canvasRef} width={600} height={300} />
    </div>
  );
}

export default HorasPorDeveloperGrafico;
