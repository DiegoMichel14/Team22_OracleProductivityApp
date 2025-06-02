/*import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell
} from "recharts";
import { API_HORAS_DEVELOPER } from "../API_Reportes";

function HorasPorDeveloperGrafico() {
  const [datos, setDatos] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  const COLORS = useMemo(() => [
    '#4dabf5', '#ff7e67', '#66bb6a', '#9575cd', '#ffb74d', '#4fc3f7', '#81c784', '#ba68c8'
  ], []);

  useEffect(() => {
    fetch(API_HORAS_DEVELOPER)
      .then(res => res.json())
      .then(data => {
        const sprints = [...new Set(data.map(d => d[0]))];
        const devs = [...new Set(data.map(d => d[1]))];
        setDevelopers(devs);

        const grouped = sprints.map(sprint => {
          const sprintData = { sprint };
          devs.forEach(dev => {
            const entry = data.find(d => d[0] === sprint && d[1] === dev);
            sprintData[dev] = entry ? entry[2] : 0;
          });
          return sprintData;
        });

        setDatos(grouped);
      })
      .catch(console.error);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: 10,
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Sprint: ${label}`}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '4px 0' }}>
              {`${p.name}: ${p.value} horas`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data, devName) => {
    setSelectedDeveloper(prev => prev === devName ? null : devName);
  };

  return (
    <div style={{
      width: '100%',
      height: 450,
      backgroundColor: '#f9f9f9',
      padding: 20,
      borderRadius: 16,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        fontFamily: 'Arial, sans-serif'
      }}>
        Horas trabajadas por sprint por desarrollador
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="sprint" tick={{ fill: '#666', fontSize: 14 }} dy={10} />
          <YAxis
            label={{
              value: 'Horas',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666' }
            }}
            tick={{ fill: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={name => <span style={{ color: '#666', fontSize: 14 }}>{name}</span>} />

          {developers.map((dev, i) => (
            <Bar
              key={dev}
              dataKey={dev}
              name={dev}
              fill={COLORS[i % COLORS.length]}
              onClick={(data) => handleBarClick(data, dev)}
              isAnimationActive
            >
              <LabelList dataKey={dev} position="top" style={{ fill: '#333', fontSize: 12 }} />
              {datos.map((entry, index) => (
                <Cell
                  key={`cell-${dev}-${index}`}
                  fill={selectedDeveloper === dev ? '#303f9f' : COLORS[i % COLORS.length]}
                  stroke={selectedDeveloper === dev ? '#1a237e' : undefined}
                  strokeWidth={selectedDeveloper === dev ? 2 : 0}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorasPorDeveloperGrafico;
*/

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell
} from "recharts";
import { API_HORAS_DEVELOPER } from "../API_Reportes";

function HorasPorDeveloperGrafico() {
  const [datos, setDatos] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  const COLORS = useMemo(() => [
    '#4dabf5', '#ff7e67', '#66bb6a', '#9575cd',
    '#ffb74d', '#4fc3f7', '#81c784', '#ba68c8'
  ], []);

  useEffect(() => {
    fetch(API_HORAS_DEVELOPER)
      .then(res => res.json())
      .then(data => {
        const sprints = [...new Set(data.map(d => d[0]))];
        const devs = [...new Set(data.map(d => d[1]))];
        setDevelopers(devs);

        const grouped = sprints.map(sprint => {
          const sprintData = { sprint };
          devs.forEach(dev => {
            const entry = data.find(d => d[0] === sprint && d[1] === dev);
            sprintData[dev] = entry ? entry[2] : 0;
          });
          return sprintData;
        });

        // Ordenar por número de sprint extraído del string (por ejemplo: "Sprint 1")
        const orderedGrouped = grouped.sort((a, b) => {
          const numA = parseInt(a.sprint.replace(/\D/g, ''));
          const numB = parseInt(b.sprint.replace(/\D/g, ''));
          return numA - numB;
        });

        setDatos(orderedGrouped);
      })
      .catch(console.error);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: 10,
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Sprint: ${label}`}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '4px 0' }}>
              {`${p.name}: ${p.value} horas`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data, devName) => {
    setSelectedDeveloper(prev => prev === devName ? null : devName);
  };

  return (
    <div style={{
      width: '100%',
      height: 450,
      backgroundColor: '#f9f9f9',
      padding: 20,
      borderRadius: 16,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        fontFamily: 'Arial, sans-serif'
      }}>
        Horas trabajadas por sprint por desarrollador
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="sprint" tick={{ fill: '#666', fontSize: 14 }} dy={10} />
          <YAxis
            label={{
              value: 'Horas',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666' }
            }}
            tick={{ fill: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={name => <span style={{ color: '#666', fontSize: 14 }}>{name}</span>} />

          {developers.map((dev, i) => (
            <Bar
              key={dev}
              dataKey={dev}
              name={dev}
              fill={COLORS[i % COLORS.length]}
              onClick={(data) => handleBarClick(data, dev)}
              isAnimationActive
            >
              <LabelList dataKey={dev} position="top" style={{ fill: '#333', fontSize: 12 }} />
              {datos.map((entry, index) => (
                <Cell
                  key={`cell-${dev}-${index}`}
                  fill={selectedDeveloper === dev ? '#303f9f' : COLORS[i % COLORS.length]}
                  stroke={selectedDeveloper === dev ? '#1a237e' : undefined}
                  strokeWidth={selectedDeveloper === dev ? 2 : 0}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorasPorDeveloperGrafico;
