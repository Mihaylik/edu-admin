import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import subjectRoutes from './routes/subjects.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

//routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/subjects', subjectRoutes)

app.get('/', (req, res) => {
  res.send('API is running')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
