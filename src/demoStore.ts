export type Difficulty = 'Fácil' | 'Medio' | 'Difícil';

export interface Area {
  id: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
}

export interface QuestionOption {
  text: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  code: string;
  area: string;
  text: string;
  imageUrl?: string;
  difficulty: Difficulty;
  options: QuestionOption[];
  correctOptionIndex: number;
}

export interface ExamProcess {
  id: string;
  name: string;
  course: string;
  period: string;
  responsible: string;
  date: string;
  status: 'Borrador' | 'Listo';
  createdAt: string;
}

export interface ExamHistoryItem {
  id: string;
  processId: string;
  processName: string;
  versions: number;
  questionCount: number;
  createdAt: string;
}

const KEYS = {
  areas: 'exam_demo_areas',
  questions: 'exam_demo_questions',
  processes: 'exam_demo_processes',
  history: 'exam_demo_history',
};

const defaultAreas: Area[] = [
  { id: '1', name: 'Matemáticas IV', description: 'Álgebra, geometría y trigonometría avanzada.', status: 'Activo' },
  { id: '2', name: 'Historia Universal', description: 'Historia moderna y contemporánea.', status: 'Activo' },
];

const defaultQuestions: Question[] = [
  {
    id: '1', code: 'MAT-001', area: 'Matemáticas IV',
    text: 'Calcula la hipotenusa de un triángulo rectángulo cuyos catetos miden 3 cm y 4 cm.',
    difficulty: 'Fácil',
    options: [{ text: '6 cm' }, { text: '5 cm' }, { text: '7 cm' }, { text: '12 cm' }, { text: '9 cm' }],
    correctOptionIndex: 1,
  },
  {
    id: '2', code: 'MAT-002', area: 'Matemáticas IV',
    text: '¿Cuál es el resultado de 3² + 4²?',
    difficulty: 'Medio',
    options: [{ text: '7' }, { text: '12' }, { text: '25' }, { text: '49' }, { text: '16' }],
    correctOptionIndex: 2,
  },
  {
    id: '3', code: 'HIS-001', area: 'Historia Universal',
    text: '¿Qué acontecimiento de 1789 se considera un símbolo del inicio de la Revolución Francesa?',
    difficulty: 'Medio',
    options: [{ text: 'La Batalla de Waterloo' }, { text: 'La Toma de la Bastilla' }, { text: 'La coronación de Napoleón' }, { text: 'El Congreso de Viena' }, { text: 'La caída de Roma' }],
    correctOptionIndex: 1,
  },
  {
    id: '4', code: 'HIS-002', area: 'Historia Universal',
    text: '¿En qué siglo comenzó la Revolución Industrial en Gran Bretaña?',
    difficulty: 'Fácil',
    options: [{ text: 'Siglo XV' }, { text: 'Siglo XVI' }, { text: 'Siglo XVII' }, { text: 'Siglo XVIII' }, { text: 'Siglo XX' }],
    correctOptionIndex: 3,
  },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const demoStore = {
  getAreas: () => read<Area[]>(KEYS.areas, defaultAreas),
  saveAreas: (items: Area[]) => write(KEYS.areas, items),
  getQuestions: () => read<Question[]>(KEYS.questions, defaultQuestions),
  saveQuestions: (items: Question[]) => write(KEYS.questions, items),
  getProcesses: () => read<ExamProcess[]>(KEYS.processes, []),
  saveProcesses: (items: ExamProcess[]) => write(KEYS.processes, items),
  getHistory: () => read<ExamHistoryItem[]>(KEYS.history, []),
  saveHistory: (items: ExamHistoryItem[]) => write(KEYS.history, items),
  resetDemo: () => {
    write(KEYS.areas, defaultAreas);
    write(KEYS.questions, defaultQuestions);
    write(KEYS.processes, []);
    write(KEYS.history, []);
  },
};
