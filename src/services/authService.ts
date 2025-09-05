export async function register(email: string, password: string) {
  const resp = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!resp.ok) throw new Error(await resp.text())
  const data = await resp.json()
  return data.token
}

export async function login(email: string, password: string) {
  const resp = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!resp.ok) throw new Error(await resp.text())
  const data = await resp.json()
  return data.token
}
