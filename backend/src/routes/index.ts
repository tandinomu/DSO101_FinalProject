import { Router } from 'express'
import heartbeatRoutes from './heartbeat'
import uploadsRoutes from './uploads'
import bmiRoutes from './bmi'

const router = Router()

// Mount all routes
router.use('/', heartbeatRoutes)
router.use('/', uploadsRoutes)
router.use('/bmi', bmiRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'BMI Calculator API'
  })
})

export default router