export type AdConcept = { title: string; description: string }

export async function generateAdConcepts(prompt: string, settings: any): Promise<AdConcept[]> {
  try {
    const token = localStorage.getItem('token')
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ prompt, settings })
    })

    if (!resp.ok) {
      console.error('generate failed', await resp.text())
      return [{ title: 'Error', description: 'No se pudo generar. Intenta de nuevo.' }]
    }

    const data = await resp.json()
    const concepts = data?.generation?.results || data?.results || []
    if (!Array.isArray(concepts)) return [{ title: 'Formato inesperado', description: 'La respuesta del servidor no tiene el formato esperado.' }]
    return concepts.map((c: any) => ({ title: String(c.title || ''), description: String(c.description || '') }))
  } catch (err) {
    console.error('Error generating concepts (frontend):', err)
    return [{ title: 'Error', description: 'No se pudo conectar con el servidor.' }]
  }
}
