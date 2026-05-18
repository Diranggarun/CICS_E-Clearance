import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET /api/health', () => {
  it('returns 200 with {ok: true}', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})

describe('GET /api/__nope__', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/__nope__')
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Route not found')
  })
})
