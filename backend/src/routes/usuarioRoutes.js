const express = require('express')
const router = express.Router()

const {
    criarUsuario,
    ativarConta,
    login,
    esqueciSenha,
    resetSenha,
    me,
    logout
} = require('../controllers/usuarioController')

router.post('/', criarUsuario)
router.get('/ativar/:token', ativarConta)
router.post('/login', login)
router.post('/esqueci-senha', esqueciSenha)
router.post('/reset-senha/:token', resetSenha)
router.get('/me', me)
router.post('/logout', logout)

module.exports = router