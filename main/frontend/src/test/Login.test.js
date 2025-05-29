import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {

  // Test 1: Verifica que se navega a la página /App en un inicio de sesión exitoso
  test("navigates to /App on successful login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );

    renderWithRouter(<Login />);
    const telefonoInput = screen.getByLabelText(/Teléfono/i);
    const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByText(/Ingresar/i);

    fireEvent.change(telefonoInput, { target: { value: "1234567890" } });
    fireEvent.change(contrasenaInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/App"));
  });

    // Test 2: Verifica que los campos de entrada aceptan texto
    test("allows input in the phone and password fields", () => {
        renderWithRouter(<Login />);
        const telefonoInput = screen.getByLabelText(/Teléfono/i);
        const contrasenaInput = screen.getByLabelText(/Contraseña/i);
    
        fireEvent.change(telefonoInput, { target: { value: "1234567890" } });
        fireEvent.change(contrasenaInput, { target: { value: "password123" } });
    
        expect(telefonoInput.value).toBe("1234567890");
        expect(contrasenaInput.value).toBe("password123");
      });

       // Test 3: Verifica que se muestra un mensaje de error si el teléfono es inválido
  test("shows error message for invalid phone number", async () => {
    renderWithRouter(<Login />);
    const telefonoInput = screen.getByLabelText(/Teléfono/i);
    const submitButton = screen.getByText(/Ingresar/i);

    fireEvent.change(telefonoInput, { target: { value: "abc" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        /El número de teléfono solo debe contener números./i
      )
    ).toBeInTheDocument();
  });

    // Test 4: Verifica que se muestra un mensaje de error si el teléfono es demasiado corto
    test("shows error message for short phone number", async () => {
        renderWithRouter(<Login />);
        const telefonoInput = screen.getByLabelText(/Teléfono/i);
        const submitButton = screen.getByText(/Ingresar/i);
    
        fireEvent.change(telefonoInput, { target: { value: "12345" } });
        fireEvent.click(submitButton);
    
        expect(
          await screen.findByText(/El número de teléfono debe tener al menos 10 dígitos./i)
        ).toBeInTheDocument();
      });

        // Test 5: Verifica que se muestra un mensaje de error si la contraseña está vacía
        test("shows error message for empty password", async () => {
            renderWithRouter(<Login />);
            const telefonoInput = screen.getByLabelText(/Teléfono/i);
            const submitButton = screen.getByText(/Ingresar/i);
          
            fireEvent.change(telefonoInput, { target: { value: "1234567890" } });
            fireEvent.click(submitButton);
          
            expect(
              await screen.findByText((content) =>
                content.includes("La contraseña es obligatoria.")
              )
            ).toBeInTheDocument();
          });
});

