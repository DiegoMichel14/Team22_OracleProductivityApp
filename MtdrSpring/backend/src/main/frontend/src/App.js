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
import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, CircularProgress } from '@mui/material';
import Moment from 'react-moment';
import Calendar from './components/calendar';
import TestTareas from './components/TestTareas';
import TestEquipos from './components/TestEquipos';
import TestDevelopers from './components/TestDevelopers';
import TestTareaDeveloper from './components/TestTareaDeveloper';
import TestManager from './components/TestManager';
import TestPrioridades from './components/TestPrioridades';
import TestSprints from './components/TestSprints';
import TestEstados from './components/TestEstados';
import ProductividadGrafico from './components/ProductividadGrafico';
import { API_KPI_EQUIPO } from './API_Reportes';
import ReporteTareas from './components/ReporteTareas';
import GraficoPastel from "./components/GraficoPastel";
import { API_TAREAS_POR_DESARROLLADOR } from "./API_Reportes";

/* In this application we're using Function Components with the State Hooks 
 * to manage the states. See the doc: https://reactjs.org/docs/hooks-state.html
 * This App component represents the entire app. It renders a NewItem component
 * and two tables: one that lists the todo items that are to be done and another
 * one with the items that are already done.
 */
function App() {
    // isLoading is true while waiting for the backend to return the list
    // of items. We use this state to display a spinning circle:
    const [isLoading, setLoading] = useState(false);
    // Similar to isLoading, isInserting is true while waiting for the backend
    // to insert a new item:
    const [isInserting, setInserting] = useState(false);
    // The list of todo items is stored in this state. It includes the "done"
    // "not-done" items:
    const [items, setItems] = useState([]);
    // In case of an error during the API call:
    const [error, setError] = useState();
    // grafica
    const [datos, setDatos] = useState([]);
    const [datosBarras, setDatosBarras] = useState({});
    const [sprintSeleccionado, setSprintSeleccionado] = useState(null);
    //const [datosPastel, setDatosPastel] = useState([]);
    const [datosPastel, setDatosPastel] = useState({});
    
    function deleteItem(deleteId) {
      // console.log("deleteItem("+deleteId+")")
      fetch(API_LIST+"/"+deleteId, {
        method: 'DELETE',
      })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const remainingItems = items.filter(item => item.id !== deleteId);
          setItems(remainingItems);
        },
        (error) => {
          setError(error);
        }
      );
    }
    function toggleDone(event, id, description, done) {
      event.preventDefault();
      modifyItem(id, description, done).then(
        (result) => { reloadOneIteam(id); },
        (error) => { setError(error); }
      );
    }
    function reloadOneIteam(id){
      fetch(API_LIST+"/"+id)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          (result) => {
            const items2 = items.map(
              x => (x.id === id ? {
                 ...x,
                 'description':result.description,
                 'done': result.done
                } : x));
            setItems(items2);
          },
          (error) => {
            setError(error);
          });
    }
    function modifyItem(id, description, done) {
      // console.log("deleteItem("+deleteId+")")
      var data = {"description": description, "done": done};
      return fetch(API_LIST+"/"+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        // console.log("response=");
        // console.log(response);
        if (response.ok) {
          // console.log("deleteItem FETCH call is ok");
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      });
    }
    /*
    To simulate slow network, call sleep before making API calls.
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    */
    useEffect(() => {
      setLoading(true);
      // sleep(5000).then(() => {
      fetch(API_LIST)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          (result) => {
            setLoading(false);
            setItems(result);
          },
          (error) => {
            setLoading(false);
            setError(error);
          });


        fetch(API_KPI_EQUIPO)
          .then(response => response.json())
          .then(data => {
            const sprints = data.reduce((acc, d) => {
              acc[d[0]] = acc[d[0]] || [];
              acc[d[0]].push(d);
              return acc;
            }, {});
            setDatosBarras(sprints);
            setSprintSeleccionado(Object.keys(sprints)[0]); // Selecciona el primer sprint por defecto
          })
          .catch(error => console.error("Error:", error));
    
        fetch(API_TAREAS_POR_DESARROLLADOR)
          .then(response => response.json())
          .then(data => {
            const sprints = data.reduce((acc, d) => {
              acc[d[0]] = acc[d[0]] || [];
              acc[d[0]].push([d[1], d[2]]); // Agrupar desarrollador y tareas
              return acc;
            }, {});
            setDatosPastel(sprints);
          })
          .catch(error => console.error("Error:", error));
    },
    // https://en.reactjs.org/docs/faq-ajax.html
    [] // empty deps array [] means
       // this useEffect will run once
       // similar to componentDidMount()
    );
    function addItem(text){
      console.log("addItem("+text+")")
      setInserting(true);
      var data = {};
      console.log(data);
      data.description = text;
      fetch(API_LIST, {
        method: 'POST',
        // We convert the React state to JSON and send it as the POST body
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then((response) => {
        // This API doens't return a JSON document
        console.log(response);
        console.log();
        console.log(response.headers.location);
        // return response.json();
        if (response.ok) {
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      }).then(
        (result) => {
          var id = result.headers.get('location');
          var newItem = {"id": id, "description": text}
          setItems([newItem, ...items]);
          setInserting(false);
        },
        (error) => {
          setInserting(false);
          setError(error);
        }
      );
    }


    
    return (
      <div className="App">
        <h1>MY TODO LIST</h1>
        <NewItem addItem={addItem} isInserting={isInserting} />
        { error && <p>Error: {error.message}</p> }
        { isLoading && <CircularProgress /> }
        { !isLoading &&
          <div id="maincontent">
            <table id="itemlistNotDone" className="itemlist">
              <TableBody>
                {items.map(item => (
                  !item.done && (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
                      <td className="date">
                        <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                      </td>
                      <td>
                        <Button variant="contained" className="DoneButton" onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} size="small">
                          Done
                        </Button>
                      </td>
                    </tr>
                  )
                ))}
              </TableBody>
            </table>
            <h2 id="donelist">Done items</h2>
            <table id="itemlistDone" className="itemlist">
              <TableBody>
                {items.map(item => (
                  item.done && (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
                      <td className="date">
                        <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                      </td>
                      <td>
                        <Button variant="contained" className="DoneButton" onClick={(event) => toggleDone(event, item.id, item.description, !item.done)} size="small">
                          Undo
                        </Button>
                      </td>
                      <td>
                        <Button startIcon={<DeleteIcon />} variant="contained" className="DeleteButton" onClick={() => deleteItem(item.id)} size="small">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                ))}
              </TableBody>
            </table>
          </div>
        }
        {/* Sección de Reportes */}
        <h1>Reportes de Productividad por Sprint</h1>

        {/* Botones para cambiar entre sprints */}
        <div>
          {Object.keys(datosBarras).map((sprint) => (
            <button
              key={sprint}
              onClick={() => setSprintSeleccionado(sprint)}
              style={{
                margin: "5px",
                padding: "10px",
                background: sprintSeleccionado === sprint ? "red" : "gray",
                color: "white",
                borderRadius: "5px",
              }}
            >
              {sprint}
            </button>
          ))}
        </div>

        {/* Mostrar la gráfica de barras y pastel del sprint seleccionado */}
        {sprintSeleccionado && datosBarras[sprintSeleccionado] && datosPastel[sprintSeleccionado] && (
          <div>
            <h2 style={{ textAlign: "center" }}>Gráfica de Productividad - {sprintSeleccionado}</h2>
            <ProductividadGrafico datos={datosBarras[sprintSeleccionado]} />

            <h2 style={{ textAlign: "center", marginTop: "20px" }}>
              Gráfica de Tareas por Desarrollador - {sprintSeleccionado}
            </h2>
            <GraficoPastel datos={datosPastel[sprintSeleccionado]} />
          </div>
        )}
  
        {/* Agregamos los nuevos componentes de prueba */}
        <Calendar />
        <TestTareas />
        <TestEquipos />
        <TestDevelopers />
        <TestTareaDeveloper />
        <TestManager />
        <TestPrioridades />
        <TestSprints />
        <TestEstados />
        <ReporteTareas />
  
      </div>
    );
  }
  
  export default App;



  //   kubectl apply -f deployment.yaml
  //   kubectl get pods
  //   kubectl get svc agile-service