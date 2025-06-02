/*
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
*/

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = {
  horasEstimadas: '#4a90e2',
  horasReales: '#ff5252',
  costos: '#4caf50',
};

function ProductividadGrafico({ datos }) {
  const [formattedData, setFormattedData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    if (!datos || datos.length === 0) return;

    const transformado = datos.map(d => ({
      name: d[0], // Sprint
      horasEstimadas: d[1],
      horasReales: d[2],
      developer: d[3] || '',
      costos: d[4],
      costoOriginal: d[4]
    }));

    setFormattedData(transformado);
  }, [datos]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const color = COLORS[item.dataKey] || '#ccc';
      const value = item.dataKey === 'costos' 
        ? `$${Math.round(item.payload.costoOriginal)}`
        : `${item.value}h`;

      return (
        <div style={{
          backgroundColor: 'white',
          padding: 10,
          border: '1px solid #ddd',
          borderRadius: 8
        }}>
          <strong>{label}</strong>
          <div style={{ color }}>{`${item.name}: ${value}`}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {['horasEstimadas', 'horasReales', 'costos'].map((key) => (
          <Bar
            key={key}
            yAxisId={key === 'costos' ? 'right' : 'left'}
            dataKey={key}
            name={
              key === 'horasEstimadas' ? 'Horas estimadas' :
              key === 'horasReales' ? 'Horas reales' :
              'Costo total (USD)'
            }
            fill={COLORS[key]}
            barSize={30}
            onMouseOver={(_, index) => setHoveredBar({ type: key, index })}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {formattedData.map((_, index) => (
              <Cell
                key={`cell-${key}-${index}`}
                fill={hoveredBar?.type === key && hoveredBar.index === index
                  ? key === 'horasEstimadas' ? '#0d47a1'
                  : key === 'horasReales' ? '#c62828'
                  : '#2e7d32'
                  : COLORS[key]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProductividadGrafico;
