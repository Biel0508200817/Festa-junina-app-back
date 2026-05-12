const express = require('express');
const router = express.Router();
const db = require('../data/supabase');

// ============================
// LISTAR TODOS OS PRODUTOS
// ============================
router.get('/', async (req, res, next) => {
    const { categoriaId } = req.query;

    try {
        let { data: itens_festa, error } = await db
            .from('itens_festa')
            .select('*');

        if (error) throw error;

        // Filtro opcional por categoria
        if (categoriaId) {
            itens_festa = itens_festa.filter(
                p => p.categoriaId === parseInt(categoriaId)
            );
        }

        res.json(itens_festa);

    } catch (error) {
        next(error);
    }
});

// ============================
// BUSCAR PRODUTO POR ID
// ============================
router.get('/:id', async (req, res, next) => {
    try {
        const { data: produto, error } = await db
            .from('itens_festa')
            .select('*')
            .eq('id', parseInt(req.params.id))
            .single();

        if (error) throw error;

        res.json(produto);

    } catch (error) {
        next(error);
    }
});

// ============================
// ADICIONAR NOVO PRODUTO
// ============================
router.post('/', async (req, res, next) => {
    const {
        categoriaId,
        nome,
        descricao,
        preco,
        image
    } = req.body;

    try {

        if (!nome || !preco) {
            return res.status(400).json({
                error: 'Nome e preço são obrigatórios'
            });
        }

        const { data, error } = await db
            .from('itens_festa')
            .insert([
                {
                    categoriaId: categoriaId
                        ? parseInt(categoriaId)
                        : null,
                    nome,
                    descricao,
                    preco,
                    image
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);

    } catch (error) {
        next(error);
    }
});

// ============================
// ATUALIZAR PRODUTO
// ============================
router.put('/:id', async (req, res, next) => {

    const itens_festaId = parseInt(req.params.id);

    const {
        nome,
        descricao,
        preco,
        image,
        categoriaId
    } = req.body;

    try {

        const { data, error } = await db
            .from('itens_festa')
            .update({
                nome,
                descricao,
                preco,
                image,
                categoriaId
            })
            .eq('id', itens_festaId)
            .select();

        if (error) throw error;

        if (!data.length) {
            return res.status(404).json({
                error: 'Produto não encontrado'
            });
        }

        res.json(data[0]);

    } catch (error) {
        next(error);
    }
});

// ============================
// DELETAR PRODUTO
// ============================
router.delete('/:id', async (req, res, next) => {

    const itens_festaId = parseInt(req.params.id);

    try {

        const { data, error } = await db
            .from('itens_festa')
            .delete()
            .eq('id', itens_festaId)
            .select();

        if (error) throw error;

        if (!data.length) {
            return res.status(404).json({
                error: 'Produto não encontrado'
            });
        }

        res.json({
            message: 'Item de festa deletado com sucesso'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
