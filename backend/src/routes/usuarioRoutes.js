const express = require('express')
const router = express.Router()

const {
    criarUsuario,
    ativarConta,
    login,
    esquecisSenha,
    resetSenha
} = require('../controllers/usuarioController')

router.post('/', criarUsuario)
router.get('/ativar/:token', ativarConta)
router.post('/login', login)
router.post('/esqueci-senha', esqueciSenha)
router.post('/reset-senha/:token', resetSenha)

module.exports = router