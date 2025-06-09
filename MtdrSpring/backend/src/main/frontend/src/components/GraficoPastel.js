import React from 'react';
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
  LabelList,
} from 'recharts';

function GraficoBarras({ datos, usuario }) {
  // Filtrar los datos según el usuario
  const formattedData = datos 
    ? datos
        .map(item => ({
          name: item[0],
          tareas: item[1],
        }))
        .filter(item => usuario === 'Diego' || item.name === usuario)
    : [];

  const COLORS = [
    '#ff7e67', '#4dabf5', '#66bb6a', '#9575cd',
    '#ffb74d', '#4fc3f7', '#81c784', '#ba68c8'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = formattedData.reduce((acc, curr) => acc + curr.tareas, 0);
      const porcentaje = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <strong style={{ color: payload[0].color }}>{label}</strong>
          <p style={{ margin: '5px 0 0', color: '#666' }}>
            Tareas: {payload[0].value}
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#999' }}>
            {porcentaje}%
          </p>
        </div>
      );
    }
    return null;
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
        marginBottom: '10px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        Tareas por Desarrollador
      </h3>

      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="tareas" name="Tareas" barSize={40}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList dataKey="tareas" position="top" style={{ fill: '#333', fontSize: 12 }} />
            </Bar>
          </BarChart>
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

export default GraficoBarras;
