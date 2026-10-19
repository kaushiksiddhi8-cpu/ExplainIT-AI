export type UnderstandingLevel = 'Very Simple' | 'Simple' | 'Normal' | 'Detailed' | 'Advanced';

export type ExplanationMode = 'Kid' | 'Student' | 'Standard' | 'Simple';

export type Category = 
  | 'Study'
  | 'Science'
  | 'Maths'
  | 'Technology'
  | 'General Knowledge'
  | 'Languages'
  | 'How Things Work';

export interface StructuredAnswer {
  id: string;
  question: string;
  level: UnderstandingLevel;
  mode: ExplanationMode;
  timestamp: number;
  quickAnswer: string;
  easyExplanation: string;
  example: string;
  keyPoints: string[];
  formulasOrTips?: string[];
  tags?: string[];
  category?: Category;
  summary?: string;
  extraExample?: string;
  isBookmarked?: boolean;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  items: QuizItem[];
  userAnswers: Record<string, number>;
  isCompleted: boolean;
  score: number;
}

export interface LearningConcept {
  id: string;
  title: string;
  description: string;
  complexity: UnderstandingLevel;
  suggestedQuestion: string;
  subTopic: string;
  status: 'not_started' | 'in_progress' | 'mastered' | 'revisit';
  order: number;
  masteredAt?: number;
  notes?: string;
  quizScore?: { correct: number; total: number };
}

export interface LearningPath {
  id: string;
  broadTopic: string;
  description: string;
  icon: string;
  color: string;
  concepts: LearningConcept[];
  createdAt: number;
  lastActiveAt: number;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  voiceURI?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultLevel: UnderstandingLevel;
  defaultMode: ExplanationMode;
  voice: VoiceSettings;
  autoReadAloud: boolean;
}
