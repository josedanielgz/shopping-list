import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { handleApiError } from '@/api/utils/errorHandling';

// POST /api/items/[id]/toggle
/**
 * 
 * Altera el estado del item de comprado a no comprado
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Aseguramos acceso asíncrono y convertimos el ID
        const id = parseInt((await params).id, 10);

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({ error: 'ID de ítem inválido.' }, { status: 400 });
        }

        // Consulta SQL para Invertir el estado comprado
        const result = await pool.query(
            'UPDATE items_compra SET comprado = NOT comprado WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
        }

        // Devolver el ítem con el estado 'comprado' actualizado
        return NextResponse.json(result.rows[0]);

    } catch (error) {
        return handleApiError(error, `POST /api/items/${params.id}/toggle`);
    }
}