import express from 'express'
import dotenv from 'dotenv'
import prisma from './prisma.js'
import authRoutes from './routes/auth.js'
import generateRoutes from './routes/generate.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/generate', generateRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  /* CODemod: console.log(`Backend listening on port ${port}`)
 */})
