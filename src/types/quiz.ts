export interface Question {
  id: string;
  subject: string;
  question: string;
  type: 'multiple_choice' | 'complex_multiple_choice';
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizSettings {
  subject: string;
  numberOfQuestions: number;
  mode: 'practice' | 'exam';
  timePerQuestion?: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  subject: string;
  score: number;
  total_questions: number;
  time_taken: number;
  mode: string;
  created_at: string;
}

export const SUBJECTS = [
  "Pendidikan Agama dan Budi Pekerti",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika (Umum)",
  "Matematika Lanjut",
  "Bahasa Inggris (Umum)",
  "PJOK",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Seni dan Budaya"
];

export const QUESTION_OPTIONS = [10, 20, 50, 100, 'FULL'] as const;
export type QuestionOption = typeof QUESTION_OPTIONS[number];
