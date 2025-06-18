import express, { Request, Response, Router } from 'express'
import { errorHandler } from '../utils'
import { BMIService, BMIInput } from '../services/bmi'

const router = Router()

// POST /api/bmi/calculate - Calculate and store BMI
router.post('/calculate',
  errorHandler(async (req: Request, res: Response) => {
    const { user_id, height, weight, age }: BMIInput = req.body

    // Validation
    if (!user_id || !height || !weight || !age) {
      return res.status(400).json({
        error: 'Missing required fields: user_id, height, weight, age'
      })
    }

    if (height <= 0 || weight <= 0 || age <= 0) {
      return res.status(400).json({
        error: 'Height, weight, and age must be positive numbers'
      })
    }

    const record = await BMIService.createBMIRecord({
      user_id,
      height,
      weight,
      age
    })

    return res.status(201).json({
      success: true,
      data: record,
      message: 'BMI calculated and recorded successfully'
    })
  })
)

// GET /api/bmi/user/:userId - Get all BMI records for a user
router.get('/user/:userId',
  errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const records = await BMIService.getBMIRecords(userId)

    return res.json({
      success: true,
      data: records,
      count: records.length
    })
  })
)

// GET /api/bmi/:id - Get specific BMI record
router.get('/:id',
  errorHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      })
    }

    const record = await BMIService.getBMIRecord(id)
    if (!record) {
      return res.status(404).json({
        error: 'BMI record not found'
      })
    }

    return res.json({
      success: true,
      data: record
    })
  })
)

// DELETE /api/bmi/:id - Delete BMI record
router.delete('/:id',
  errorHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      })
    }

    const deleted = await BMIService.deleteBMIRecord(id)
    if (!deleted) {
      return res.status(404).json({
        error: 'BMI record not found'
      })
    }

    return res.json({
      success: true,
      message: 'BMI record deleted successfully'
    })
  })
)

export default router