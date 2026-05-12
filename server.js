require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ================= MIDDLEWARES =================

app.use(cors());
app.use(express.json());

// ================= SUPABASE =================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

// ================= LOGGER =================

app.use((req, res, next) => {
    console.log(
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`
    );

    next();
});

// ================= TESTE =================

app.get('/', (req, res) => {
    res.json({
        status: 'API online'
    });
});

// ================= ROTAS =================

// 1. LISTAR TODOS OS ITENS
app.get('/api/itens_festa', async (req, res) => {

    const { data, error } = await supabase
        .from('itens_festa')
        .select('*');

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// 2. LISTAR CATEGORIAS
app.get('/api/categorias', async (req, res) => {

    const { data, error } = await supabase
        .from('categorias')
        .select('*');

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// 3. BUSCAR ITENS POR CATEGORIA
app.get('/api/itens_festa/categorias/:nomeCategoria', async (req, res) => {

    const { nomeCategoria } = req.params;

    const { data, error } = await supabase
        .from('itens_festa')
        .select('*')
        .ilike('categoria', nomeCategoria);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// 4. CRIAR ITEM
app.post('/api/itens_festa', async (req, res) => {

    const {
        nome,
        preco,
        categoria,
        descricao
    } = req.body;

    if (!nome || preco == null || !categoria) {

        return res.status(400).json({
            message: 'Nome, preço e categoria são obrigatórios.'
        });
    }

    const { data, error } = await supabase
        .from('itens_festa')
        .insert([
            {
                nome,
                preco,
                categoria,
                descricao
            }
        ])
        .select();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.status(201).json(data[0]);
});

// 5. ATUALIZAR ITEM
app.put('/api/itens_festa/:id', async (req, res) => {

    const { id } = req.params;

    const {
        nome,
        preco,
        categoria,
        descricao
    } = req.body;

    const { data, error } = await supabase
        .from('itens_festa')
        .update({
            nome,
            preco,
            categoria,
            descricao
        })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    if (!data.length) {

        return res.status(404).json({
            error: 'Item não encontrado.'
        });
    }

    res.json(data[0]);
});

// 6. DELETAR ITEM
app.delete('/api/itens_festa/:id', async (req, res) => {

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {

        return res.status(400).json({
            error: 'ID inválido.'
        });
    }

    const { data, error } = await supabase
        .from('itens_festa')
        .delete()
        .eq('id', id)
        .select();

    if (error) {

        return res.status(500).json({
            error: error.message
        });
    }

    if (!data.length) {

        return res.status(404).json({
            error: 'Item não encontrado.'
        });
    }

    res.json({
        message: 'Item deletado com sucesso.'
    });
});

// ================= 404 =================

app.use((req, res) => {

    res.status(404).json({
        error: 'Rota não encontrada.'
    });
});

// ================= 500 =================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        error: 'Erro interno do servidor.'
    });
});

module.exports = app;
