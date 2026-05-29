const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const {
    criarStand,
    listarStands,
    buscarStandPorId,
    buscarStands,
    atualizarStand,
    deletarStand,
    deletarStandsPorEvento
} = require('../controllers/standController')

// Busca por texto — deve vir ANTES de /:id para não ser capturada como parâmetro
router.get('/buscar', buscarStands)

// Leitura pública
router.get('/', listarStands)
router.get('/:id', buscarStandPorId)

// Escrita protegida por sessão
router.post('/', auth, criarStand)
router.put('/:id', auth, atualizarStand)
router.delete('/', auth, deletarStandsPorEvento)   // DELETE /stands?eventoId=<id>
router.delete('/:id', auth, deletarStand)          // DELETE /stands/:id

module.exports = router
