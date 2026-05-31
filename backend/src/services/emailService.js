const nodemailer = require('nodemailer')

const login = process.env.EMAIL_USER
const password = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: login,
        pass: password
    }
})

async function sendEmail(destination, subject, body, isHtml = false) {
    try {
        const info = await transporter.sendMail({
            from: `"Mapa de Eventos" <${login}>`,
            to: destination,
            subject,
            [isHtml ? 'html' : 'text']: body
        })

        console.log('EMAIL ENVIADO:', info.messageId)
        return true
    } catch (err) {
        console.error('ERRO AO ENVIAR EMAIL:', err)
        return false
    }
}

async function enviarEmailAtivacao(email, token) {
    const link = `${process.env.FRONTEND_URL}/ativar-conta?token=${token}`

    const html = `
        <h2>Ativação de Conta</h2>
        <p>Clique no link abaixo para ativar sua conta:</p>
        <a href="${link}">${link}</a>
    `

    return sendEmail(email, 'Ativação da conta - Mapa de Eventos', html, true)
}

async function enviarEmailReset(email, token) {
    const link = `${process.env.FRONTEND_URL}/reset-senha?token=${token}`

    const html = `
        <h2>Redefinição de Senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">${link}</a>
        <p>Esse link expira em 1 hora.</p>
    `

    return sendEmail(email, 'Redefinição de Senha', html, true)
}

module.exports = {
    enviarEmailAtivacao,
    enviarEmailReset
}