// Example migration. Add the '.js' extension to activate it
// Our 0.0.3 version includes the table 'bmi_record' for BMI calculator functionality

exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bmi_record (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      height DECIMAL(5,2) NOT NULL, -- Height in cm
      weight DECIMAL(5,2) NOT NULL, -- Weight in kg
      age INTEGER NOT NULL,
      bmi DECIMAL(4,2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (id)
    );
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_bmi_user_id ON bmi_record(user_id);
  `)
}

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE bmi_record;
  `)
}

exports.config = { transaction: true }