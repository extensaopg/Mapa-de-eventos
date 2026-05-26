// backend/__tests__/evento.test.js
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app'); 
const Evento = require('../src/models/Evento');

// 1. Conecta ao banco de teste com as credenciais do seu Docker
beforeAll(async () => {
    // Usamos um banco chamado "mapa_eventos_test" para não apagar os dados originais
    const urlTeste = 'mongodb://admin:admin123@localhost:27017/mapa_eventos_test?authSource=admin';
    await mongoose.connect(urlTeste);
});

// 2. Limpa os dados falsos após cada teste
afterEach(async () => {
    await Evento.deleteMany();
});

// 3. Desconecta do banco no final
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Testes da API de Eventos', () => {
    
    it('Deve criar um novo evento com sucesso', async () => {
        const eventoMock = {
            descricao: "Feira de Tecnologia",
            data_inicio: "2026-05-10T00:00:00.000Z",
            data_fim: "2026-05-12T00:00:00.000Z",
            latitude: -11.2638,
            longitude: -38.9732
        };

        const response = await request(app)
            .post('/eventos') // ROTA CORRIGIDA DE ACORDO COM SEU APP.JS
            .send(eventoMock);

        // Valida se o status foi 201 (Created)
        expect(response.status).toBe(201);
        
        // Valida se o controller retornou a mensagem de sucesso e o ID
        expect(response.body).toHaveProperty('message', 'Evento criado com sucesso');
        expect(response.body).toHaveProperty('id');
    });

    it('Deve listar todos os eventos', async () => {
        // Insere um dado direto no banco de teste
        await Evento.create({
            descricao: "Congresso de Engenharia",
            data_inicio: new Date(),
            data_fim: new Date(),
            latitude: -12.0,
            longitude: -38.0
        });

        const response = await request(app).get('/eventos'); // ROTA CORRIGIDA

        // Valida se o status é 200 (OK) e se retornou a lista
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].descricao).toBe("Congresso de Engenharia");
    });
});