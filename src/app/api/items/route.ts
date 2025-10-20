import { NextRequest, NextResponse } from 'next/server';
import pool, { initDatabase } from 'lib/database';
import { ItemCompra } from '@/types/item';

// GET /api/items
export async function GET() {
  try {
    await initDatabase();
    const result = await pool.query('SELECT * FROM items_compra ORDER BY creado_en DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching items' }, { status: 500 });
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
