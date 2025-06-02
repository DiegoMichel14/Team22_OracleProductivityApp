/*
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
*/

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';

function GraficoPastel({ datos }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Convert the data to the format expected by Recharts
  const formattedData = datos ? datos.map(item => ({
    name: item[0],
    value: item[1]
  })) : [];
  
  // Beautiful color palette for the pie chart
  const COLORS = [
    '#ff7e67', // coral red
    '#4dabf5', // blue
    '#66bb6a', // green
    '#9575cd', // purple
    '#ffb74d', // orange
    '#4fc3f7', // light blue
    '#81c784', // light green
    '#ba68c8'  // light purple
  ];

  // Custom tooltip for hover information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ margin: '0', fontWeight: 'bold', color: payload[0].color }}>
            {payload[0].name}
          </p>
          <p style={{ margin: '5px 0 0', color: '#666' }}>
            Tareas: {payload[0].value}
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#999' }}>
            {`${((payload[0].value / formattedData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Active sector animation when hovering over a slice
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent
    } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#999" style={{ fontSize: '12px' }}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  // Event handlers
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: 350, 
      backgroundColor: '#f9f9f9', 
      padding: '20px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' 
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        Tareas por Desarrollador
      </h3>
      
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry) => (
                <span style={{ color: '#666', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80%',
          color: '#999'
        }}>
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}

export default GraficoPastel;