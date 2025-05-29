import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

function HorasPorDeveloperGrafico({ datos: propDatos }) {
  const [datos, setDatos] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  // Define color palette for different developers
  const COLORS = useMemo(() => [
    '#4dabf5', // blue
    '#ff7e67', // red
    '#66bb6a', // green
    '#9575cd', // purple
    '#ffb74d', // orange
    '#4fc3f7', // light blue
    '#81c784', // light green
    '#ba68c8'  // light purple
  ], []);

  useEffect(() => {
    // If props are provided, use them instead of fetching
    if (propDatos && propDatos.length > 0) {
      // Transform the data to the format required by Recharts
      const formattedData = propDatos.map((item, index) => ({
        nombre: item[0],
        horas: item[1],
        color: COLORS[index % COLORS.length]
      }));
      setDatos(formattedData);
      return;
    }
    
    // Otherwise fetch mock data for development/testing
    fetch('/mockData.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.horasDeveloper) {
          const formattedData = data.horasDeveloper.map((item, index) => ({
            nombre: item[0],
            horas: item[1],
            color: COLORS[index % COLORS.length]
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
          { nombre: "Diego", horas: 8, color: COLORS[0] },
          { nombre: "Adair", horas: 10, color: COLORS[1] },
          { nombre: "Omar", horas: 5, color: COLORS[2] },
          { nombre: "Oswaldo", horas: 3, color: COLORS[3] },
          { nombre: "Salvador", horas: 0, color: COLORS[4] },
        ]);
      });
  }, [propDatos, COLORS]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="custom-tooltip" 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '10px 14px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p className="label" style={{ 
            margin: '0 0 5px', 
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333' 
          }}>
            {`${payload[0].payload.nombre}`}
          </p>
          <p className="value" style={{ 
            margin: '0', 
            fontSize: '13px',
            color: payload[0].color 
          }}>
            {`Horas trabajadas: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (selectedDeveloper === data.nombre) {
      setSelectedDeveloper(null);
    } else {
      setSelectedDeveloper(data.nombre);
    }
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
        Horas trabajadas por sprint por desarrollador
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="nombre" 
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
            formatter={() => <span style={{ color: '#666', fontSize: 14 }}>Horas trabajadas</span>}
          />
          <Bar 
            dataKey="horas"
            name="Horas trabajadas" 
            animationDuration={1500}
            animationEasing="ease-out"
            onClick={handleBarClick}
            className="cursor-pointer"
          >
            <LabelList 
              dataKey="horas" 
              position="top" 
              style={{ fill: '#666', fontSize: 12, fontWeight: 'bold' }} 
            />
            
            {datos.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={selectedDeveloper === entry.nombre 
                  ? '#303f9f' // highlight color when selected
                  : entry.color}
                cursor="pointer"
                stroke={selectedDeveloper === entry.nombre ? '#1a237e' : entry.color}
                strokeWidth={selectedDeveloper === entry.nombre ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorasPorDeveloperGrafico;
