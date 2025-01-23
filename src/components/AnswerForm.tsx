'use client';

import React, { useState } from 'react';
import { Question } from '@/types';

interface AnswerFormProps {
    questions: Question[];
}

export default function AnswerForm({ questions }: AnswerFormProps) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Validar que todas las preguntas requeridas tengan respuesta
            const missingRequired = questions
                .filter(q => q.required && !answers[q.id])
                .map(q => q.question_text);

            if (missingRequired.length > 0) {
                throw new Error(`Por favor responde las siguientes preguntas obligatorias: ${missingRequired.join(', ')}`);
            }

            // Formatear las respuestas para enviar al servidor
            const answersToSubmit = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: parseInt(questionId),
                answer_text: answerText
            }));

            const response = await fetch('/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers: answersToSubmit }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar las respuestas');
            }

            setSuccess(true);
            setAnswers({});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">¡Gracias por tus respuestas!</h2>
                <p className="text-green-600 mb-4">Tus respuestas han sido enviadas correctamente.</p>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setAnswers({});
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    Enviar otro formulario
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question) => (
                    <div key={question.id} className="bg-white rounded-lg shadow-lg p-6">
                        <label className="block mb-2">
                            <span className="text-lg font-medium">
                                {question.question_text}
                                {question.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </span>
                        </label>

                        {question.question_type === 'text' && (
                            <input
                                type="text"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                required={question.required}
                            />
                        )}

                        {question.question_type === 'number' && (
                            <input
                                type="number"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                required={question.required}
                            />
                        )}

                        {question.question_type === 'multiple' && question.options && (
                            <div className="space-y-2">
                                {question.options.map((option, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`question-${question.id}-option-${index}`}
                                            name={`question-${question.id}`}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            required={question.required}
                                        />
                                        <label
                                            htmlFor={`question-${question.id}-option-${index}`}
                                            className="ml-2 block text-sm text-gray-700"
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Respuestas'}
                </button>
            </form>
        </div>
    );
}