require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET não definido. Configure JWT_SECRET no ambiente do backend.');
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

require('./database/database');

// Garante que o e-mail oficial da Nana & Mimi tenha uma conta de administrador.
function garantirAdministradorOficial() {
  const db = require('./database/database');
  const email = (process.env.NANA_MIMI_ADMIN_EMAIL || 'nanaemimimodainfantil@gmail.com').toLowerCase();
  const senha = process.env.NANA_MIMI_ADMIN_PASSWORD || 'NanaMimi123';
  const existente = db.prepare('SELECT id FROM funcionarios WHERE email = ?').get(email);

  if (!existente) {
    const senhaHash = bcrypt.hashSync(senha, 10);
    db.prepare(
      'INSERT INTO funcionarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)'
    ).run('Nana & Mimi', email, senhaHash, 'admin');
    console.log(`🔐 Administrador oficial criado: ${email}`);
  }
}

garantirAdministradorOficial();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Render fica atrás de um proxy HTTPS. Isso faz req.protocol reconhecer HTTPS.
app.set('trust proxy', 1);


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://1fjstwfyh-35hecb1pr-laurabrilhante1.vercel.app',
  'https://1fjstwfyh-gs8bw2fze-laurabrilhante1.vercel.app',
  'https://delta-tan-40.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === origin || /^https:\/\/[^/]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    console.log('❌ Origem bloqueada pelo CORS:', origin);
    return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'API Nana & Mimi está funcionando!'
  });
});

const { seed } = require('./database/seed');
seed();

app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Nana & Mimi rodando na porta ${PORT}`);
  console.log(`📦 API disponível em /health`);
});
