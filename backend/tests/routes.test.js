import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

const protectedEndpoints = [
  { method: 'get', path: '/api/auth/me' },
  { method: 'get', path: '/api/clearance/me' },
  { method: 'get', path: '/api/notifications' },
  { method: 'get', path: '/api/admin/dashboard-stats' },
  { method: 'get', path: '/api/admin/pending-accounts' },
  { method: 'get', path: '/api/fines' },
  { method: 'get', path: '/api/fees' },
  { method: 'get', path: '/api/payments' },
  { method: 'get', path: '/api/requirements' },
]

describe('protected endpoints reject unauthenticated requests', () => {
  for (const { method, path } of protectedEndpoints) {
    it(`${method.toUpperCase()} ${path} -> 401`, async () => {
      const res = await request(app)[method](path)
      expect([401, 403]).toContain(res.status)
    })
  }
})

describe('CORS', () => {
  it('accepts any localhost origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5174')
    expect(res.status).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5174')
  })
})

describe('JSON body parsing', () => {
  it('rejects malformed JSON with 400-class error', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ not valid json')
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })
})
