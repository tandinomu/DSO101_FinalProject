export let API_HOST
export let PRODUCTION  
export let DEVELOPMENT

try {
  // Force absolute URL to backend server
  API_HOST = process.env.API_HOST || 'http://localhost:3000/api'
} catch (err) {
  // Fallback to absolute URL
  API_HOST = 'http://localhost:3000/api'
}

try {
  PRODUCTION = process.env.PRODUCTION === true || process.env.PRODUCTION === 'true' || process.env.PRODUCTION.toLowerCase?.() === 'production'
  DEVELOPMENT = !PRODUCTION
} catch (err) {
  PRODUCTION = false
  DEVELOPMENT = true
}

console.log({
  API_HOST,
  PRODUCTION,
  DEVELOPMENT
})
