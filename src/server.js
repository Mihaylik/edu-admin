import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './db/prismaClient'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
