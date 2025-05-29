import React, { useState, useEffect } from 'react';
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

function ProductividadGrafico({ datos }) {
  const [formattedData, setFormattedData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Define color scheme for the bars
  const COLORS = {
    estimadas: '#4a90e2', // blue
    reales: '#ff5252',    // red
    costos: '#4caf50'     // green
  };
  
  // Format data into the structure required by Recharts
  useEffect(() => {
    if (!datos || datos.length === 0) return;
    
    const transformed = datos.map(d => ({
      name: d[0],                 // Sprint name
      horasEstimadas: d[1],       // Estimated hours
      horasReales: d[2],          // Real hours
      developer: d[3] || '',      // Developer name (if available)
      costos: d[4],               // Costs in USD
      // Also store the original cost value for tooltip display
      costoOriginal: d[4]
    }));
    
    setFormattedData(transformed);
  }, [datos]);
  
  // Custom tooltip component for enhanced display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find what type of data we're hovering over
      const dataType = payload[0].dataKey;
      let color, title, value;
      
      if (dataType === 'horasEstimadas') {
        color = COLORS.estimadas;
        title = 'Horas estimadas';
        value = payload[0].value;
      } else if (dataType === 'horasReales') {
        color = COLORS.reales;
        title = 'Horas reales';
        value = payload[0].value;
      } else if (dataType === 'costos') {
        color = COLORS.costos;
        title = 'Costo total';
        // Use the original cost value rather than the scaled one
        const originalItem = formattedData.find(item => item.name === label);
        value = `$${Math.round(originalItem?.costoOriginal || 0)}`;
      }
      
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#333' }}>
            {label}
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: color,
            fontWeight: 500
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: color,
              marginRight: '8px',
              borderRadius: '2px'
            }}></div>
            <span>{`${title}: ${value}`}</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Event handlers for interactive features
  const handleMouseOver = (type, index) => {
    setHoveredBar({ type, index });
  };
  
  const handleMouseLeave = () => {
    setHoveredBar(null);
  };
  
  return (
    <div style={{ 
      width: '100%', 
      height: 450,
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
        Productividad y Costos por Sprint
      </h3>
      
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
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
              yAxisId="left"
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
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ 
                value: 'Costo (USD)', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#666' }
              }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              tick={{ fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '15px' }}
              iconType="square"
            />
            
            {/* Horas Estimadas */}
            <Bar 
              yAxisId="left"
              dataKey="horasEstimadas"
              name="Horas estimadas"
              fill={COLORS.estimadas}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseOver={(data, index) => handleMouseOver('estimadas', index)}
              onMouseLeave={handleMouseLeave}
              barSize={35}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-estimadas-${index}`}
                  fill={hoveredBar && hoveredBar.type === 'estimadas' && hoveredBar.index === index 
                    ? '#0d47a1' // darker blue on hover
                    : COLORS.estimadas}
                  cursor="pointer"
                />
              ))}
            </Bar>
            
            {/* Horas Reales */}
            <Bar 
              yAxisId="left"
              dataKey="horasReales"
              name="Horas reales"
              fill={COLORS.reales}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseOver={(data, index) => handleMouseOver('reales', index)}
              onMouseLeave={handleMouseLeave}
              barSize={35}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-reales-${index}`}
                  fill={hoveredBar && hoveredBar.type === 'reales' && hoveredBar.index === index 
                    ? '#c62828' // darker red on hover
                    : COLORS.reales}
                  cursor="pointer"
                />
              ))}
            </Bar>
            
            {/* Costos */}
            <Bar 
              yAxisId="right"
              dataKey="costos"
              name="Costo total (USD)"
              fill={COLORS.costos}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseOver={(data, index) => handleMouseOver('costos', index)}
              onMouseLeave={handleMouseLeave}
              barSize={35}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-costos-${index}`}
                  fill={hoveredBar && hoveredBar.type === 'costos' && hoveredBar.index === index 
                    ? '#2e7d32' // darker green on hover
                    : COLORS.costos}
                  cursor="pointer"
                />
              ))}
            </Bar>
            
            {/* Reference line for average hours if needed */}
            {/*
            <ReferenceLine 
              yAxisId="left" 
              y={formattedData.reduce((sum, item) => sum + item.horasReales, 0) / formattedData.length} 
              stroke="#777" 
              strokeDasharray="3 3" 
            >
              <Label value="Avg Hours" position="insideBottomRight" fill="#777" />
            </ReferenceLine>
            */}
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

export default ProductividadGrafico;
