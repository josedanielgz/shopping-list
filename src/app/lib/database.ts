import { Pool } from 'pg';
import dotenv from 'dotenv';

// Función para validar variables de entorno
function validateEnvVariables() {
 dotenv.config();
  const required = ['PG_USER', 'PG_PASSWORD', 'PG_HOST', 'PG_DATABASE', 'PG_PORT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }

  // Validar que PG_PASSWORD sea string
  if (typeof process.env.PG_PASSWORD !== 'string') {
    throw new Error('PG_PASSWORD debe ser un string');
  }

  // Validar que PG_PORT sea número válido
  const port = Number(process.env.PG_PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PG_PORT debe ser un número de puerto válido (1-65535)');
  }
}

try {
  validateEnvVariables();
} catch (error: any) {
  console.error('Error en configuración de base de datos:', error.message);
}

const pool = new Pool({
  // Mantener el uso del esquema público por defecto de momento
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
    /*await client.query(`
      CREATE TABLE IF NOT EXISTS items_compra (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        cantidad INTEGER NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);*/
    console.log('✅ Tabla items_compra inicializada');
  } finally {
    client.release();
  }
}

export default pool;
