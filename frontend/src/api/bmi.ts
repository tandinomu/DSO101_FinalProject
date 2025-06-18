import { BMI_CALCULATE, BMI_USER_HISTORY, BMI_RECORD, HEARTBEAT } from './index'

export interface BMICalculationRequest {
  user_id: string
  height: number
  weight: number
  age: number
}

export interface BMIRecord {
  id: number
  user_id: string
  height: number
  weight: number
  age: number
  bmi: number
  category: string
  created_at: string
  updated_at: string
}

export interface BMIResponse {
  success: boolean
  data: BMIRecord
  message: string
}

export const bmiService = {
  calculateBMI: async (data: BMICalculationRequest): Promise<BMIResponse> => {
    console.log('Making request to:', BMI_CALCULATE)
    console.log('Request data:', data)
    
    const response = await fetch(BMI_CALCULATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('API Response:', result)
    return result
  },

  healthCheck: async () => {
    console.log('Health check to:', HEARTBEAT)
    const response = await fetch(HEARTBEAT)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
}
