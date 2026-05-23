const mongoose = require('mongoose')

const EventoSchema = new mongoose.Schema({
    descricao: String,
    data_inicio: Date,
    data_fim: Date,
    latitude: Number,
    longitude: Number
})

module.exports = mongoose.model('Evento', EventoSchema)