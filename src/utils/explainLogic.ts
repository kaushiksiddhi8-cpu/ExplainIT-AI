import type { UnderstandingLevel, ExplanationMode, LearningConcept, QuizItem, StructuredAnswer } from '../types/index';

export const LEVEL_RANKS: Record<UnderstandingLevel, number> = {
  'Very Simple': 1,
  'Simple': 2,
  'Normal': 3,
  'Detailed': 4,
  'Advanced': 5,
};

export const LEVELS: UnderstandingLevel[] = [
  'Very Simple',
  'Simple',
  'Normal',
  'Detailed',
  'Advanced',
];

export const MODES: ExplanationMode[] = [
  'Kid',
  'Student',
  'Standard',
  'Simple',
];

export function complexityToRank(level: UnderstandingLevel): number {
  return LEVEL_RANKS[level] || 3;
}

export function rankToComplexity(rank: number): UnderstandingLevel {
  const clamped = Math.max(1, Math.min(5, rank));
  const entry = Object.entries(LEVEL_RANKS).find(([_, r]) => r === clamped);
  return (entry ? entry[0] : 'Normal') as UnderstandingLevel;
}

export function getNextSimplerLevel(current: UnderstandingLevel): UnderstandingLevel {
  const currentRank = complexityToRank(current);
  if (currentRank <= 1) return 'Very Simple';
  return rankToComplexity(currentRank - 1);
}

export function getNextDeeperLevel(current: UnderstandingLevel): UnderstandingLevel {
  const currentRank = complexityToRank(current);
  if (currentRank >= 5) return 'Advanced';
  return rankToComplexity(currentRank + 1);
}

export interface PathProgress {
  total: number;
  mastered: number;
  revisit: number;
  inProgress: number;
  notStarted: number;
  percentMastered: number;
  nextConcept?: LearningConcept;
}

export function calculatePathProgress(concepts: LearningConcept[]): PathProgress {
  const total = concepts.length;
  if (total === 0) {
    return {
      total: 0,
      mastered: 0,
      revisit: 0,
      inProgress: 0,
      notStarted: 0,
      percentMastered: 0,
    };
  }

  let mastered = 0;
  let revisit = 0;
  let inProgress = 0;
  let notStarted = 0;
  let nextConcept: LearningConcept | undefined;

  for (const c of concepts) {
    if (c.status === 'mastered') mastered++;
    else if (c.status === 'revisit') revisit++;
    else if (c.status === 'in_progress') inProgress++;
    else notStarted++;

    if (!nextConcept && (c.status === 'in_progress' || c.status === 'revisit' || c.status === 'not_started')) {
      nextConcept = c;
    }
  }

  const percentMastered = Math.round((mastered / total) * 100);

  return {
    total,
    mastered,
    revisit,
    inProgress,
    notStarted,
    percentMastered,
    nextConcept,
  };
}

export function orderConceptsByComplexity(concepts: LearningConcept[]): LearningConcept[] {
  return [...concepts].sort((a, b) => {
    const rankDiff = complexityToRank(a.complexity) - complexityToRank(b.complexity);
    if (rankDiff !== 0) return rankDiff;
    return a.order - b.order;
  });
}

export function calculateQuizScore(
  items: QuizItem[],
  userAnswers: Record<string, number>
): { correctCount: number; totalCount: number; percentage: number; passed: boolean } {
  const totalCount = items.length;
  if (totalCount === 0) {
    return { correctCount: 0, totalCount: 0, percentage: 0, passed: false };
  }

  let correctCount = 0;
  for (const item of items) {
    if (userAnswers[item.id] !== undefined && userAnswers[item.id] === item.correctIndex) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / totalCount) * 100);
  const passed = percentage >= 66; // 2 out of 3 or higher is a pass

  return { correctCount, totalCount, percentage, passed };
}

export function filterHistory(
  history: StructuredAnswer[],
  searchQuery: string,
  levelFilter?: UnderstandingLevel | 'all',
  modeFilter?: ExplanationMode | 'all'
): StructuredAnswer[] {
  const q = searchQuery.trim().toLowerCase();

  return history.filter((item) => {
    if (levelFilter && levelFilter !== 'all' && item.level !== levelFilter) {
      return false;
    }
    if (modeFilter && modeFilter !== 'all' && item.mode !== modeFilter) {
      return false;
    }
    if (!q) return true;

    return (
      item.question.toLowerCase().includes(q) ||
      item.quickAnswer.toLowerCase().includes(q) ||
      item.easyExplanation.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });
}

export interface ModeMeta {
  mode: ExplanationMode;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  badgeClass: string;
  cardBorderClass: string;
  emoji: string;
}

export const MODE_METADATA: Record<ExplanationMode, ModeMeta> = {
  Kid: {
    mode: 'Kid',
    name: 'Kid Mode',
    tagline: 'Playful, safe, and super easy',
    description: 'Very easy language, fun everyday analogies (like toys and animals), and warm encouragement.',
    audience: 'Ages 5–12 & Curious Kids',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    cardBorderClass: 'hover:border-amber-400 dark:hover:border-amber-500',
    emoji: '🎈',
  },
  Student: {
    mode: 'Student',
    name: 'Student Mode',
    tagline: 'Academic, structured, and exam-ready',
    description: 'Educational depth, key formulas/theorems, mnemonics, study takeaways, and practice points.',
    audience: 'Middle, High School & College Students',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    cardBorderClass: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    emoji: '🎓',
  },
  Standard: {
    mode: 'Standard',
    name: 'Standard Mode',
    tagline: 'Balanced, clear, and comprehensive',
    description: 'Natural explanations for general users, balancing intuitive analogies with real facts.',
    audience: 'Adults, Professionals & General Curious Minds',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
    cardBorderClass: 'hover:border-indigo-400 dark:hover:border-indigo-500',
    emoji: '✨',
  },
  Simple: {
    mode: 'Simple',
    name: 'Simple Mode',
    tagline: 'Short sentences, zero fluff',
    description: 'Short sentences and easy vocabulary for beginners, ESL learners, or quick skim reading.',
    audience: 'Beginners & ESL Learners',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-700',
    cardBorderClass: 'hover:border-sky-400 dark:hover:border-sky-500',
    emoji: '🌱',
  },
};
