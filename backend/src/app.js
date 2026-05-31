const express = require('express');
const cors = require('cors');
const session = require('express-session')

const eventoRoutes = require('./routes/eventoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes')
const standRoutes = require('./routes/standRoutes')

const app = express();

app.set('trust proxy', 1)

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ],
    credentials: true
}))

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,        // força produção real
        sameSite: 'none',    // obrigatório cross-site
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.use('/eventos', eventoRoutes);
app.use('/usuarios', usuarioRoutes)
app.use('/stands', standRoutes)

module.exports = app;