import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import usersRouter from './routes/users'
import itemsRouter from './routes/items'
import uploadRouter from './routes/upload'

mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/users', usersRouter)

app.use('/api/items', itemsRouter)

app.use('/api', uploadRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server is running in port ${PORT}`)
})