const Brevo = require('@getbrevo/brevo')

const apiInstance = new Brevo.TransactionalEmailsApi()

const apiKey = Brevo.ApiClient.instance.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY


async function sendEmail(destination, subject, body) {
    try {
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.EMAIL_USER,
                name: "Mapa de Eventos"
            },
            to: [{ email: destination }],
            subject,
            htmlContent: body
        })

        console.log("EMAIL ENVIADO VIA BREVO")
        return true

    } catch (err) {
        console.error("ERRO BREVO:", err)
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