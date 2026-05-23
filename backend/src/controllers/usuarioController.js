const bcrypt = require('bcrypt')
const crypto = require('crypto')
const db = require('../database/connection')
const { enviarEmailAtivacao } = require('../services/emailService')

async function criarUsuario(req, res) {
    try {
        const { nome, email, telefone, senha } = req.body

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: 'Nome, email e senha são obrigatórios'
            })
        }

        // verifica duplicado
        const [existente] = await db.execute(
            'SELECT id FROM Usuario WHERE email = ?',
            [email]
        )

        if (existente.length > 0) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            })
        }

        // criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10)

        // gera token ativação
        const token = crypto.randomBytes(32).toString('hex')

        // salva usuário
        const sql = `
            INSERT INTO Usuario (nome, email, telefone, senha, ativo, token_ativacao)
            VALUES (?, ?, ?, ?, false, ?)
        `

        await db.execute(sql, [
            nome,
            email,
            telefone,
            senhaHash,
            token
        ])

        // envia email ativação
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
    console.log("ja ativou essa banana")
    try {
        const { token } = req.params

        const [user] = await db.execute(
            'SELECT id FROM Usuario WHERE token_ativacao = ?',
            [token]
        )

        if (user.length === 0) {
            return res.status(400).json({
                message: 'Token inválido'
            })
        }

        await db.execute(
            'UPDATE Usuario SET ativo = true, token_ativacao = NULL WHERE token_ativacao = ?',
            [token]
        )

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

        const [users] = await db.execute(
            'SELECT * FROM Usuario WHERE email = ?',
            [email]
        )

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Usuário não encontrado'
            })
        }

        const user = users[0]

        // verifica se está ativo
        if (!user.ativo) {
            return res.status(401).json({
                message: 'Conta não ativada'
            })
        }

        // valida senha
        const senhaOk = await bcrypt.compare(senha, user.senha)

        if (!senhaOk) {
            return res.status(401).json({
                message: 'Senha inválida'
            })
        }

        // cria sessão
        req.session.user = {
            id: user.id,
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

module.exports = {
    criarUsuario,
    ativarConta,
    login
}