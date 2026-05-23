require('dotenv').config()

const mongoose = require('mongoose')
const Usuario = require('../models/Usuario')
const Evento = require('../models/Evento')
const Stand = require('../models/Stand')

async function seed() {
    try {
        console.log('🌱 Iniciando seed...')

        await mongoose.connect(process.env.MONGO_URL)

        // limpa tudo
        await Usuario.deleteMany()
        await Evento.deleteMany()
        await Stand.deleteMany()

        console.log('🧹 Banco limpo')

        // ================= USUARIOS =================
        const usuarios = await Usuario.insertMany([
            {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '75999990001',
                senha: '123456',
                ativo: true
            },
            {
                nome: 'Maria Souza',
                email: 'maria@email.com',
                telefone: '75999990002',
                senha: '123456',
                ativo: true
            },
            {
                nome: 'Carlos Lima',
                email: 'carlos@email.com',
                telefone: '75999990003',
                senha: '123456',
                ativo: true
            }
        ])

        console.log('👤 Usuários criados')

        // ================= EVENTOS =================
        const eventos = await Evento.insertMany([
            {
                descricao: 'Feira de Tecnologia UEFS',
                data_inicio: new Date('2026-06-10'),
                data_fim: new Date('2026-06-12'),
                latitude: -12.2006,
                longitude: -38.9696
            },
            {
                descricao: 'Expo Games Bahia',
                data_inicio: new Date('2026-07-01'),
                data_fim: new Date('2026-07-03'),
                latitude: -12.25,
                longitude: -38.96
            }
        ])

        console.log('📍 Eventos criados')

        // ================= STANDS =================
        await Stand.insertMany([
            {
                descricao: 'Stand de Inteligência Artificial',
                data_inicio: new Date('2026-06-10'),
                data_fim: new Date('2026-06-12'),
                latitude: -12.201,
                longitude: -38.97,
                cor_icone: 'red',
                id_evento: eventos[0]._id
            },
            {
                descricao: 'Stand de Robótica',
                data_inicio: new Date('2026-06-10'),
                data_fim: new Date('2026-06-12'),
                latitude: -12.202,
                longitude: -38.968,
                cor_icone: 'blue',
                id_evento: eventos[0]._id
            },
            {
                descricao: 'Stand Indie Games',
                data_inicio: new Date('2026-07-01'),
                data_fim: new Date('2026-07-03'),
                latitude: -12.251,
                longitude: -38.961,
                cor_icone: 'green',
                id_evento: eventos[1]._id
            }
        ])

        console.log('🎮 Stands criados')

        // ================= LOG BUSCA =================
        console.log('📊 Seed finalizado com sucesso!')

        process.exit()

    } catch (error) {
        console.error('❌ Erro no seed:', error)
        process.exit(1)
    }
}

seed()