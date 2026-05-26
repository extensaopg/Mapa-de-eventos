const Evento = require('../models/Evento');

async function criarEvento(req, res) {
    try {
        const {
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude,
            administradores // Novo campo adicionado
        } = req.body

        const evento = await Evento.create({
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude,
            administradores // Salva os IDs dos usuários responsáveis
        })

        res.status(201).json({
            message: 'Evento criado com sucesso',
            id: evento._id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao criar evento' })
    }
}

async function listarEventos(req, res) {
    try {
        // O .populate() busca os dados do Usuário (nome e email) associados aos IDs
        const eventos = await Evento.find().populate('administradores', 'nome email')
        res.json(eventos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar eventos' })
    }
}

async function buscarEventoPorId(req, res) {
    try {
        const { id } = req.params

        // Adicionado o .populate() aqui também para a busca individual
        const evento = await Evento.findById(id).populate('administradores', 'nome email')

        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado' })
        }

        res.json(evento)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar evento' })
    }
}

async function atualizarEvento(req, res) {
    try {
        const { id } = req.params
        const {
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude,
            administradores // Novo campo adicionado
        } = req.body

        await Evento.findByIdAndUpdate(id, {
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude,
            administradores
        })

        res.json({ message: 'Evento atualizado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar evento' })
    }
}

async function deletarEvento(req, res) {
    try {
        const { id } = req.params
        await Evento.findByIdAndDelete(id)
        res.json({ message: 'Evento deletado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao deletar evento' })
    }
}

module.exports = {
    criarEvento,
    listarEventos,
    buscarEventoPorId,
    atualizarEvento,
    deletarEvento
};