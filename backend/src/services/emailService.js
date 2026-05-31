const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// roda UMA vez só (debug opcional)
transporter.verify()
    .then(() => console.log("SMTP OK"))
    .catch(err => console.log("SMTP ERRO:", err))


async function enviarEmailAtivacao(email, token) {
    try {
        const link = `${process.env.FRONTEND_URL}/ativar-conta?token=${token}`

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Ativação da conta - Mapa de Eventos',
            text: `Clique para ativar sua conta: ${link}`
        })

        console.log("EMAIL ENVIADO:", info.messageId)

    } catch (err) {
        console.error("ERRO AO ENVIAR EMAIL ATIVAÇÃO:", err)
    }
}

async function enviarEmailReset(email, token) {
    try {
        const link = `${process.env.FRONTEND_URL}/reset-senha?token=${token}`

        const info = await transporter.sendMail({
            from: `"Mapa de Eventos" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Redefinição de Senha',
            html: `
                <h2>Redefinição de Senha</h2>
                <a href="${link}">Redefinir senha</a>
                <p>Expira em 1 hora.</p>
            `
        })

        console.log("EMAIL RESET ENVIADO:", info.messageId)

    } catch (err) {
        console.error("ERRO AO ENVIAR EMAIL RESET:", err)
    }
}

module.exports = {
    enviarEmailAtivacao,
    enviarEmailReset
}