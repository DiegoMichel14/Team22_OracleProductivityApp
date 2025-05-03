/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NewItem from './NewItem';
// import API_LIST from './API';
// import { API_KPI_EQUIPO, API_TAREAS_POR_DESARROLLADOR } from './API_Reportes';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { Button, TableBody, CircularProgress } from '@mui/material';
// import Moment from 'react-moment';

// import Calendar from './components/Calendar';
// import TestTareas from './components/TestTareas';
// import TestEquipos from './components/TestEquipos';
// import TestDevelopers from './components/TestDevelopers';
// import TestTareaDeveloper from './components/TestTareaDeveloper';
// import TestManager from './components/TestManager';
// import TestPrioridades from './components/TestPrioridades';
// import TestSprints from './components/TestSprints';
// import TestEstados from './components/TestEstados';
// import ReporteTareas from './components/ReporteTareas';
// import ProductividadGrafico from './components/ProductividadGrafico';
// import GraficoPastel from './components/GraficoPastel';

// import './index.css';

// function App() {
//   const navigate = useNavigate();

//   // Estados de carga e inserción
//   const [isLoading, setLoading] = useState(false);
//   const [isInserting, setInserting] = useState(false);

//   // Lista de tareas y error
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);

//   // Estados para reportes
//   const [datosBarras, setDatosBarras] = useState({});
//   const [datosPastel, setDatosPastel] = useState({});
//   const [sprintSeleccionado, setSprintSeleccionado] = useState(null);

//   // Mock de usuario (en el futuro puede venir de contexto o localStorage)
//   const user = { nombre: "Test User" };

//   // Funciones de CRUD
//   function deleteItem(deleteId) {
//     fetch(`${API_LIST}/${deleteId}`, { method: 'DELETE' })
//       .then(res => {
//         if (!res.ok) throw new Error('Error al eliminar');
//         setItems(items.filter(item => item.id !== deleteId));
//       })
//       .catch(err => setError(err));
//   }

//   function toggleDone(e, id, description, done) {
//     e.preventDefault();
//     modifyItem(id, description, done)
//       .then(() => reloadOneItem(id))
//       .catch(err => setError(err));
//   }

//   function modifyItem(id, description, done) {
//     return fetch(`${API_LIST}/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ description, done })
//     })
//     .then(res => {
//       if (!res.ok) throw new Error('Error al modificar');
//       return res;
//     });
//   }

//   function reloadOneItem(id) {
//     fetch(`${API_LIST}/${id}`)
//       .then(res => {
//         if (!res.ok) throw new Error('Error al recargar ítem');
//         return res.json();
//       })
//       .then(result => {
//         setItems(items.map(x =>
//           x.id === id ? { ...x, description: result.description, done: result.done } : x
//         ));
//       })
//       .catch(err => setError(err));
//   }

//   function addItem(text) {
//     setInserting(true);
//     fetch(API_LIST, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ description: text })
//     })
//     .then(res => {
//       if (!res.ok) throw new Error('Error al agregar');
//       return res;
//     })
//     .then(result => {
//       const newId = result.headers.get('location');
//       setItems([{ id: newId, description: text, done: false }, ...items]);
//       setInserting(false);
//     })
//     .catch(err => {
//       setError(err);
//       setInserting(false);
//     });
//   }

//   // Efecto principal: carga de tareas y reportes
//   useEffect(() => {
//     setLoading(true);
//     // 1) Cargar tareas
//     fetch(API_LIST)
//       .then(res => {
//         if (!res.ok) throw new Error('Error al cargar tareas');
//         return res.json();
//       })
//       .then(result => {
//         setItems(result);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err);
//         setLoading(false);
//       });

//     // 2) Cargar KPI por equipo (barras)
//     fetch(API_KPI_EQUIPO)
//       .then(res => res.json())
//       .then(data => {
//         const sprints = data.reduce((acc, d) => {
//           acc[d[0]] = acc[d[0]] || [];
//           acc[d[0]].push(d);
//           return acc;
//         }, {});
//         setDatosBarras(sprints);
//         setSprintSeleccionado(Object.keys(sprints)[0] || null);
//       })
//       .catch(err => console.error(err));

//     // 3) Cargar tareas por desarrollador (pastel)
//     fetch(API_TAREAS_POR_DESARROLLADOR)
//       .then(res => res.json())
//       .then(data => {
//         const sprints = data.reduce((acc, d) => {
//           acc[d[0]] = acc[d[0]] || [];
//           acc[d[0]].push([d[1], d[2]]);
//           return acc;
//         }, {});
//         setDatosPastel(sprints);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="App">
//       <h1>MY TODO LIST</h1>
//       {user && <p>Bienvenido, {user.nombre}</p>}

//       {/* Navegación de vistas */}
//       <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '15px 0' }}>
//         <Button variant="contained" color="primary" onClick={() => navigate('/developer')}>
//           Vista Developer
//         </Button>
//         <Button variant="contained" color="secondary" onClick={() => navigate('/manager')}>
//           Vista Manager
//         </Button>
//       </div>

//       {/* Nuevo ítem */}
//       <NewItem addItem={addItem} isInserting={isInserting} />

//       {/* Errores y loading */}
//       {error && <p>Error: {error.message}</p>}
//       {isLoading && <CircularProgress />}

//       {/* Tablas de tareas */}
//       {!isLoading && (
//         <div id="maincontent">
//           <table id="itemlistNotDone" className="itemlist">
//             <TableBody>
//               {items.map(item => !item.done && (
//                 <tr key={item.id}>
//                   <td className="description">{item.description}</td>
//                   <td className="date">
//                     <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
//                   </td>
//                   <td>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       className="DoneButton"
//                       onClick={e => toggleDone(e, item.id, item.description, true)}
//                     >
//                       Done
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </TableBody>
//           </table>

//           <h2 id="donelist">Done items</h2>
//           <table id="itemlistDone" className="itemlist">
//             <TableBody>
//               {items.map(item => item.done && (
//                 <tr key={item.id}>
//                   <td className="description">{item.description}</td>
//                   <td className="date">
//                     <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
//                   </td>
//                   <td>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       className="DoneButton"
//                       onClick={e => toggleDone(e, item.id, item.description, false)}
//                     >
//                       Undo
//                     </Button>
//                   </td>
//                   <td>
//                     <Button
//                       startIcon={<DeleteIcon />}
//                       variant="contained"
//                       size="small"
//                       className="DeleteButton"
//                       onClick={() => deleteItem(item.id)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </TableBody>
//           </table>
//         </div>
//       )}

//       {/* Sección de Reportes */}
//       <h1>Reportes de Productividad por Sprint</h1>
//       <div>
//         {Object.keys(datosBarras).map(sprint => (
//           <button
//             key={sprint}
//             onClick={() => setSprintSeleccionado(sprint)}
//             style={{
//               margin: 5,
//               padding: 10,
//               background: sprint === sprintSeleccionado ? 'red' : 'gray',
//               color: 'white',
//               borderRadius: 5
//             }}
//           >
//             {sprint}
//           </button>
//         ))}
//       </div>
//       {sprintSeleccionado && datosBarras[sprintSeleccionado] && datosPastel[sprintSeleccionado] && (
//         <div>
//           <h2 style={{ textAlign: 'center' }}>
//             Gráfica de Productividad - {sprintSeleccionado}
//           </h2>
//           <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />

//           <h2 style={{ textAlign: 'center', marginTop: 20 }}>
//             Gráfica de Tareas por Desarrollador - {sprintSeleccionado}
//           </h2>
//           <GraficoPastel datos={datosPastel[sprintSeleccionado]} />
//         </div>
//       )}

//       {/* Componentes de prueba y calendario */}
//       <Calendar />
//       <TestTareas />
//       <TestEquipos />
//       <TestDevelopers />
//       <TestTareaDeveloper />
//       <TestManager />
//       <TestPrioridades />
//       <TestSprints />
//       <TestEstados />
//       <ReporteTareas />
//     </div>
//   );
// }

// export default App;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_LIST from './API';
import { API_KPI_EQUIPO, API_TAREAS_POR_DESARROLLADOR } from './API_Reportes';
import { Button, CircularProgress, TableBody } from '@mui/material';
import Moment from 'react-moment';
import Calendar from './components/Calendar';
import ProductividadGrafico from './components/ProductividadGrafico';
import GraficoPastel from './components/GraficoPastel';
import './index.css';

function App() {
  const navigate = useNavigate();

  // Estados principales
  const [isLoading,setLoading]=useState("false")
  const [items,      setItems]              = useState([]);
  const [error,      setError]              = useState(null);
  const [datosBarras,        setDatosBarras]        = useState({});
  const [datosPastel,        setDatosPastel]        = useState({});
  const [sprintSeleccionado, setSprintSeleccionado] = useState(null);

  // Usuario simulado
  const user = { nombre: 'Test User' };

  useEffect(() => {
    // 1) Cargar todas las tareas
    setLoading(true);
    fetch(API_LIST)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar tareas")
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });

    // 2) Cargar KPI por equipo (gráfica de barras)
    fetch(API_KPI_EQUIPO)
      .then(res => res.json())
      .then(data => {
        const sprints = data.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push(d);
          return acc;
        }, {});
        setDatosBarras(sprints);
        setSprintSeleccionado(Object.keys(sprints)[0] || null);
      })
      .catch(console.error);

    // 3) Cargar tareas por desarrollador (gráfica de pastel)
    fetch(API_TAREAS_POR_DESARROLLADOR)
      .then(res => res.json())
      .then(data => {
        const sprints = data.reduce((acc, d) => {
          acc[d[0]] = acc[d[0]] || [];
          acc[d[0]].push([d[1], d[2]]);
          return acc;
        }, {});
        setDatosPastel(sprints);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      {/* 1. Título y bienvenida */}
      <h1>MY TODO LIST</h1>
      {user && <p>Bienvenido, {user.nombre}</p>}

      {/* 2. Botones para cambiar vista */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '15px 0' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/developer')}
        >
          Vista Developer
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/manager')}
        >
          Vista Manager
        </Button>
      </div>

      {/* 3. Reportes de productividad por sprint */}
      <h1>Reportes de Productividad por Sprint</h1>
      <div>
        {Object.keys(datosBarras).map(sprint => (
          <button
            key={sprint}
            onClick={() => setSprintSeleccionado(sprint)}
            style={{
              margin: 5,
              padding: '8px 12px',
              background: sprint === sprintSeleccionado ? 'red' : 'gray',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {sprint}
          </button>
        ))}
      </div>

      {/* 4. Gráficas del sprint seleccionado */}
      {sprintSeleccionado &&
        datosBarras[sprintSeleccionado] &&
        datosPastel[sprintSeleccionado] && (
          <div>
            <h2 style={{ textAlign: 'center' }}>
              Gráfica de Productividad - {sprintSeleccionado}
            </h2>
            <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />

            <h2 style={{ textAlign: 'center', marginTop: 20 }}>
              Gráfica de Tareas por Desarrollador - {sprintSeleccionado}
            </h2>
            <GraficoPastel datos={datosPastel[sprintSeleccionado]} />
          </div>
        )}

      {/* 5. Calendario */}
      <Calendar />

      {/* 6. Lista de tareas completadas en formato de tabla */}
      <section style={{ marginTop: 30 }}>
        <h2 id="donelist">Tareas Completadas</h2>
        {isLoading && <CircularProgress />}
        {error && <p>Error: {error.message}</p>}
        {!isLoading && !error && (
          <table id="itemlistDone" className="itemlist">
            <TableBody>
              {items
                .filter(item => item.estado && item.estado.estado === 'Completada')
                .map(item => (
                  <tr key={item.idTarea}>
                    <td className="description">{item.nombreTarea}</td>
                    <td className="date">
                      <Moment format="DD/MM/YYYY">{item.fechaRegistro}</Moment>
                    </td>
                  </tr>
                ))}
            </TableBody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;