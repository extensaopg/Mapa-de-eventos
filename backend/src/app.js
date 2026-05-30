const express = require('express');
const cors = require('cors');
const session = require('express-session')

const eventoRoutes = require('./routes/eventoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes')
const standRoutes = require('./routes/standRoutes')

const app = express();


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
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
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