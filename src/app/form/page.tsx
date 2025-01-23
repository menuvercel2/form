import AnswerForm from '@/components/AnswerForm';
import { query } from '@/lib/db';
import { Question } from '@/types';

export default async function FormPage() {
    const result = await query('SELECT * FROM questions ORDER BY id ASC');
    const questions = result.rows as Question[];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold mb-2">Mi Formulario</h1>
                    <p className="text-gray-600">
                        Por favor, completa todas las preguntas requeridas.
                    </p>
                </div>

                <AnswerForm questions={questions} />
            </div>
        </div>
    );
}
