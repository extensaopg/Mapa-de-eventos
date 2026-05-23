const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    telefone: String,
    senha: String,

    ativo: { type: Boolean, default: false },
    token_ativacao: String,

    reset_token: String,
    reset_expira: Date
})

module.exports = mongoose.model('Usuario', UsuarioSchema)