import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Primero eliminamos las respuestas asociadas
        await query('DELETE FROM answers WHERE question_id = $1', [params.id]);

        // Luego eliminamos la pregunta
        const result = await query(
            'DELETE FROM questions WHERE id = $1 RETURNING *',
            [params.id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Pregunta no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
