import postgresPool from "../config/database.postgres";

async function createTables() {
  await postgresPool.query(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'orders_db') THEN
        CREATE DATABASE orders_db WITH OWNER = postgres;
      END IF;
    END $$;
  `);

  await postgresPool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            status VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            task VARCHAR(255) NOT NULL,
            result VARCHAR(255)
        );
    `);
}

// Run the table creation and seeding process
export const initializePostgresDatabase = async () => {
  try {
    await createTables();
  } catch (error) {
    console.error("Postgres database initialization failed:", error);
  }
};
