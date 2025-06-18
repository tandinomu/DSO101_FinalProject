// Debug: Log environment variables
console.log('Environment variables:')
console.log('DATABASE_HOST:', process.env.DATABASE_HOST)
console.log('DATABASE_PORT:', process.env.DATABASE_PORT)
console.log('DATABASE_USER:', process.env.DATABASE_USER)
console.log('DATABASE_NAME:', process.env.DATABASE_NAME)

export const databaseConfig = {
  client: 'pg',
  version: '12',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    user: process.env.DATABASE_USER || 'macbookairm4chip',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'dso101_project',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

console.log('Final database config:', databaseConfig.connection)
