'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import StateWrapper from './StateWrapper';

interface Question {
    id: number;
    question_text: string;
    question_type: string;
    required: boolean;
    options: string[] | null;
}

export default function AdminQuestions({ initialQuestions }: { initialQuestions: Question[] }) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        question_type: 'text',
        required: false,
        options: [''],
    });

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newQuestion,
                    options: newQuestion.question_type === 'multiple' ? newQuestion.options : null,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la pregunta');
            }

            const createdQuestion = await response.json();
            setQuestions([...questions, createdQuestion]);
            setNewQuestion({
                question_text: '',
                question_type: 'text',
                required: false,
                options: [''],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
            return;
        }

        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la pregunta');
            }

            setQuestions(questions.filter((q) => q.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: newOptions });
    };

    const addOption = () => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, ''],
        });
    };

    const removeOption = (index: number) => {
        const newOptions = newQuestion.options.filter((_, i) => i !== index);
        setNewQuestion({ ...newQuestion, options: newOptions });
    };

    return (
        <StateWrapper isLoading={isLoading} error={error}>
            <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Agregar Nueva Pregunta</h2>
                    <form onSubmit={handleAddQuestion} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Pregunta
                            </label>
                            <input
                                type="text"
                                value={newQuestion.question_text}
                                onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, question_text: e.target.value })
                                }
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tipo
                            </label>
                            <select
                                value={newQuestion.question_type}
                                onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, question_type: e.target.value })
                                }
                                className="w-full border rounded-md p-2"
                            >
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="multiple">Opción múltiple</option>
                            </select>
                        </div>

                        {newQuestion.question_type === 'multiple' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-1">
                                    Opciones
                                </label>
                                {newQuestion.options.map((option, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            className="flex-1 border rounded-md p-2"
                                            placeholder={`Opción ${index + 1}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="flex items-center text-blue-500 hover:text-blue-600"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Agregar opción
                                </button>
                            </div>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={newQuestion.required}
                                onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, required: e.target.checked })
                                }
                                className="mr-2"
                            />
                            <label className="text-sm">Obligatorio</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Agregando...' : 'Agregar Pregunta'}
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Preguntas Existentes</h2>
                    {questions.map((question) => (
                        <div
                            key={question.id}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">{question.question_text}</p>
                                <p className="text-sm text-gray-500">
                                    Tipo: {question.question_type} |
                                    {question.required ? ' Obligatorio' : ' Opcional'}
                                </p>
                                {question.options && (
                                    <p className="text-sm text-gray-500">
                                        Opciones: {question.options.join(', ')}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="p-2 hover:bg-red-50 rounded-full text-red-500"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StateWrapper>
    );
}