import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import mountRoutes from './routes'

// INITIALISE APP
const app = express()

// CONFIGURE MIDDLEWARE
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CONFIGURE ROUTES
mountRoutes(app)
app.get('/', (_, res) => {
    res.send('start stepping: api mounted here')
})

// CONNECT TO DB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-l2x20.mongodb.net/${process.env.DB_NAME}?retryWrites=true`, { useNewUrlParser: true, useFindAndModify: false })
.then(() => {
    console.log(`CONN: connected to mongo db: ${process.env.DB_NAME}`)
    app.listen(process.env.PORT, () => {
        console.log(`server listening on port: ${process.env.PORT}...`)
    })
})
