import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'; 


const Login = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  
  // Add an effect to ensure the body takes full width for the login page
  useEffect(() => {
    // Add a class to the body specifically for the login page
    document.body.classList.add('login-page');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

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
        `/login?telefono=${telefono}&contrasena=${contrasena}`
      );

      if (response.ok) {
        navigate('/dashboard');
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
        <img 
          src="/oracle-logo.png" 
          alt="Oracle Logo" 
          className="login-logo" 
          onError={(e) => {
            e.target.src = "https://www.oracle.com/a/ocom/img/oracle-logo.svg";
            e.target.style.width = "160px";
          }}
        />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="telefono">Username</label>
            <input
              id="telefono"
              type="text"
              value={telefono}
              onChange={handleTelefonoChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="contrasena">Password</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">Log in</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;