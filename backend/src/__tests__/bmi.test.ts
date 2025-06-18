import { BMIService } from '../services/bmi'

describe('BMI Calculator Service', () => {
  describe('calculateBMI', () => {
    test('should calculate BMI correctly for normal values', () => {
      // Test case: 170cm, 70kg should give BMI ≈ 24.22
      const bmi = BMIService.calculateBMI(170, 70)
      expect(bmi).toBeCloseTo(24.22, 2)
    })

    test('should calculate BMI correctly for another set of values', () => {
      // Test case: 180cm, 80kg should give BMI ≈ 24.69
      const bmi = BMIService.calculateBMI(180, 80)
      expect(bmi).toBeCloseTo(24.69, 2)
    })

    test('should return number type', () => {
      const bmi = BMIService.calculateBMI(175, 75)
      expect(typeof bmi).toBe('number')
    })

    test('should handle decimal weights', () => {
      const bmi = BMIService.calculateBMI(175, 72.5)
      expect(typeof bmi).toBe('number')
      expect(bmi).toBeGreaterThan(0)
    })

    test('should handle edge case values', () => {
      const bmi = BMIService.calculateBMI(150, 45)
      expect(bmi).toBeCloseTo(20, 1)
    })

    test('should return precise calculations', () => {
      const bmi = BMIService.calculateBMI(165, 60)
      // BMI = 60 / (1.65^2) = 22.038...
      expect(bmi).toBeCloseTo(22.04, 2)
    })
  })

  describe('getBMICategory', () => {
    test('should return correct categories for boundary values', () => {
      expect(BMIService.getBMICategory(17)).toBe('Underweight')
      expect(BMIService.getBMICategory(18.5)).toBe('Normal weight')
      expect(BMIService.getBMICategory(22)).toBe('Normal weight')
      expect(BMIService.getBMICategory(24.9)).toBe('Normal weight')
      expect(BMIService.getBMICategory(25)).toBe('Overweight')
      expect(BMIService.getBMICategory(27)).toBe('Overweight')
      expect(BMIService.getBMICategory(29.9)).toBe('Overweight')
      expect(BMIService.getBMICategory(30)).toBe('Obese')
      expect(BMIService.getBMICategory(35)).toBe('Obese')
    })

    test('should handle exact boundary values correctly', () => {
      expect(BMIService.getBMICategory(18.49)).toBe('Underweight')
      expect(BMIService.getBMICategory(18.5)).toBe('Normal weight')
      expect(BMIService.getBMICategory(24.99)).toBe('Normal weight')
      expect(BMIService.getBMICategory(25.0)).toBe('Overweight')
      expect(BMIService.getBMICategory(29.99)).toBe('Overweight')
      expect(BMIService.getBMICategory(30.0)).toBe('Obese')
    })

    test('should return string type', () => {
      const category = BMIService.getBMICategory(20)
      expect(typeof category).toBe('string')
    })

    test('should handle extreme values', () => {
      expect(BMIService.getBMICategory(10)).toBe('Underweight')
      expect(BMIService.getBMICategory(50)).toBe('Obese')
    })
  })

  describe('BMI Integration Tests', () => {
    test('should calculate BMI and category together correctly', () => {
      const height = 170
      const weight = 70
      const bmi = BMIService.calculateBMI(height, weight)
      const category = BMIService.getBMICategory(bmi)
      
      expect(bmi).toBeCloseTo(24.22, 2)
      expect(category).toBe('Normal weight')
    })

    test('should handle underweight case', () => {
      const height = 180
      const weight = 55
      const bmi = BMIService.calculateBMI(height, weight)
      const category = BMIService.getBMICategory(bmi)
      
      expect(bmi).toBeCloseTo(17.0, 1)
      expect(category).toBe('Underweight')
    })

    test('should handle overweight case', () => {
      const height = 170
      const weight = 85
      const bmi = BMIService.calculateBMI(height, weight)
      const category = BMIService.getBMICategory(bmi)
      
      expect(bmi).toBeCloseTo(29.4, 1)
      expect(category).toBe('Overweight')
    })

    test('should handle obese case', () => {
      const height = 165
      const weight = 90
      const bmi = BMIService.calculateBMI(height, weight)
      const category = BMIService.getBMICategory(bmi)
      
      expect(bmi).toBeCloseTo(33.1, 1)
      expect(category).toBe('Obese')
    })
  })

  describe('Data Type and Value Validation', () => {
    test('BMI calculation should return valid numeric values', () => {
      const testCases = [
        { height: 150, weight: 50 },
        { height: 175, weight: 70 },
        { height: 190, weight: 90 },
        { height: 160, weight: 45 }
      ]

      testCases.forEach(({ height, weight }) => {
        const bmi = BMIService.calculateBMI(height, weight)
        expect(typeof bmi).toBe('number')
        expect(bmi).toBeGreaterThan(0)
        expect(bmi).toBeLessThan(100) // Reasonable upper bound
        expect(Number.isFinite(bmi)).toBe(true)
      })
    })

    test('BMI categories should be valid strings', () => {
      const testBMIs = [15, 18.5, 22, 25, 27, 30, 35]
      const validCategories = ['Underweight', 'Normal weight', 'Overweight', 'Obese']

      testBMIs.forEach(bmi => {
        const category = BMIService.getBMICategory(bmi)
        expect(typeof category).toBe('string')
        expect(validCategories).toContain(category)
      })
    })
  })
})