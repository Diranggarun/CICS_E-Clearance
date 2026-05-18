import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('auth endpoints — input validation (no DB hit)', () => {
  it('POST /api/auth/login with empty body -> 400', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })

  it('POST /api/auth/register with empty body -> 400', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })

  it('POST /api/auth/login with malformed email -> 400', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'whatever',
    })
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })
})

describe('approval endpoints reject without auth', () => {
  it('POST /api/approval/123/bytes -> 401/403', async () => {
    const res = await request(app).post('/api/approval/123/bytes').send({})
    expect([401, 403]).toContain(res.status)
  })
})
