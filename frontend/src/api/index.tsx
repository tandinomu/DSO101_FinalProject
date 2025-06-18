// Hardcode backend URL to fix the connection issue
const BACKEND_URL = 'http://localhost:3000/api'

export const HEARTBEAT = `${BACKEND_URL}/health`
export const BMI_CALCULATE = `${BACKEND_URL}/bmi/calculate`
export const BMI_USER_HISTORY = (userId: string) => `${BACKEND_URL}/bmi/user/${userId}`
export const BMI_RECORD = (id: number) => `${BACKEND_URL}/bmi/${id}`
