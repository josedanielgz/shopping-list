import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'shopping_list',
  password: 'password',
  port: 5432,
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
        comprado BOOLEAN DEFAULT FALSE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla items_compra inicializada');
  } finally {
    client.release();
  }
}

export default pool;
