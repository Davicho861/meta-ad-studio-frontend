import { Router } from 'express'
import prisma from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, passwordHash: hash } })
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.json({ token })
  } catch (err) {
    /* CODemod: console.error(err)
     */res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
    res.json({ token })
  } catch (err) {
    /* CODemod: console.error(err)
     */res.status(500).json({ error: 'server error' })
  }
})

export default router
