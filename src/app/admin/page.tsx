import AdminQuestions from '@/components/AdminQuestions';
import { query } from '@/lib/db';
import { Question } from '@/types';

export default async function AdminPage() {
    const result = await query('SELECT * FROM questions ORDER BY id ASC');
    const questions = result.rows as Question[];

    return (
        <div>
            {/* Banner con navegación */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <a href="/" className="text-xl font-bold text-blue-600">
                            FormApp
                        </a>
                        <div>
                            <a
                                href="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Volver al formulario
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
                <AdminQuestions initialQuestions={questions} />
            </div>
        </div>
    );
}
