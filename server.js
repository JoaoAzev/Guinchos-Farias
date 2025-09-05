// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // pasta onde ficará seu HTML

// inicializa banco sqlite
const db = new sqlite3.Database('./chamados.db', (err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco:", err.message);
    } else {
        console.log("✅ Conectado ao SQLite");
    }
});

// cria tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS chamados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        placa TEXT,
        marca TEXT,
        modelo TEXT,
        nomeCliente TEXT,
        idMotorista TEXT,
        dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// rota para cadastrar chamado
app.post('/cadastrar', (req, res) => {
    const { placa, marca, modelo, nomeCliente, idMotorista } = req.body;

    if (!placa || !marca || !modelo || !nomeCliente || !idMotorista) {
        return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const query = `
        INSERT INTO chamados (placa, marca, modelo, nomeCliente, idMotorista)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [placa, marca, modelo, nomeCliente, idMotorista], function(err) {
        if (err) {
            console.error("Erro ao inserir chamado:", err.message);
            res.status(500).json({ error: "Erro ao cadastrar chamado." });
        } else {
            console.log("Chamado cadastrado com ID:", this.lastID);
            res.json({ message: "Chamado cadastrado com sucesso!", id: this.lastID });
        }
    });
});

// rota para listar chamados
app.get('/chamados', (req, res) => {
    db.all("SELECT * FROM chamados ORDER BY dataCadastro DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Erro ao buscar chamados." });
        } else {
            res.json(rows);
        }
    });
});

// inicializa servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
