import request from 'supertest'
import express from 'express'
import bmiRoutes from '../routes/bmi'
import { errorHandler } from '../utils'

// Create a test app
const app = express()
app.use(express.json())
app.use('/api', bmiRoutes)

// Mock error handler for tests
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

describe('BMI API Endpoints', () => {
  describe('POST /api/bmi/calculate-only', () => {
    test('should calculate BMI without saving', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          height: 170,
          weight: 70
        })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('BMI calculated successfully')
      expect(response.body.data).toHaveProperty('bmi')
      expect(response.body.data).toHaveProperty('category')
      expect(response.body.data.bmi).toBeCloseTo(24.22, 2)
      expect(response.body.data.category).toBe('Normal weight')
    })

    test('should return error for missing height', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          weight: 70
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height and weight are required')
    })

    test('should return error for missing weight', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          height: 170
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height and weight are required')
    })

    test('should return error for negative height', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          height: -170,
          weight: 70
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height and weight must be positive numbers')
    })

    test('should return error for zero weight', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          height: 170,
          weight: 0
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height and weight must be positive numbers')
    })

    test('should handle decimal values', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate-only')
        .send({
          height: 175.5,
          weight: 72.3
        })

      expect(response.status).toBe(200)
      expect(response.body.data.bmi).toBeGreaterThan(0)
      expect(typeof response.body.data.bmi).toBe('number')
    })
  })

  describe('POST /api/bmi/calculate', () => {
    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate')
        .send({
          height: 170,
          weight: 70
          // missing age
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height, weight, and age are required')
    })

    test('should validate positive values', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate')
        .send({
          height: 170,
          weight: -70,
          age: 25
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Height, weight, and age must be positive numbers')
    })

    test('should validate reasonable value ranges', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate')
        .send({
          height: 400, // Too tall
          weight: 70,
          age: 25
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Invalid height, weight, or age values')
    })

    test('should handle string numbers correctly', async () => {
      const response = await request(app)
        .post('/api/bmi/calculate')
        .send({
          height: "170",
          weight: "70",
          age: "25"
        })

      // This should work as the route converts to numbers
      expect(response.status).toBe(200)
    })
  })

  describe('GET /api/bmi/latest/:userId', () => {
    test('should handle non-existent user gracefully', async () => {
      const response = await request(app)
        .get('/api/bmi/latest/nonexistent_user')

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('No BMI record found')
      expect(response.body.data).toBe(null)
    })

    test('should handle default user ID when not provided', async () => {
      const response = await request(app)
        .get('/api/bmi/latest/')

      expect(response.status).toBe(200)
    })
  })

  describe('DELETE /api/bmi/:userId', () => {
    test('should require user ID', async () => {
      const response = await request(app)
        .delete('/api/bmi/')

      expect(response.status).toBe(404) // Route not found without userId
    })

    test('should handle deletion of non-existent record', async () => {
      const response = await request(app)
        .delete('/api/bmi/nonexistent_user')

      expect(response.status).toBe(200)
      expect(response.body.deleted).toBe(false)
      expect(response.body.message).toBe('No BMI record found to delete')
    })
  })

  describe('GET /api/bmi/history/:userId', () => {
    test('should require user ID', async () => {
      const response = await request(app)
        .get('/api/bmi/history/')

      expect(response.status).toBe(404) // Route not found without userId
    })

    test('should return empty array for user with no history', async () => {
      const response = await request(app)
        .get('/api/bmi/history/new_user')

      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
    })
  })
})