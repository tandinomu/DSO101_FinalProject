import knex from 'knex'
import { databaseConfig } from '../config'

// Use your existing database config
const db = knex(databaseConfig)

export interface BMIRecord {
  id?: number
  user_id: string
  height: number
  weight: number
  age: number
  bmi: number
  category: string
  created_at?: Date
  updated_at?: Date
}

export interface BMIInput {
  user_id: string
  height: number
  weight: number
  age: number
}

export class BMIService {
  static calculateBMI(height: number, weight: number): number {
    // Height should be in meters, weight in kg
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(2))
  }

  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  static async createBMIRecord(input: BMIInput): Promise<BMIRecord> {
    const bmi = this.calculateBMI(input.height, input.weight)
    const category = this.getBMICategory(bmi)

    const recordData = {
      ...input,
      bmi,
      category,
      created_at: new Date(),
      updated_at: new Date()
    }

    const [record] = await db('bmi_record')
      .insert(recordData)
      .returning('*')

    return record
  }

  static async getBMIRecords(userId: string): Promise<BMIRecord[]> {
    return await db('bmi_record')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
  }

  static async getBMIRecord(id: number): Promise<BMIRecord | null> {
    const record = await db('bmi_record')
      .where('id', id)
      .first()

    return record || null
  }

  static async deleteBMIRecord(id: number): Promise<boolean> {
    const deletedRows = await db('bmi_record')
      .where('id', id)
      .del()

    return deletedRows > 0
  }
}