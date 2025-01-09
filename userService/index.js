const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./models')
const seedDatabase = require('./seeds/index')
const { API_PREFIX } = require('./utils')

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(express.json({ limit: '50mb' }))

app.use('/static', express.static(path.join(__dirname, 'public')))

async function startServer() {
    try {
        await sequelize.sync()
        console.log('Database synchronized successfully')
        await seedDatabase()
        console.log('Data seeded successfully')
        app.listen(process.env.PORT, () => {
            console.log('Server is running')
        })
    } catch (error) {
        console.error('Error starting server:', error)
    }
}

startServer()
