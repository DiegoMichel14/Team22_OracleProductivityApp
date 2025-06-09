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

function HorasPorDeveloperGrafico({ usuario }) {
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

        let filteredData = data;
        if (usuario !== "Diego") {
          filteredData = data.filter(d => d[1] === usuario);
        }

        const grouped = sprints.map(sprint => {
          const sprintData = { sprint };
          devs.forEach(dev => {
            const entry = filteredData.find(d => d[0] === sprint && d[1] === dev);
            sprintData[dev] = entry ? entry[2] : 0;
          });
          return sprintData;
        });

        const orderedGrouped = grouped.sort((a, b) => {
          const numA = parseInt(a.sprint.replace(/\D/g, ''));
          const numB = parseInt(b.sprint.replace(/\D/g, ''));
          return numA - numB;
        });

        setDatos(orderedGrouped);
      })
      .catch(console.error);
  }, [usuario]);

  return (
    <div style={{ width: '100%', height: 450 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 20 }}>
        Horas trabajadas por sprint por desarrollador
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprint" />
          <YAxis />
          <Tooltip />
          <Legend />

          {developers.map((dev, i) => (
            <Bar key={dev} dataKey={dev} name={dev} fill={COLORS[i % COLORS.length]}>
              <LabelList dataKey={dev} position="top" />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorasPorDeveloperGrafico;
