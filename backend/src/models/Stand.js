const mongoose = require('mongoose')

const StandSchema = new mongoose.Schema({
    descricao: String,
    data_inicio: Date,
    data_fim: Date,
    latitude: Number,
    longitude: Number,
    cor_icone: String,

    eventoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento'
    }
})

module.exports = mongoose.model('Stand', StandSchema)