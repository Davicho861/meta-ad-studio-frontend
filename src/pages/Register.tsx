import React, { useState } from 'react'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useAuthStore((s) => s.register)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, password)
    } catch (err) {
      console.error(err)
      alert('Register failed')
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Register</button>
    </form>
  )
}
