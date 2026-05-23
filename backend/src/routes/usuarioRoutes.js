const express = require('express')
const router = express.Router()

const {
    criarUsuario,
    ativarConta,
    login
} = require('../controllers/usuarioController')

router.post('/', criarUsuario)
router.get('/ativar/:token', ativarConta)
router.post('/login', login)

module.exports = router