import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do build em produção
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../dist')));
  console.log('Servindo arquivos estáticos de:', path.join(__dirname, '../dist'));
}

const DATA_PATH = {
  projetos: "projetos.json",
  paineis: "paineis.json",
  gabinetes: "gabinetes.json",
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Projetos
app.get("/api/projetos", (req, res) => {
  res.json(readJson(DATA_PATH.projetos));
});
app.post("/api/projetos", (req, res) => {
  writeJson(DATA_PATH.projetos, req.body);
  // Remover painéis de projetos que não existem mais
  const projetosAtuais = req.body.map((p) => p.nome);
  const paineis = readJson(DATA_PATH.paineis);
  const paineisFiltrados = paineis.filter((p) =>
    projetosAtuais.includes(p.projeto)
  );
  writeJson(DATA_PATH.paineis, paineisFiltrados);
  res.json({ ok: true });
});

// Paineis
app.get("/api/paineis", (req, res) => {
  res.json(readJson(DATA_PATH.paineis));
});
app.post("/api/paineis", (req, res) => {
  writeJson(DATA_PATH.paineis, req.body);
  res.json({ ok: true });
});

// Gabinetes
app.get("/api/gabinetes", (req, res) => {
  res.json(readJson(DATA_PATH.gabinetes));
});
app.post("/api/gabinetes", (req, res) => {
  writeJson(DATA_PATH.gabinetes, req.body);
  res.json({ ok: true });
});

// Eventos (derivado de projetos)
app.get("/api/eventos", (req, res) => {
  const projetos = readJson(DATA_PATH.projetos);
  // Considera dataEntrega como data do evento
  const eventos = projetos
    .filter((p) => p.dataEntrega && p.nome)
    .map((p) => ({ data: p.dataEntrega, nome: p.nome }));
  res.json(eventos);
});

// Rota catch-all para servir o React em produção
if (isProduction) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      console.log('Servindo index.html para:', req.path);
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend rodando em http://0.0.0.0:${PORT}`);
});
