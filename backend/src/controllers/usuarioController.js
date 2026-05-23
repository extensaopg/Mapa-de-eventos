const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Usuario = require('../models/Usuario')
const { enviarEmailAtivacao, enviarEmailReset } = require('../services/emailService')

async function criarUsuario(req, res) {
    try {
        const { nome, email, telefone, senha } = req.body

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: 'Nome, email e senha são obrigatórios'
            })
        }

        const existente = await Usuario.findOne({ email })

        if (existente) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const token = crypto.randomBytes(32).toString('hex')

        await Usuario.create({
            nome,
            email,
            telefone,
            senha: senhaHash,
            ativo: false,
            token_ativacao: token
        })

        await enviarEmailAtivacao(email, token)

        return res.status(201).json({
            message: 'Usuário criado! Verifique seu email para ativar a conta.'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro ao criar usuário'
        })
    }
}

async function ativarConta(req, res) {
    try {
        const { token } = req.params

        const user = await Usuario.findOne({ token_ativacao: token })

        if (!user) {
            return res.status(400).json({
                message: 'Token inválido'
            })
        }

        user.ativo = true
        user.token_ativacao = null

        await user.save()

        return res.json({
            message: 'Conta ativada com sucesso'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro ao ativar conta'
        })
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({
                message: 'Email e senha são obrigatórios'
            })
        }

        const user = await Usuario.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: 'Usuário não encontrado'
            })
        }

        if (!user.ativo) {
            return res.status(401).json({
                message: 'Conta não ativada'
            })
        }

        const senhaOk = await bcrypt.compare(senha, user.senha)

        if (!senhaOk) {
            return res.status(401).json({
                message: 'Senha inválida'
            })
        }

        req.session.user = {
            id: user._id,
            nome: user.nome,
            email: user.email
        }

        return res.json({
            message: 'Login realizado com sucesso'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro no login'
        })
    }
}

async function esqueciSenha(req, res) {
    try {
        const { email } = req.body

        const user = await Usuario.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'Email não encontrado'
            })
        }

        const token = crypto.randomBytes(32).toString('hex')

        const expira = new Date()
        expira.setHours(expira.getHours() + 1)

        user.reset_token = token
        user.reset_expira = expira

        await user.save()

        await enviarEmailReset(email, token)

        return res.json({
            message: 'Email enviado com instruções de recuperação'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro ao processar solicitação'
        })
    }
}

async function resetSenha(req, res) {
    try {
        const { token } = req.params
        const { senha } = req.body

        const user = await Usuario.findOne({ reset_token: token })

        if (!user) {
            return res.status(400).json({
                message: 'Token inválido'
            })
        }

        if (new Date() > user.reset_expira) {
            return res.status(400).json({
                message: 'Token expirado'
            })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        user.senha = senhaHash
        user.reset_token = null
        user.reset_expira = null

        await user.save()

        return res.json({
            message: 'Senha alterada com sucesso'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro ao redefinir senha'
        })
    }
}

async function me(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: 'Não autenticado'
            })
        }

        return res.json(req.session.user)

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Erro ao buscar usuário'
        })
    }
}

module.exports = {
    criarUsuario,
    ativarConta,
    login,
    esqueciSenha,
    resetSenha,
    me
}