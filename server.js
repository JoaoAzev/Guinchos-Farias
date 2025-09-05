// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // pasta onde ficará seu HTML

// rota para cadastrar chamado
app.post('/cadastrar', (req, res) => {
    const { placa, marca, modelo, nomeCliente, idMotorista } = req.body;

    console.log("Chamado recebido:", req.body);

    // aqui você pode salvar em banco de dados, ex: sqlite ou postgres
    // por enquanto, só devolve sucesso
    res.json({ message: "Chamado cadastrado com sucesso!" });
});

// inicializa servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
