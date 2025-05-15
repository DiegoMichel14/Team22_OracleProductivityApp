import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'; 


const Login = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validaciones básicas antes de enviar la solicitud
    if (!/^\d+$/.test(telefono)) {
      setError('El número de teléfono solo debe contener números.');
      return;
    }

    if (telefono.length < 10) {
      setError('El número de teléfono debe tener al menos 10 dígitos.');
      return;
    }

    if (!contrasena) {
      setError('La contraseña es obligatoria.');
      return;
    }

    try {
      const response = await fetch(
        `http://140.84.170.157:8080/login?telefono=${telefono}&contrasena=${contrasena}`
      );

      if (response.ok) {
        navigate('/App');
      } else {
        setError('Teléfono o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setTelefono(value);
      setError('');
    } else {
      setError('Solo se permiten números en el campo teléfono.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="text"
            value={telefono}
            onChange={handleTelefonoChange}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;