const express = require('express');

const router = express.Router();

const {
    criarEvento,
    listarEventos,
    buscarEventoPorId,
    atualizarEvento,
    deletarEvento
} = require('../controllers/eventoController');

router.post('/', criarEvento);

router.get('/', listarEventos);

router.get('/:id', buscarEventoPorId);

router.put('/:id', atualizarEvento);

router.delete('/:id', deletarEvento);

module.exports = router;