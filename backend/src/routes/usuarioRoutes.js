const express = require('express')
const router = express.Router()

const {
    criarUsuario,
    ativarConta
} = require('../controllers/usuarioController')

router.post('/', criarUsuario)
router.get('/ativar/:token', ativarConta)

module.exports = router