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
import { API_HORAS_SPRINT } from "../API_Reportes";

function HorasPorSprintGrafico() {
  const [datos, setDatos] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  const gradientColors = {
    primary: '#6a75ca',
    highlight: '#4b56c2'
  };

  useEffect(() => {
    fetch(API_HORAS_SPRINT)
      .then(response => response.json())
      .then(data => {
        const formattedData = data
          .map(item => ({
            name: item[0],
            horas: item[1]
          }))
          .sort((a, b) => {
            const numA = parseInt(a.name.replace(/\D/g, ''));
            const numB = parseInt(b.name.replace(/\D/g, ''));
            return numA - numB;
          });

        setDatos(formattedData);
      })
      .catch(error => {
        console.error("Error al cargar datos del API:", error);
        // Datos de respaldo
        setDatos([
          { name: "Sprint 1", horas: 36 },
          { name: "Sprint 2", horas: 21 },
          { name: "Sprint 3", horas: 19 }
        ]);
      });
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{label}</p>
          <p style={{ margin: 0, color: '#666' }}>Horas invertidas: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      width: '100%',
      height: 420,
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
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
            formatter={() => <span style={{ color: '#666', fontSize: 14 }}>Horas invertidas</span>}
          />
          <Bar
            dataKey="horas"
            name="Horas invertidas"
            fill={gradientColors.primary}
            animationDuration={1500}
            animationEasing="ease-out"
            onMouseOver={(_, index) => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {datos.map((_, index) => (
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
