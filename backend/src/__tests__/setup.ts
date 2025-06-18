// Test setup file
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Mock console methods if needed for cleaner test output
const originalConsoleError = console.error
const originalConsoleLog = console.log

beforeAll(() => {
  // Suppress console.log during tests unless explicitly needed
  console.log = jest.fn()
  // Only show errors for actual test failures
  console.error = jest.fn()
})

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError
  console.log = originalConsoleLog
})