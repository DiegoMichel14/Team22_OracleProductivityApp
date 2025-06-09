import React, { useEffect, useState } from 'react';
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
      return (
        <div style={{
          backgroundColor: 'white',
          padding: 10,
          border: '1px solid #ddd',
          borderRadius: 8
        }}>
          <strong>{label}</strong>
          {payload.map((item, index) => {
            const color = COLORS[item.dataKey] || '#ccc';
            const value = item.dataKey === 'costos'
              ? `$${Math.round(item.payload.costoOriginal)}`
              : `${item.value}h`;
            const labelName =
              item.dataKey === 'horasEstimadas' ? 'Horas estimadas' :
              item.dataKey === 'horasReales' ? 'Horas reales' :
              'Costo total (USD)';
            return (
              <div key={index} style={{ color }}>
                {labelName}: {value}
              </div>
            );
          })}
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
            <LabelList
              dataKey={key}
              position="top"
              formatter={(value) => key === 'costos' ? `$${Math.round(value)}` : `${value}h`}
              style={{ fill: '#000', fontSize: 12 }}
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProductividadGrafico;
