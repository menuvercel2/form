import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const { answers } = await request.json();

        // Validación básica
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: 'Se requieren respuestas válidas' },
                { status: 400 }
            );
        }

        const respondent_id = randomUUID();

        try {
            // Iniciar transacción
            await query('BEGIN');

            // Insertar cada respuesta
            for (const answer of answers) {
                if (!answer.question_id || !answer.answer_text) {
                    throw new Error('Datos de respuesta incompletos');
                }

                await query(
                    'INSERT INTO answers (question_id, answer_text, respondent_id) VALUES ($1, $2, $3)',
                    [answer.question_id, answer.answer_text, respondent_id]
                );
            }

            // Confirmar transacción
            await query('COMMIT');

            return NextResponse.json({
                success: true,
                respondent_id,
                message: 'Respuestas guardadas exitosamente'
            });

        } catch (error) {
            // Revertir transacción en caso de error
            await query('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('Error saving answers:', error);
        return NextResponse.json(
            {
                error: 'Error al guardar las respuestas',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}

// Opcional: Agregar método GET para obtener respuestas
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const respondent_id = searchParams.get('respondent_id');

        let result;
        if (respondent_id) {
            result = await query(
                'SELECT * FROM answers WHERE respondent_id = $1',
                [respondent_id]
            );
        } else {
            result = await query('SELECT * FROM answers');
        }

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching answers:', error);
        return NextResponse.json(
            { error: 'Error al obtener las respuestas' },
            { status: 500 }
        );
    }
}
