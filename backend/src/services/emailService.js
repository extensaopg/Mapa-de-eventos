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

module.exports = {
    enviarEmailAtivacao
}