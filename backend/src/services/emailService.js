const nodemailer = require('nodemailer')

class EmailService {
    constructor() {
        this.login = process.env.EMAIL_USER
        this.password = process.env.EMAIL_PASS

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.login,
                pass: this.password
            }
        })
    }

    async sendEmail(destination, subject, body, isHtml = false) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Mapa de Eventos" <${this.login}>`,
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

    async enviarEmailAtivacao(email, token) {
        const link = `${process.env.FRONTEND_URL}/ativar-conta?token=${token}`

        const html = `
            <h2>Ativação de Conta</h2>
            <p>Clique no link abaixo para ativar sua conta:</p>
            <a href="${link}">${link}</a>
        `

        return this.sendEmail(email, 'Ativação da conta - Mapa de Eventos', html, true)
    }

    async enviarEmailReset(email, token) {
        const link = `${process.env.FRONTEND_URL}/reset-senha?token=${token}`

        const html = `
            <h2>Redefinição de Senha</h2>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${link}">${link}</a>
            <p>Esse link expira em 1 hora.</p>
        `

        return this.sendEmail(email, 'Redefinição de Senha', html, true)
    }
}

module.exports = new EmailService()