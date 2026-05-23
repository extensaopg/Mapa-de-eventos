const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function enviarEmailAtivacao(email, token) {
    const link = `http://localhost:5173/ativar-conta?token=${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Ativação da conta - Mapa de Eventos',
        text: `Clique para ativar sua conta: ${link}`
    })
}

async function enviarEmailReset(email, token) {
    const link = `http://localhost:5173/reset-senha?token=${token}`

    await transporter.sendMail({
        from: `"Mapa de Eventos" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Redefinição de Senha',
        html: `
            <h2>Redefinição de Senha</h2>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${link}">Redefinir senha</a>
            <p>Esse link expira em 1 hora.</p>
        `
    })
}
module.exports = {
    enviarEmailAtivacao,
    enviarEmailReset
}