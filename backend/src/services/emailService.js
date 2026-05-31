const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

async function enviarEmailAtivacao(email, token) {
    try {
        const link = `${process.env.FRONTEND_URL}/ativar-conta?token=${token}`

        const data = await resend.emails.send({
            from: 'Mapa de Eventos <onboarding@resend.dev>',
            to: email,
            subject: 'Ativação da conta - Mapa de Eventos',
            html: `
                <h2>Ativação de Conta</h2>
                <p>Clique no link abaixo para ativar sua conta:</p>
                <a href="${link}">${link}</a>
            `
        })

        console.log("EMAIL ENVIADO:", data)

    } catch (err) {
        console.error("ERRO AO ENVIAR EMAIL:", err)
    }
}

async function enviarEmailReset(email, token) {
    try {
        const link = `${process.env.FRONTEND_URL}/reset-senha?token=${token}`

        const data = await resend.emails.send({
            from: 'Mapa de Eventos <onboarding@resend.dev>',
            to: email,
            subject: 'Redefinição de Senha',
            html: `
                <h2>Redefinição de Senha</h2>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <a href="${link}">${link}</a>
                <p>Esse link expira em 1 hora.</p>
            `
        })

        console.log("EMAIL RESET ENVIADO:", data)

    } catch (err) {
        console.error("ERRO AO ENVIAR EMAIL RESET:", err)
    }
}

module.exports = {
    enviarEmailAtivacao,
    enviarEmailReset
}