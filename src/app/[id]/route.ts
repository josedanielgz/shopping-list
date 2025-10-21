import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { handleApiError } from '@/api/utils/errorHandling'; 
import { ItemCompra } from '@/types/item';

// PUT /api/items/[id]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Desestructura todos los posibles campos del cuerpo de la solicitud
    const { nombre, cantidad, precio, comprado }: Partial<ItemCompra> = await request.json();
    const id = parseInt(params.id);

    // Construcción dinámica de la consulta SQL para actualizar solo los campos proporcionados
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
        updates.push(`nombre = $${paramIndex++}`);
        values.push(nombre);
    }
    if (cantidad !== undefined) {
        updates.push(`cantidad = $${paramIndex++}`);
        values.push(cantidad);
    }
    if (precio !== undefined) {
        updates.push(`precio = $${paramIndex++}`);
        values.push(precio);
    }
    if (comprado !== undefined) {
        updates.push(`comprado = $${paramIndex++}`);
        values.push(comprado);
    }

    // Si no hay campos para actualizar, devuelve un error 400
    if (updates.length === 0) {
        return NextResponse.json({ 
            success: false, 
            error: 'No se proporcionaron campos para actualizar.' 
        }, { status: 400 });
    }

    // Añadir el ID al final de los valores para la cláusula WHERE
    values.push(id);
    
    const sqlQuery = `UPDATE items_compra SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(sqlQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    // Usar el manejador de errores encapsulado
    return handleApiError(error, `PUT /api/items/${params.id}`);
  }
}

// DELETE /api/items/[id]
/**
 * Elimina un ítem de compra por su ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const result = await pool.query(
      'DELETE FROM items_compra WHERE id = $1 RETURNING id',
      [id]
    );

    // 1. Manejo de error de recurso no encontrado (404)
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 2. Respuesta de éxito (204 No Content es preferible para DELETE)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // 3. Manejo de errores de servidor/BD (500, 503, etc.)
    return handleApiError(error, `DELETE /api/items/${params.id}`);
  }
}