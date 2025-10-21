import { NextRequest, NextResponse } from 'next/server';
import pool, { initDatabase } from '../../lib/database';
import { ItemCompra } from '../../types/item';
import { handleApiError } from '../utils/errorHandling'; 

// GET /api/items
/**
 * Obtiene todos los ítems de compra de la base de datos.
 */
export async function GET() {
    try {
        await initDatabase();
        const result = await pool.query('SELECT * FROM items_compra ORDER BY creado_en DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return handleApiError(error, 'GET /api/items');
    }
}

// POST /api/items
/**
 * Crea un nuevo ítem de compra en la base de datos.
 */
export async function POST(request: NextRequest) {
    try {
        const { nombre, cantidad }: Partial<ItemCompra> = await request.json();
        
        // Validación de datos de entrada (Error de negocio: 400 Bad Request)
        if (!nombre || !cantidad) {
            return NextResponse.json({ 
                success: false,
                error: 'Nombre y cantidad son requeridos' 
            }, { status: 400 });
        }

        const result = await pool.query(
            'INSERT INTO items_compra (nombre, cantidad, comprado) VALUES ($1, $2, FALSE) RETURNING *',
            [nombre, cantidad]
        );

        // 201 Created
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        // 🔄 Usar el manejador de errores encapsulado
        return handleApiError(error, 'POST /api/items');
    }
}