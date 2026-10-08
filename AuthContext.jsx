import React, { createContext, useState, useContext, useEffect } from 'react';
import apiFetch from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      if (!token) {
        if (ativo) {
          setUsuario(null);
          setCarregando(false);
        }
        return;
      }

      setCarregando(true);

      try {
        const data = await apiFetch('/auth/me');
        if (ativo) setUsuario(data);
      } catch {
        localStorage.removeItem('token');
        if (ativo) {
          setToken(null);
          setUsuario(null);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, [token]);

  const salvarSessao = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
  };

  const login = async (email, senha) => {
    const emailNormalizado = String(email || '').trim().toLowerCase();
    const emailAdministrador = 'nanaemimimodainfantil@gmail.com';

    // O e-mail oficial da Nana & Mimi entra pela conta de funcionário/admin.
    const endpoint = emailNormalizado === emailAdministrador
      ? '/employees/login'
      : '/auth/login';

    const data = await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email: emailNormalizado, senha }),
    });

    salvarSessao(data);
    return data;
  };

  const cadastrar = async (nome, email, senha) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });
    salvarSessao(data);
    return data;
  };

  const loginFuncionario = async (email, senha) => {
    const data = await apiFetch('/employees/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    salvarSessao(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const isLogado = !!usuario;
  const isFuncionario = usuario?.tipo === 'funcionario';
  const isCliente = usuario?.tipo === 'cliente';
  const isAdministrador = isFuncionario && (usuario?.cargo === 'admin' || String(usuario?.email || '').toLowerCase() === 'nanaemimimodainfantil@gmail.com');

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        carregando,
        login,
        cadastrar,
        loginFuncionario,
        logout,
        isLogado,
        isFuncionario,
        isCliente,
        isAdministrador,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
