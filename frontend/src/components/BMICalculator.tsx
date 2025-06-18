import React, { useState } from 'react'
import { bmiService, BMICalculationRequest } from '../api/bmi'

interface BMICalculatorProps {
  onCalculationComplete?: (result: any) => void
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ onCalculationComplete }) => {
  const [formData, setFormData] = useState<BMICalculationRequest>({
    user_id: '',
    height: 0,
    weight: 0,
    age: 0,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'user_id' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await bmiService.calculateBMI(formData)
      setResult(response.data)
      onCalculationComplete?.(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error calculating BMI')
    } finally {
      setLoading(false)
    }
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-blue-600'
      case 'Normal weight': return 'text-green-600'
      case 'Overweight': return 'text-yellow-600'
      case 'Obese': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">BMI Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your user ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height || ''}
            onChange={handleInputChange}
            required
            min="50"
            max="300"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="170"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ''}
            onChange={handleInputChange}
            required
            min="20"
            max="500"
            step="0.1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleInputChange}
            required
            min="1"
            max="150"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="25"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate BMI'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your BMI Result</h3>
          <div className="space-y-2">
            <p><span className="font-medium">BMI:</span> {result.bmi}</p>
            <p><span className="font-medium">Category:</span> 
              <span className={`ml-1 font-semibold ${getBMIColor(result.category)}`}>
                {result.category}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Calculated on: {new Date(result.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BMICalculator
