// Imagens originais do projeto.
// O backend usa esses mesmos nomes no seed; quando a imagem ainda não estiver
// no /uploads do Render, usamos a cópia local para que a loja continue exibindo.
import produto1 from './assets/produto1.png';
import produto2 from './assets/produto2.png';
import produto3 from './assets/produto3.png';
import produto4 from './assets/produto4.png';
import produto5 from './assets/produto5.jpeg';
import produto6 from './assets/produto6.jpeg';
import produto7 from './assets/produto7.jpeg';
import produto8 from './assets/produto8.jpeg';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

const imagensLocais = {
  'produto1.png': produto1,
  'produto2.png': produto2,
  'produto3.png': produto3,
  'produto4.png': produto4,
  'produto5.jpeg': produto5,
  'produto6.jpeg': produto6,
  'produto7.jpeg': produto7,
  'produto8.jpeg': produto8,
};

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const caminho = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_URL}${caminho}`, config);

  let data = {};
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw {
      status: response.status,
      ...(typeof data === 'object' ? data : { erro: data }),
    };
  }

  return data;
}

export function formatarPreco(valor) {
  const num = Number(valor);
  if (Number.isNaN(num)) return 'R$ 0,00';

  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Converte imagens do backend para HTTPS e, para os 8 produtos originais,
 * usa as imagens que já estão no frontend.
 */
export function normalizarImagem(url) {
  if (!url) return null;

  const texto = String(url);
  const nomeArquivo = decodeURIComponent(
    texto.split('?')[0].split('/').pop() || ''
  );

  if (imagensLocais[nomeArquivo]) {
    return imagensLocais[nomeArquivo];
  }

  if (texto.startsWith('http://back-ahgw.onrender.com')) {
    return texto.replace(/^http:\/\//, 'https://');
  }

  return texto;
}

export { API_URL };
export default apiFetch;
