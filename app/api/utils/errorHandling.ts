import { NextResponse } from 'next/server';

/**
 * Función para estandarizar el manejo de errores de API, incluyendo
 * la traducción de códigos de error comunes de PostgreSQL.
 * @param error El objeto de error capturado.
 * @param endpoint La ruta del endpoint que falló (ej. 'GET /api/items').
 * @returns Una respuesta de Next.js (NextResponse) con el formato de error estandarizado.
 */
export function handleApiError(error: unknown, endpoint: string): NextResponse {
    console.error(`Error en ${endpoint}:`, error);

    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;
    let errorDetails = null;

    if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = {
            name: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };

        // Manejo específico de errores de PostgreSQL (basado en el código de error)
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const pgError = error as any;
            switch (pgError.code) {
                case 'ECONNREFUSED':
                    errorMessage = 'No se puede conectar a la base de datos';
                    statusCode = 503; // Service Unavailable
                    break;
                case '28P01':
                    errorMessage = 'Error de autenticación en la base de datos';
                    statusCode = 401; // Unauthorized
                    break;
                case '3D000':
                    errorMessage = 'La base de datos no existe';
                    statusCode = 500;
                    break;
                case '42P01':
                    errorMessage = 'La tabla de la base de datos no existe';
                    statusCode = 500;
                    break;
                case '23502':
                    errorMessage = 'Datos incompletos: faltan campos obligatorios.';
                    statusCode = 400; // Bad Request
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