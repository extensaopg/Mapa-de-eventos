const Evento = require('../models/Evento');
const Usuario = require('../models/Usuario'); 

async function criarEvento(req, res) {
    try {
        if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });

        const { descricao, data_inicio, data_fim, latitude, longitude, colaboradores } = req.body;

        // O criador sempre será um administrador
        let administradoresIds = [req.session.user.id];
        let emailsNaoEncontrados = [];

        // Lógica de Colaboradores
        if (colaboradores && colaboradores.length > 0) {
            // Busca no banco os usuários que têm os e-mails enviados
            const usuariosDb = await Usuario.find({ email: { $in: colaboradores } });
            const emailsDb = usuariosDb.map(u => u.email);
            
            // Separa quem não foi encontrado
            emailsNaoEncontrados = colaboradores.filter(email => !emailsDb.includes(email));
            
            // Junta o ID do criador com os IDs dos colaboradores encontrados (sem repetir)
            const idsColaboradores = usuariosDb.map(u => u._id.toString());
            administradoresIds = [...new Set([...administradoresIds, ...idsColaboradores])];
        }

        const novoEvento = await Evento.create({
            descricao, data_inicio, data_fim, latitude, longitude,
            administradores: administradoresIds
        });

        return res.status(201).json({
            message: 'Evento criado com sucesso',
            id: novoEvento._id,
            emailsNaoEncontrados
        });

    } catch (error) {
        console.error(error);
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
        // Popula os administradores para devolver o e-mail deles ao frontend
        const evento = await Evento.findById(req.params.id).populate({
            path: 'administradores',
            model: 'Usuario',
            select: 'email'
        });
        
        if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });
        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar evento' });
    }
}

async function atualizarEvento(req, res) {
    try {
        if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });

        const { descricao, data_inicio, data_fim, latitude, longitude, colaboradores } = req.body;
        
        const eventoExistente = await Evento.findById(req.params.id);
        if (!eventoExistente) return res.status(404).json({ message: 'Evento não encontrado' });

        // Apenas um admin pode editar
        if (!eventoExistente.administradores.includes(req.session.user.id)) {
            return res.status(403).json({ message: 'Sem permissão para editar este evento' });
        }

        let administradoresIds = [req.session.user.id];
        let emailsNaoEncontrados = [];

        if (colaboradores && colaboradores.length > 0) {
            const usuariosDb = await Usuario.find({ email: { $in: colaboradores } });
            const emailsDb = usuariosDb.map(u => u.email);
            
            emailsNaoEncontrados = colaboradores.filter(email => !emailsDb.includes(email));
            
            const idsColaboradores = usuariosDb.map(u => u._id.toString());
            administradoresIds = [...new Set([...administradoresIds, ...idsColaboradores])];
        }

        const eventoAtualizado = await Evento.findByIdAndUpdate(
            req.params.id,
            { descricao, data_inicio, data_fim, latitude, longitude, administradores: administradoresIds },
            { new: true }
        );

        return res.json({
            message: 'Evento atualizado com sucesso',
            emailsNaoEncontrados
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao atualizar evento' });
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