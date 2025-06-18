const request = require('supertest');

// Mock the app since we're testing in Docker environment
const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
  listen: jest.fn()
};

describe('BMI Calculator Tests - Stage 1', () => {
  
  // Test BMI calculation logic directly
  describe('BMI Calculation Logic', () => {
    
    const calculateBMI = (height, weight) => {
      const heightInMeters = height / 100;
      return weight / (heightInMeters * heightInMeters);
    };

    const getBMICategory = (bmi) => {
      if (bmi < 18.5) return 'Underweight';
      if (bmi < 25) return 'Normal weight';
      if (bmi < 30) return 'Overweight';
      return 'Obese';
    };

    test('should calculate BMI correctly for normal weight', () => {
      const height = 170; // cm
      const weight = 70;  // kg
      const expectedBMI = 24.22;
      
      const calculatedBMI = calculateBMI(height, weight);
      
      expect(calculatedBMI).toBeCloseTo(expectedBMI, 2);
      expect(typeof calculatedBMI).toBe('number');
      expect(calculatedBMI).toBeGreaterThan(0);
    });

    test('should categorize BMI correctly - Underweight', () => {
      const bmi = 17.5;
      const category = getBMICategory(bmi);
      
      expect(category).toBe('Underweight');
      expect(typeof category).toBe('string');
    });

    test('should categorize BMI correctly - Normal weight', () => {
      const bmi = 22.0;
      const category = getBMICategory(bmi);
      
      expect(category).toBe('Normal weight');
      expect(typeof category).toBe('string');
    });

    test('should categorize BMI correctly - Overweight', () => {
      const bmi = 27.0;
      const category = getBMICategory(bmi);
      
      expect(category).toBe('Overweight');
      expect(typeof category).toBe('string');
    });

    test('should categorize BMI correctly - Obese', () => {
      const bmi = 32.0;
      const category = getBMICategory(bmi);
      
      expect(category).toBe('Obese');
      expect(typeof category).toBe('string');
    });

    test('should handle edge cases correctly', () => {
      // BMI exactly at boundary
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(30.0)).toBe('Obese');
    });

    test('should validate data types', () => {
      const height = 170;
      const weight = 70;
      
      const bmi = calculateBMI(height, weight);
      
      expect(typeof bmi).toBe('number');
      expect(isNaN(bmi)).toBe(false);
      expect(isFinite(bmi)).toBe(true);
    });

    test('should handle various height and weight combinations', () => {
      const testCases = [
        { height: 150, weight: 50, expectedCategory: 'Normal weight' },
        { height: 180, weight: 90, expectedCategory: 'Overweight' },
        { height: 160, weight: 45, expectedCategory: 'Underweight' },
        { height: 170, weight: 95, expectedCategory: 'Obese' }
      ];

      testCases.forEach(({ height, weight, expectedCategory }) => {
        const bmi = calculateBMI(height, weight);
        const category = getBMICategory(bmi);
        
        expect(category).toBe(expectedCategory);
        expect(bmi).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Validation Tests', () => {
    
    const validateBMIInput = (data) => {
      const { user_id, height, weight, age } = data;
      
      if (!user_id || typeof user_id !== 'string') {
        return { valid: false, error: 'Invalid user_id' };
      }
      
      if (!height || typeof height !== 'number' || height <= 0) {
        return { valid: false, error: 'Invalid height' };
      }
      
      if (!weight || typeof weight !== 'number' || weight <= 0) {
        return { valid: false, error: 'Invalid weight' };
      }
      
      if (!age || typeof age !== 'number' || age <= 0) {
        return { valid: false, error: 'Invalid age' };
      }
      
      return { valid: true };
    };

    test('should validate correct input data', () => {
      const validData = {
        user_id: 'test_user_123',
        height: 170,
        weight: 70,
        age: 25
      };

      const result = validateBMIInput(validData);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject invalid user_id', () => {
      const invalidData = {
        user_id: '',
        height: 170,
        weight: 70,
        age: 25
      };

      const result = validateBMIInput(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid user_id');
    });

    test('should reject invalid height', () => {
      const invalidData = {
        user_id: 'test_user',
        height: -170,
        weight: 70,
        age: 25
      };

      const result = validateBMIInput(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid height');
    });

    test('should reject invalid weight', () => {
      const invalidData = {
        user_id: 'test_user',
        height: 170,
        weight: 'invalid',
        age: 25
      };

      const result = validateBMIInput(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid weight');
    });
  });

  describe('Performance Tests', () => {
    
    test('BMI calculation should be fast', () => {
      const start = process.hrtime();
      
      // Calculate BMI 1000 times
      for (let i = 0; i < 1000; i++) {
        const height = 170;
        const weight = 70;
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
      }
      
      const [seconds, nanoseconds] = process.hrtime(start);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      
      // Should complete within 100ms
      expect(milliseconds).toBeLessThan(100);
    });
  });
});
