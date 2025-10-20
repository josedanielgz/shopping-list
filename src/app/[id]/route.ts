import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

// PUT /api/items/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { comprado }: Partial<{ comprado: boolean }> = await request.json();
    const id = parseInt(params.id);

    const result = await pool.query(
      'UPDATE items_compra SET comprado = $1 WHERE id = $2 RETURNING *',
      [comprado, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
  }
}
