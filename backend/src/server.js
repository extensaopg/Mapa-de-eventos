require('dotenv').config()

const app = require('./app') // 👈 ISSO AQUI ESTAVA FALTANDO
const connectMongo = require('./config/mongo')

connectMongo()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})