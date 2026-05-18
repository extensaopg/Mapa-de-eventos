const express = require('express');
const cors = require('cors');

const eventoRoutes = require('./routes/eventoRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.use('/eventos', eventoRoutes);

module.exports = app;