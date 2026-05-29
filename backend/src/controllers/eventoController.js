const Evento = require('../models/Evento');

async function criarEvento(req, res) {
    try {
        // 1. Verifica se o usuário está realmente logado antes de deixar criar
        if (!req.session.user) {
            return res.status(401).json({ message: 'Você precisa estar logado para criar um evento.' });
        }

        const { descricao, data_inicio, data_fim, latitude, longitude } = req.body;

        // 2. Cria o evento injetando o ID do usuário logado na lista de administradores
        const novoEvento = await Evento.create({
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude,
            administradores: [req.session.user.id] // 👈 O SEGREDO ESTÁ AQUI
        });

        return res.status(201).json({
            message: 'Evento criado com sucesso',
            id: novoEvento._id
        });

    } catch (error) {
        console.error('Erro ao criar evento:', error);
        return res.status(500).json({ message: 'Erro ao criar evento' });
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

async function listarMeusEventos(req, res) {
    try {
        // Verifica se o usuário está logado
        if (!req.session.user) {
            return res.status(401).json({ error: 'Não autenticado' })
        }

        const userId = req.session.user.id

        // Busca apenas eventos onde o userId está dentro do array de administradores
        const eventos = await Evento.find({ administradores: userId })

        res.json(eventos)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar eventos do usuário' })
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
    deletarEvento,
    listarMeusEventos
};