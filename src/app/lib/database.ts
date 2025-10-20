import { Pool } from 'pg';
import dotenv from 'dotenv';

// El archivo de configuración se localiza en lib/.env
dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

// Inicializar tabla
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS items_compra (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        cantidad INTEGER NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla items_compra inicializada');
  } finally {
    client.release();
  }
}

export default pool;
