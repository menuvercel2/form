import AnswerForm from '@/components/AnswerForm';
import { query } from '@/lib/db';
import { Question } from '@/types';

export default async function HomePage() {
  let questions: Question[] = [];
  let error: string | null = null;

  try {
    const result = await query('SELECT * FROM questions ORDER BY id ASC');
    questions = result.rows as Question[];
  } catch (err) {
    console.error('Error fetching questions:', err);
    error = 'Error al cargar las preguntas. Por favor, intenta más tarde.';
  }

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
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold mb-2">Formulario</h1>
            <p className="text-gray-600">
              Por favor, completa todas las preguntas requeridas.
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : questions.length > 0 ? (
            <AnswerForm questions={questions} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-700">
                No hay preguntas disponibles en este momento. Por favor, accede al panel de administración para agregar preguntas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
