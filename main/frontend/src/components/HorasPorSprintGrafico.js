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

import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

function HorasPorSprintGrafico({ datos: propDatos }) {
  const [datos, setDatos] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Colors for gradient effects
  const gradientColors = {
    primary: '#6a75ca',
    secondary: '#8e95d3',
    highlight: '#4b56c2'
  };

  useEffect(() => {
    // If props are provided, use them instead of fetching
    if (propDatos && propDatos.length > 0) {
      // Transform the data to the format required by Recharts
      const formattedData = propDatos.map(item => ({
        name: item[0],
        horas: item[1]
      }));
      setDatos(formattedData);
      return;
    }
    
    // Otherwise fetch mock data for development/testing
    fetch('/mockData.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.horasSprint) {
          const formattedData = data.horasSprint.map(item => ({
            name: item[0],
            horas: item[1]
          }));
          setDatos(formattedData);
        } else {
          console.error("Mock data format incorrect");
        }
      })
      .catch(error => {
        console.error("Error loading mock data:", error);
        // Fallback to static data if even mock data fails
        setDatos([
          { name: "Sprint 1", horas: 36 },
          { name: "Sprint 3", horas: 19 },
          { name: "Sprint 2", horas: 21 }
        ]);
      });
  }, [propDatos]);

  // Custom tooltip component to enhance appearance
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
          <p className="label" style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#333' }}>
            {`${label}`}
          </p>
          <p className="value" style={{ margin: '0', color: '#666' }}>
            {`Horas invertidas: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarMouseOver = (data, index) => {
    setHoveredBar(index);
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: 400,
      backgroundColor: '#f9f9f9', 
      padding: '20px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        Horas Trabajadas por Sprint
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={datos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tick={{ fill: '#666', fontSize: 14 }}
            dy={10}
          />
          <YAxis 
            label={{ 
              value: 'Horas', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666' }
            }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tick={{ fill: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span style={{ color: '#666', fontSize: 14 }}>Horas invertidas</span>}
          />
          <Bar 
            dataKey="horas"
            name="Horas invertidas" 
            fill={gradientColors.primary}
            animationDuration={1500}
            animationEasing="ease-out"
            onMouseOver={handleBarMouseOver}
            onMouseLeave={handleBarMouseLeave}
          >
            {datos.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={hoveredBar === index ? gradientColors.highlight : gradientColors.primary} 
                cursor="pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorasPorSprintGrafico;
