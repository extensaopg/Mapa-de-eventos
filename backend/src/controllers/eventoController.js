const db = require('../database/connection');

async function criarEvento(req, res) {
    try {

        const {
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude
        } = req.body;

        const [result] = await db.execute(
            `
            INSERT INTO Evento
            (descricao, data_inicio, data_fim, latitude, longitude)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                descricao,
                data_inicio,
                data_fim,
                latitude,
                longitude
            ]
        );

        res.status(201).json({
            message: 'Evento criado com sucesso',
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao criar evento'
        });
    }
}

async function listarEventos(req, res) {
    try {

        const [eventos] = await db.execute(
            'SELECT * FROM Evento'
        );

        res.json(eventos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao buscar eventos'
        });
    }
}

async function buscarEventoPorId(req, res) {
    try {

        const { id } = req.params;

        const [evento] = await db.execute(
            'SELECT * FROM Evento WHERE id = ?',
            [id]
        );

        if (evento.length === 0) {
            return res.status(404).json({
                error: 'Evento não encontrado'
            });
        }

        res.json(evento[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao buscar evento'
        });
    }
}

async function atualizarEvento(req, res) {
    try {

        const { id } = req.params;

        const {
            descricao,
            data_inicio,
            data_fim,
            latitude,
            longitude
        } = req.body;

        await db.execute(
            `
            UPDATE Evento
            SET
                descricao = ?,
                data_inicio = ?,
                data_fim = ?,
                latitude = ?,
                longitude = ?
            WHERE id = ?
            `,
            [
                descricao,
                data_inicio,
                data_fim,
                latitude,
                longitude,
                id
            ]
        );

        res.json({
            message: 'Evento atualizado com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao atualizar evento'
        });
    }
}

async function deletarEvento(req, res) {
    try {

        const { id } = req.params;

        await db.execute(
            'DELETE FROM Evento WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Evento deletado com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao deletar evento'
        });
    }
}

module.exports = {
    criarEvento,
    listarEventos,
    buscarEventoPorId,
    atualizarEvento,
    deletarEvento
};