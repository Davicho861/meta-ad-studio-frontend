/// <reference types="vitest" />
import { vi, describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import controller from '../animateController'

const app = express()
app.use(bodyParser.json())
app.post('/api/v1/animate-image', controller.animateImage)
app.get('/api/v1/animate-image/status/:jobId', controller.getJobStatus)

describe('animateController (in-memory jobs)', () => {
  // Vitest exposes the global timer helpers via `vi` instead of `jest`
  // use vi.useFakeTimers to ensure compatibility in this environment
  // @ts-ignore
  vi.useFakeTimers()

  it('creates a job and transitions to completed after ~5s', async () => {
    const postResp = await request(app)
      .post('/api/v1/animate-image')
      .send({ imageUrl: 'http://example.com/img.jpg', prompt: 'test' })
      .expect(202)

    const jobId = postResp.body.jobId
    expect(jobId).toBeTruthy()

    // Immediately should be processing
    const status1 = await request(app).get(`/api/v1/animate-image/status/${jobId}`)
    expect(status1.status).toBe(200)
    expect(status1.body.status).toBe('processing')

  // Advance time by 6 seconds
  vi.advanceTimersByTime(6000)

    const status2 = await request(app).get(`/api/v1/animate-image/status/${jobId}`)
    expect(status2.status).toBe(200)
    expect(status2.body.status).toBe('completed')
    expect(status2.body.videoUrl).toBeTruthy()
  })

  it('returns 404 for unknown job', async () => {
    const res = await request(app).get('/api/v1/animate-image/status/does-not-exist')
    expect(res.status).toBe(404)
  })
})
