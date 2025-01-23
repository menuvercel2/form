export interface Question {
    id: number;
    question_text: string;
    question_type: string;
    required: boolean;
    options: string[] | null;
}

export interface Answer {
    question_id: number;
    answer_text: string;
}
