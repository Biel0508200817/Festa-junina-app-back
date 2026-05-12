require('dotenv').config();

const express = require('express');
const cors = require('cors');

const produtosRouter = require('./routers/produtos');

const app = express();

app.use(cors());
app.use(express.json());

// TESTE
app.get('/', (req, res) => {
    res.json({
        status: 'API online'
    });
});

// ROTAS
app.use('/api/produtos', produtosRouter);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada'
    });
});

// ERROS
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: err.message || 'Erro interno'
    });
});

module.exports = app;
