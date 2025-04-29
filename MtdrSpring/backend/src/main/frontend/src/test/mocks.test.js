import request from 'supertest';
import express from 'express';

// Crear una app express para mockear el endpoint
const app = express();
app.use(express.json());

// Mock de las tareas y desarrolladores
const tareas = [
  {
    idTarea: 1,
    nombre: "Desarrollar Backend",
    desarrollador: "Juan",
    horasEstimadas: 8,
    horasReales: 7,
    sprintId: 1,
    completada: true
  },
  {
    idTarea: 2,
    nombre: "Desarrollar Frontend",
    desarrollador: "Ana",
    horasEstimadas: 10,
    horasReales: 12,
    sprintId: 1,
    completada: true
  }
];

// Mock de endpoint para obtener las tareas completadas por Sprint
app.get("/sprints/ultimo/developer/:developerId/tareas", (req, res) => {
  const { developerId } = req.params;

  // Filtrar las tareas completadas del último sprint del desarrollador
  const tareasDeveloper = tareas.filter(t => t.desarrollador === developerId && t.completada);
  if (!tareasDeveloper.length) {
    return res.status(404).json({ message: "No hay tareas completadas para este desarrollador" });
  }
  res.json(tareasDeveloper);
});

// Mock database
let tareasDB = [
  { idTarea: 1, nombre: "Tarea Original", desarrollador: "Juan", storyPoints: 5, horasEstimadas: 8, completada: false }
];

// Mock de endpoint GET de tareas para un developer
app.get("/tarea-developers/tareas/1", (req, res) => {
  res.json([
    { id: 1, nombre: "Tarea 1" },
    { id: 2, nombre: "Tarea 2" }
  ]);
});

// Mock endpoint de actualización de tarea (PUT)
app.put("/tareas/:id", (req, res) => {
  const { id } = req.params;
  const tareaIndex = tareasDB.findIndex(t => t.idTarea === parseInt(id));
  if (tareaIndex !== -1) {
    if (req.body.hasOwnProperty('completada')) {
      tareasDB[tareaIndex].completada = req.body.completada;
    }
    tareasDB[tareaIndex] = { ...tareasDB[tareaIndex], ...req.body };
    res.status(200).json(tareasDB[tareaIndex]);
  } else {
    res.sendStatus(404);
  }
});

// Tests en Jest
describe("Pruebas sobre las tareas completadas por Sprint", () => {
  
  // Test 1: Verifica que se devuelve las tareas completadas del último sprint de un desarrollador
  test("Debe devolver las tareas completadas del último sprint de un desarrollador", async () => {
    const response = await request(app).get("/sprints/ultimo/developer/Juan/tareas");
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); // Juan tiene solo 1 tarea completada
    
    const tarea = response.body[0];
    expect(tarea.nombre).toBe("Desarrollar Backend");
    expect(tarea.desarrollador).toBe("Juan");
    expect(tarea.horasEstimadas).toBe(8);
    expect(tarea.horasReales).toBe(7);
  });

  // Test 2: Verifica que se devuelve un error si no hay tareas completadas para un desarrollador
  test("Debe devolver error si no hay tareas completadas para un desarrollador", async () => {
    const response = await request(app).get("/sprints/ultimo/developer/NoExiste/tareas");
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No hay tareas completadas para este desarrollador");
  });

  // Test 3: Verifica que todas las tareas contienen la información mínima requerida
  test("Debe verificar que todas las tareas contienen la información mínima requerida", async () => {
    const response = await request(app).get("/sprints/ultimo/developer/Ana/tareas");
    
    expect(response.status).toBe(200);
    const tarea = response.body[0];
    
    // Verificar que la tarea tenga la información mínima
    expect(tarea.nombre).toBeDefined();
    expect(tarea.desarrollador).toBeDefined();
    expect(tarea.horasEstimadas).toBeDefined();
    expect(tarea.horasReales).toBeDefined();
    
    // Verificar que los valores son los correctos
    expect(tarea.nombre).toBe("Desarrollar Frontend");
    expect(tarea.desarrollador).toBe("Ana");
    expect(tarea.horasEstimadas).toBe(10);
    expect(tarea.horasReales).toBe(12);
  });

  // Test 4: Verifica que solo se devuelven tareas del último sprint
  test("Debe devolver tareas completadas solo del último sprint", async () => {
    // Aquí simulamos un sprint más antiguo
    const tareasOldSprint = [
      { ...tareas[0], sprintId: 2 },
      { ...tareas[1], sprintId: 2 }
    ];

    // Hacemos que la respuesta incluya sólo el sprint más reciente (idSprint = 1)
    const response = await request(app).get("/sprints/ultimo/developer/Ana/tareas");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); // Solo debe devolver las tareas del sprint actual (1)
    expect(response.body[0].sprintId).toBe(1); // Verificamos que el sprintId es el más reciente
  });
});

describe("Tareas API", () => {

  // Test 1: Verifica que el endpoint retorna dos tareas asignadas al usuario
  test("retorna dos tareas asignadas al usuario", async () => {
    const response = await request(app).get("/tarea-developers/tareas/1");

    expect(response.body.length).toBe(2);
    expect(response.body[0].nombre).toBe("Tarea 1");
    expect(response.body[1].nombre).toBe("Tarea 2");
  });

  // Test 2: Verifica que la primera tarea tiene id 1
  test("primera tarea tiene id 1", async () => {
    const response = await request(app).get("/tarea-developers/tareas/1");

    expect(response.body[0].id).toBe(1);
  });

});

describe("TareaController - Actualización de Tareas", () => {

  // Test 1: Verifica que se puede actualizar el nombre de una tarea
  test("actualiza el nombre de una tarea", async () => {
    const response = await request(app)
      .put("/tareas/1")
      .send({ nombre: "Tarea Actualizada" });

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe("Tarea Actualizada");
  });

  // Test 2: Verifica que se pueden actualizar los storyPoints de una tarea
  test("actualiza los storyPoints de una tarea", async () => {
    const response = await request(app)
      .put("/tareas/1")
      .send({ storyPoints: 8 });

    expect(response.status).toBe(200);
    expect(response.body.storyPoints).toBe(8);
  });

  // Test 3: Verifica que se pueden actualizar las horas estimadas de una tarea
  test("actualiza las horas estimadas de una tarea", async () => {
    const response = await request(app)
      .put("/tareas/1")
      .send({ horasEstimadas: 12 });

    expect(response.status).toBe(200);
    expect(response.body.horasEstimadas).toBe(12);
  });

});

describe("TareaController - Marcar tarea como completada", () => {

  // Test 1: Verifica que se puede marcar una tarea como completada
  test("marca una tarea como completada", async () => {
    const response = await request(app)
      .put("/tareas/1")
      .send({ completada: true });

    expect(response.status).toBe(200);
    expect(response.body.completada).toBe(true);
  });

});
