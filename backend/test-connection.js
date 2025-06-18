require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})

console.log('Testing connection with:')
console.log('- Host:', process.env.DATABASE_HOST)
console.log('- Port:', process.env.DATABASE_PORT)
console.log('- User:', process.env.DATABASE_USER)
console.log('- Database:', process.env.DATABASE_NAME)
console.log('- Password:', process.env.DATABASE_PASSWORD ? '[SET]' : '[EMPTY]')

client.connect()
  .then(() => {
    console.log('✅ Database connection successful!')
    return client.query('SELECT NOW()')
  })
  .then((result) => {
    console.log('Current time:', result.rows[0].now)
    client.end()
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message)
  })
