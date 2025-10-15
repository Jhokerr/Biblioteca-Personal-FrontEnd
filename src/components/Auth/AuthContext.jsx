import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configurar axios con el token
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Asegurarse de que axios tenga el token
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axiosInstance.get('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const response = await axiosInstance.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Response:', error.response);
      
      let errorMessage = 'Error al registrarse';
      
      if (error.response?.data?.errors) {
        // Errores de validación de Laravel
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const login = async (email, password) => {
  try {
    console.log('Intentando login con:', email);
    
    const response = await axiosInstance.post('/login', {
      email,
      password,
    });
    
    console.log('Respuesta del login:', response.data);
    
    const { token: newToken, user: newUser } = response.data;
    
    if (!newToken) {
      throw new Error('No se recibió token del servidor');
    }
    
    // Guardar token
    localStorage.setItem('token', newToken);
    console.log('✅ Token guardado en localStorage');
    
    // Actualizar axios
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    console.log('✅ Axios actualizado con token');
    
    setToken(newToken);
    setUser(newUser);
    
    console.log('✅ LOGIN EXITOSO');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error en login:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Error al iniciar sesión' 
    };
  }
};

  const logout = async () => {
    try {
      if (token) {
        await axiosInstance.post('/logout');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};