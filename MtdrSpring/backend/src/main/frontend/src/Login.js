import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'; // Asegúrate de tener este archivo CSS para estilos


const Login = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/login?telefono=${telefono}&contrasena=${contrasena}`
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

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
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
