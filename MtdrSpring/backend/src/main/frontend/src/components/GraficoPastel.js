/*import React, { useEffect, useRef } from 'react';

function GraficoPastel({ datos }) {
  const canvasRef = useRef(null);

    useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ajustes de la gráfica
    const anchoBarra = 60;
    const separacion = 40;
    const alturaMaxima = 200;
    const margenIzquierdo = 80;

    const colores = ["red", "blue", "green", "orange", "purple"];
    const maxTareas = Math.max(...datos.map(d => d[1])) || 1; // Escalar valores

    datos.forEach((d, i) => {
      const xBarra = margenIzquierdo + i * (anchoBarra + separacion);
      const alturaBarra = (d[1] / maxTareas) * alturaMaxima;

      // Dibujar barra
      ctx.fillStyle = colores[i % colores.length];
      ctx.fillRect(xBarra, alturaMaxima - alturaBarra, anchoBarra, alturaBarra);

      // Etiqueta sobre la barra
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`${d[1]}`, xBarra + 15, alturaMaxima - alturaBarra - 10);

      // Nombre del desarrollador debajo
      ctx.fillStyle = "white";
      ctx.fillText(d[0], xBarra, alturaMaxima + 30);
    });
  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", margin: "auto" }}>
      <canvas ref={canvasRef} width={1200} height={600} style={{ display: "block" }} />
    </div>
  );

}

export default GraficoPastel;
*/

import React, { useEffect, useRef } from 'react';

function GraficoPastel({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!datos || datos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = 40;
    const separacion = 60;
    const alturaMaxima = 300;
    const margenIzquierdo = 80;
    const margenSuperior = 60;

    const colores = ["red", "blue", "green", "orange", "purple", "cyan", "pink"];
    const maxValor = Math.max(...datos.map(d => d[1])) || 1;

    datos.forEach((d, i) => {
      const nombre = d[0];
      const valor = d[1];
      const alturaBarra = (valor / maxValor) * alturaMaxima;
      const x = margenIzquierdo + i * (anchoBarra + separacion);

      // Dibujar barra
      ctx.fillStyle = colores[i % colores.length];
      ctx.fillRect(x, margenSuperior + alturaMaxima - alturaBarra, anchoBarra, alturaBarra);

      // Texto encima de la barra
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(`${valor}`, x + 5, margenSuperior + alturaMaxima - alturaBarra - 5);

      // Nombre debajo
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(nombre, x - 5, margenSuperior + alturaMaxima + 20);
    });

    // Leyenda
    const leyendaX = margenIzquierdo;
    const leyendaY = 10;

    datos.forEach((d, i) => {
      const color = colores[i % colores.length];
      const label = d[0];

      ctx.fillStyle = color;
      ctx.fillRect(leyendaX + i * 150, leyendaY, 15, 15);

      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(label, leyendaX + i * 150 + 20, leyendaY + 12);
    });

  }, [datos]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <canvas ref={canvasRef} width={800} height={400} style={{ display: "block" }} />
    </div>
  );
}

export default GraficoPastel;
