import Link from 'next/link';
import AdminQuestions from '@/components/AdminQuestions';
import { query } from '@/lib/db';
import { Question } from '@/types';

async function getQuestions(): Promise<Question[]> {
    try {
        const result = await query('SELECT * FROM questions ORDER BY id ASC');
        return result.rows.map((row) => ({
            id: row.id,
            question_text: row.question_text,
            question_type: row.question_type,
            options: row.options || [],
            required: row.required || false
        }));
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

export default async function AdminPage() {
    const questions = await getQuestions();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra de navegación */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            FormApp
                        </Link>
                        <div>
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Volver al formulario
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Panel de Administración
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Gestiona las preguntas del formulario
                            </p>
                        </div>

                        {/* Componente de administración de preguntas */}
                        <AdminQuestions initialQuestions={questions} />
                    </div>

                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                        <h2 className="text-blue-800 font-semibold mb-2">
                            ℹ️ Información útil
                        </h2>
                        <ul className="text-blue-700 text-sm space-y-2">
                            <li>• Puedes agregar nuevas preguntas usando el botón "Agregar pregunta"</li>
                            <li>• Las preguntas se pueden eliminar haciendo clic en el ícono de papelera</li>
                            <li>• Los cambios se guardan automáticamente</li>
                            <li>• Puedes ver el formulario completo volviendo a la página principal</li>
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-600 text-sm">
                        © {new Date().getFullYear()} FormApp. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
