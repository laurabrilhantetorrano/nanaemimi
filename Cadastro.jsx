import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import logo from "./assets/logo.jpg";
import { useAuth } from "./AuthContext";

export default function Cadastro() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (usuario.trim().length < 2) {
      setErro("O usuário deve ter pelo menos 2 caracteres.");
      return;
    }

    if (!emailValido.test(email)) {
      setErro("Por favor, insira um e-mail válido (ex: nome@email.com).");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      await cadastrar(usuario.trim(), email.trim(), senha);
      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (err) {
      if (err?.status === 409) {
        setErro("Este e-mail já está cadastrado.");
      } else if (err?.erro) {
        setErro(err.erro);
      } else {
        setErro("Não foi possível conectar ao servidor. Verifique se o backend está funcionando.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page-container">
      <Link to="/" className="btn-voltar-home-cad">
        ← Voltar para o Início
      </Link>

      <section className="cadastro-section">
        <div className="boas-vindas-cad">
          <img src={logo} alt="Logo Nana & Mimi" />
          <h2>
            Bem-vindo! Por favor, insira seus dados para criar sua conta.
          </h2>
        </div>

        <form onSubmit={lidarComCadastro} className="grupo-input-cad">
          <h1>Cadastre-se</h1>

          <label htmlFor="username">Usuário:</label>
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

          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
            minLength={6}
            required
          />

          {erro && <span className="erro-mensagem">{erro}</span>}

          <button
            type="submit"
            className="btn-enviar-cad"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
