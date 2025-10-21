import { NextRequest, NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/database';
import { ItemCompra } from '@/types/item';

// GET /api/items
export async function GET() {
  try {
    await initDatabase();
    const result = await pool.query('SELECT * FROM items_compra ORDER BY creado_en DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('❌ Error en GET /api/items:', error);
    
    // Manejo específico de diferentes tipos de error
    let errorMessage = 'Error fetching items';
    let statusCode = 500;
    let errorDetails = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };

      // Errores específicos de PostgreSQL
      if ('code' in error) {
        const pgError = error as any;
        switch (pgError.code) {
          case 'ECONNREFUSED':
            errorMessage = 'No se puede conectar a la base de datos';
            statusCode = 503;
            break;
          case '28P01':
            errorMessage = 'Error de autenticación en la base de datos';
            statusCode = 401;
            break;
          case '3D000':
            errorMessage = 'La base de datos no existe';
            statusCode = 500;
            break;
          case '42P01':
            errorMessage = 'La tabla items_compra no existe';
            statusCode = 500;
            break;
        }
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      timestamp: new Date().toISOString()
    }, { status: statusCode });
  }
}
// POST /api/items
export async function POST(request: NextRequest) {
  try {
    const { nombre, cantidad }: Partial<ItemCompra> = await request.json();
    
    if (!nombre || !cantidad) {
      return NextResponse.json({ error: 'Nombre y cantidad son requeridos' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO items_compra (nombre, cantidad) VALUES ($1, $2) RETURNING *',
      [nombre, cantidad]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating item' }, { status: 500 });
  }
}
