import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./assets/logo.jpg";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!usuario.trim() || !senha) {
      setErro("Preencha o usuário/e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);
      await login(usuario.trim(), senha);
      navigate("/");
    } catch (err) {
      if (err?.erro) {
        setErro(err.erro);
      } else {
        setErro("Não foi possível conectar ao servidor. Verifique se o backend está funcionando.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page-container">
      <Link to="/" className="btn-voltar-home">
        ← Voltar para o Início
      </Link>

      <section className="login-section">
        <div className="boas-vindas">
          <img src={logo} alt="Logo" />
          <h2>
            Bem-vindo de volta! Por favor, insira seus dados para acessar sua conta.
          </h2>
        </div>

        <form className="grupo-input" onSubmit={lidarComLogin}>
          <h1>Login</h1>

          <label htmlFor="username">Usuário ou E-mail:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setErro("");
            }}
            required
          />

          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
            required
          />

          {erro && <span className="erro-mensagem">{erro}</span>}

          <button
            type="submit"
            className="btn-enviar-login"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
