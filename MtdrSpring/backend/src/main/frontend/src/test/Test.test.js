import request from "supertest";
import API_DEVELOPER from "../API_DEVELOPER";
import Calendar from "../components/Calendar";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Asegúrate de agregar esto
import API_TAREA from '../API_Tarea';

// Rutas de la API
const API_EQUIPO = "/equipos";
const API_ESTADO = "/estados";
const API_MANAGER = "/managers";
const API_PRIORIDAD = "/prioridades";
const API_SPRINT = "/sprints";
const API_TAREATest = "/tareas";
const API_LIST = "/todolist";
test("Jest funciona correctamente", () => {
  expect(1 + 1).toBe(2);
});

test("API_DEVELOPER contiene el endpoint correcto", () => {
  expect(API_DEVELOPER).toBe("/developers");
});

it("verificar API DEVELOPERS", async () => {
  const response = await request("http://localhost:8080").get("/developers");

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);
});

// Pruebas para verificar las rutas de la API
it("verificar API EQUIPOS", async () => {
  const response = await request("http://localhost:8080").get(API_EQUIPO);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});


it("verificar API MANAGERS", async () => {
  const response = await request("http://localhost:8080").get(API_MANAGER);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});

it("verificar API PRIORIDADES", async () => {
  const response = await request("http://localhost:8080").get(API_PRIORIDAD);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});

it("verificar API SPRINTS", async () => {
  const response = await request("http://localhost:8080").get(API_SPRINT);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});

it("verificar API TAREAS", async () => {
  const response = await request("http://localhost:8080").get(API_TAREATest);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});

it("verificar API TODOLIST", async () => {
  const response = await request("http://localhost:8080").get(API_LIST);

  // Imprime el cuerpo de la respuesta JSON
  console.log(response.body);

  // Verifica que la respuesta sea JSON
  expect(response.headers["content-type"]).toContain("application/json");
});

describe("Calendar", () => {
  it("renderizar el componente Calendar", () => {
    // Renderiza el componente Calendar
    render(<Calendar />);
  });
});

