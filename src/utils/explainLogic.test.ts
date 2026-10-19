import test from 'node:test';
import assert from 'node:assert/strict';
import {
  complexityToRank,
  rankToComplexity,
  getNextSimplerLevel,
  getNextDeeperLevel,
  calculatePathProgress,
  orderConceptsByComplexity,
  calculateQuizScore,
  filterHistory,
  LEVELS,
  MODES,
} from './explainLogic.ts';
import type { LearningConcept, QuizItem, StructuredAnswer } from '../types/index.ts';

test('complexityToRank converts all 5 levels correctly', () => {
  assert.equal(complexityToRank('Very Simple'), 1);
  assert.equal(complexityToRank('Simple'), 2);
  assert.equal(complexityToRank('Normal'), 3);
  assert.equal(complexityToRank('Detailed'), 4);
  assert.equal(complexityToRank('Advanced'), 5);
});

test('rankToComplexity clamps out of range ranks', () => {
  assert.equal(rankToComplexity(0), 'Very Simple');
  assert.equal(rankToComplexity(1), 'Very Simple');
  assert.equal(rankToComplexity(3), 'Normal');
  assert.equal(rankToComplexity(5), 'Advanced');
  assert.equal(rankToComplexity(10), 'Advanced');
});

test('getNextSimplerLevel drops complexity by one step without underflowing', () => {
  assert.equal(getNextSimplerLevel('Advanced'), 'Detailed');
  assert.equal(getNextSimplerLevel('Detailed'), 'Normal');
  assert.equal(getNextSimplerLevel('Normal'), 'Simple');
  assert.equal(getNextSimplerLevel('Simple'), 'Very Simple');
  assert.equal(getNextSimplerLevel('Very Simple'), 'Very Simple');
});

test('getNextDeeperLevel increases complexity by one step without overflowing', () => {
  assert.equal(getNextDeeperLevel('Very Simple'), 'Simple');
  assert.equal(getNextDeeperLevel('Simple'), 'Normal');
  assert.equal(getNextDeeperLevel('Normal'), 'Detailed');
  assert.equal(getNextDeeperLevel('Detailed'), 'Advanced');
  assert.equal(getNextDeeperLevel('Advanced'), 'Advanced');
});

test('calculatePathProgress computes accurate stats and completion percentage', () => {
  const concepts: LearningConcept[] = [
    {
      id: 'c1',
      title: 'Gravity Basics',
      description: 'Falling apples',
      complexity: 'Very Simple',
      suggestedQuestion: 'Why do things fall?',
      subTopic: 'Gravity',
      status: 'mastered',
      order: 1,
    },
    {
      id: 'c2',
      title: 'Newtonian Gravitation',
      description: 'Inverse square law',
      complexity: 'Simple',
      suggestedQuestion: 'How does gravity pull planets?',
      subTopic: 'Gravity',
      status: 'mastered',
      order: 2,
    },
    {
      id: 'c3',
      title: 'General Relativity',
      description: 'Spacetime curvature',
      complexity: 'Detailed',
      suggestedQuestion: 'How does mass bend space?',
      subTopic: 'Curvature',
      status: 'revisit',
      order: 3,
    },
    {
      id: 'c4',
      title: 'Gravitational Waves',
      description: 'Ripples in spacetime',
      complexity: 'Advanced',
      suggestedQuestion: 'What are gravitational waves?',
      subTopic: 'Curvature',
      status: 'not_started',
      order: 4,
    },
  ];

  const progress = calculatePathProgress(concepts);
  assert.equal(progress.total, 4);
  assert.equal(progress.mastered, 2);
  assert.equal(progress.revisit, 1);
  assert.equal(progress.notStarted, 1);
  assert.equal(progress.percentMastered, 50);
  assert.equal(progress.nextConcept?.id, 'c3'); // first non-mastered item
});

test('orderConceptsByComplexity sorts from foundational to advanced', () => {
  const concepts: LearningConcept[] = [
    {
      id: 'c3',
      title: 'Advanced Relativity',
      description: '',
      complexity: 'Advanced',
      suggestedQuestion: '',
      subTopic: '',
      status: 'not_started',
      order: 1,
    },
    {
      id: 'c1',
      title: 'Baby Physics',
      description: '',
      complexity: 'Very Simple',
      suggestedQuestion: '',
      subTopic: '',
      status: 'not_started',
      order: 1,
    },
    {
      id: 'c2',
      title: 'School Physics',
      description: '',
      complexity: 'Normal',
      suggestedQuestion: '',
      subTopic: '',
      status: 'not_started',
      order: 1,
    },
  ];

  const sorted = orderConceptsByComplexity(concepts);
  assert.equal(sorted[0].id, 'c1');
  assert.equal(sorted[1].id, 'c2');
  assert.equal(sorted[2].id, 'c3');
});

test('calculateQuizScore calculates correct count and pass threshold', () => {
  const items: QuizItem[] = [
    { id: 'q1', question: 'Q1', options: ['A', 'B'], correctIndex: 0, explanation: '' },
    { id: 'q2', question: 'Q2', options: ['A', 'B'], correctIndex: 1, explanation: '' },
    { id: 'q3', question: 'Q3', options: ['A', 'B'], correctIndex: 0, explanation: '' },
  ];

  const userAnswersPassing = { q1: 0, q2: 1, q3: 1 }; // 2 / 3 = 67%
  const resultPass = calculateQuizScore(items, userAnswersPassing);
  assert.equal(resultPass.correctCount, 2);
  assert.equal(resultPass.totalCount, 3);
  assert.equal(resultPass.passed, true);

  const userAnswersFailing = { q1: 1, q2: 0, q3: 1 }; // 0 / 3
  const resultFail = calculateQuizScore(items, userAnswersFailing);
  assert.equal(resultFail.correctCount, 0);
  assert.equal(resultFail.passed, false);
});

test('filterHistory filters by query, level, and mode', () => {
  const sampleHistory: StructuredAnswer[] = [
    {
      id: '1',
      question: 'Why is the sky blue?',
      level: 'Simple',
      mode: 'Kid',
      timestamp: 1000,
      quickAnswer: 'Sunlight scatters blue light.',
      easyExplanation: 'Air bounces blue colors the most.',
      example: 'Flashlight through milk and water.',
      keyPoints: ['Light is made of rainbow colors', 'Blue scatters most'],
      tags: ['science', 'sky'],
    },
    {
      id: '2',
      question: 'How does photosynthesis work?',
      level: 'Detailed',
      mode: 'Student',
      timestamp: 2000,
      quickAnswer: 'Plants convert sunlight into chemical energy.',
      easyExplanation: 'Chloroplasts absorb photons to split water.',
      example: 'Solar-powered battery in leaves.',
      keyPoints: ['Requires CO2, H2O, light', 'Produces Glucose and O2'],
      tags: ['biology', 'plants'],
    },
  ];

  assert.equal(filterHistory(sampleHistory, 'sky').length, 1);
  assert.equal(filterHistory(sampleHistory, '', 'Detailed').length, 1);
  assert.equal(filterHistory(sampleHistory, '', 'all', 'Kid').length, 1);
  assert.equal(filterHistory(sampleHistory, 'nonexistent').length, 0);
});
