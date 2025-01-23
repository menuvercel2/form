import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM questions ORDER BY id ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Error al obtener las preguntas' }, 
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { question_text, question_type, required, options } = await request.json();

        // Validación básica
        if (!question_text || !question_type) {
            return NextResponse.json(
                { error: 'El texto y tipo de pregunta son requeridos' },
                { status: 400 }
            );
        }

        const result = await query(
            'INSERT INTO questions (question_text, question_type, required, options) VALUES ($1, $2, $3, $4) RETURNING *',
            [question_text, question_type, required || false, options || null]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json(
            { error: 'Error al crear la pregunta' },
            { status: 500 }
        );
    }
}

// Agregar método DELETE si es necesario
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID de pregunta requerido' },
                { status: 400 }
            );
        }

        await query('DELETE FROM questions WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la pregunta' },
            { status: 500 }
        );
    }
}
