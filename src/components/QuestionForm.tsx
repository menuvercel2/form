'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Question } from '@/types';

interface QuestionFormProps {
    onSubmit: (question: Omit<Question, 'id'>) => Promise<void>;
    isLoading?: boolean;
}

export default function QuestionForm({ onSubmit, isLoading = false }: QuestionFormProps) {
    const [formData, setFormData] = useState<Omit<Question, 'id'>>({
        question_text: '',
        question_type: 'text',
        required: false,
        options: ['']
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const questionData = {
            ...formData,
            options: formData.question_type === 'multiple' ? formData.options : null,
        };
        await onSubmit(questionData);
        // Resetear el formulario
        setFormData({
            question_text: '',
            question_type: 'text',
            required: false,
            options: ['']
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...(formData.options || []), '']
        });
    };

    const removeOption = (index: number) => {
        const newOptions = formData.options?.filter((_, i) => i !== index) || [];
        setFormData({ ...formData, options: newOptions });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pregunta
                </label>
                <input
                    type="text"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Escribe tu pregunta aquí"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Pregunta
                </label>
                <select
                    value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="multiple">Opción múltiple</option>
                </select>
            </div>

            {formData.question_type === 'multiple' && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Opciones
                    </label>
                    {formData.options?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder={`Opción ${index + 1}`}
                                required
                            />
                            {formData.options!.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="flex items-center text-blue-500 hover:text-blue-600 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Agregar opción
                    </button>
                </div>
            )}

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="required"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                    Pregunta obligatoria
                </label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Guardando...' : 'Guardar Pregunta'}
            </button>
        </form>
    );
}