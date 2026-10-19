/**
 * ExplainIt AI — Ask Anything. Understand Everything.
 * 
 * An accessible, multi-level AI question-answering system designed
 * to explain any topic tailored to any knowledge level and mode.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AskInputBox } from './components/AskInputBox';
import { LevelSelector } from './components/LevelSelector';
import { ModeSelector } from './components/ModeSelector';
import { AnswerCard } from './components/AnswerCard';
import { CategoryCards } from './components/CategoryCards';
import { PopularTopics } from './components/PopularTopics';
import { LearningPathView } from './components/LearningPathView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';

import type {
  UnderstandingLevel,
  ExplanationMode,
  StructuredAnswer,
  QuizItem,
  LearningPath,
  LearningConcept,
  Category,
  AppSettings,
} from './types/index';
import {
  getNextSimplerLevel,
  getNextDeeperLevel,
  MODE_METADATA,
} from './utils/explainLogic';
import {
  DEFAULT_LEARNING_PATHS,
  generateDynamicExplanation,
  generateQuizForAnswer,
} from './utils/explainEngine';
import { Sparkles, Compass, Clock, Trash2, ArrowRight } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultLevel: 'Normal',
  defaultMode: 'Standard',
  voice: { rate: 1.0, pitch: 1.0 },
  autoReadAloud: false,
};

export default function App() {
  // Navigation & Tab State
  const [currentTab, setCurrentTab] = useState<'home' | 'ask' | 'learn' | 'history' | 'settings'>('home');

  // Question & Query State
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentLevel, setCurrentLevel] = useState<UnderstandingLevel>('Normal');
  const [currentMode, setCurrentMode] = useState<ExplanationMode>('Standard');

  // Answer & Quiz State
  const [activeAnswer, setActiveAnswer] = useState<StructuredAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeQuizItems, setActiveQuizItems] = useState<QuizItem[]>([]);

  // History State
  const [history, setHistory] = useState<StructuredAnswer[]>(() => {
    try {
      const saved = localStorage.getItem('explainit_history');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  // Learning Paths State
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => {
    try {
      const saved = localStorage.getItem('explainit_paths');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_LEARNING_PATHS;
  });
  const [activePathId, setActivePathId] = useState<string>(DEFAULT_LEARNING_PATHS[0].id);

  // Settings & Theme
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('explainit_settings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_SETTINGS;
  });

  const [isDark, setIsDark] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [engineName, setEngineName] = useState('explainit-demo-engine');

  // Sync settings and theme
  useEffect(() => {
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveDark =
      settings.theme === 'dark' || (settings.theme === 'system' && isSystemDark);

    setIsDark(effectiveDark);
    if (effectiveDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('explainit_settings', JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('explainit_history', JSON.stringify(history));
    } catch (_) {}
  }, [history]);

  // Sync learning paths to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('explainit_paths', JSON.stringify(learningPaths));
    } catch (_) {}
  }, [learningPaths]);

  // Check backend server status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasApiKey);
        setEngineName(data.engine);
      })
      .catch(() => {
        console.log('[ExplainIt AI] Operating in client fallback mode');
      });
  }, []);

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: isDark ? 'light' : 'dark',
    }));
  };

  /**
   * Core Explain API Fetcher
   */
  const executeExplain = async (
    questionToAsk: string,
    levelToUse: UnderstandingLevel,
    modeToUse: ExplanationMode,
    isRewriteOperation = false
  ) => {
    if (!questionToAsk.trim()) return;

    if (isRewriteOperation) {
      setIsRewriting(true);
    } else {
      setIsLoading(true);
    }
    setIsQuizOpen(false);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToAsk,
          level: levelToUse,
          mode: modeToUse,
        }),
      });

      let answerData: StructuredAnswer;
      if (res.ok) {
        answerData = await res.json();
      } else {
        // Fallback to client-side engine if server returned error
        answerData = generateDynamicExplanation(questionToAsk, levelToUse, modeToUse);
      }

      setActiveAnswer(answerData);
      setCurrentLevel(levelToUse);
      setCurrentMode(modeToUse);

      // Add to history (avoid duplicates at the top)
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== answerData.id && item.question !== answerData.question);
        return [answerData, ...filtered];
      });

      // Prepare quiz items in background
      const quizRes = generateQuizForAnswer(answerData);
      setActiveQuizItems(quizRes);

      // If on home, keep on home or switch to ask depending on preference
    } catch (err) {
      console.warn('[ExplainIt AI] Fetch error, falling back locally:', err);
      const fallback = generateDynamicExplanation(questionToAsk, levelToUse, modeToUse);
      setActiveAnswer(fallback);
      setActiveQuizItems(generateQuizForAnswer(fallback));
      setHistory((prev) => [fallback, ...prev.filter((i) => i.question !== fallback.question)]);
    } finally {
      setIsLoading(false);
      setIsRewriting(false);
    }
  };

  const handleAskQuestion = (q?: string) => {
    const targetQ = q || currentQuestion;
    if (!targetQ.trim()) return;
    executeExplain(targetQ, currentLevel, currentMode, false);
  };

  /**
   * Action: Change Level (Rewrites the same answer at that complexity level)
   */
  const handleChangeLevel = (newLevel: UnderstandingLevel) => {
    if (!activeAnswer || isRewriting) return;
    setCurrentLevel(newLevel);
    executeExplain(activeAnswer.question, newLevel, activeAnswer.mode, true);
  };

  /**
   * Action: Explain Simpler
   */
  const handleExplainSimpler = () => {
    if (!activeAnswer) return;
    const nextSimpler = getNextSimplerLevel(activeAnswer.level);
    handleChangeLevel(nextSimpler);
  };

  /**
   * Action: Explain Deeper
   */
  const handleExplainDeeper = () => {
    if (!activeAnswer) return;
    const nextDeeper = getNextDeeperLevel(activeAnswer.level);
    handleChangeLevel(nextDeeper);
  };

  /**
   * Action: Give an Example
   */
  const handleGiveExample = () => {
    if (!activeAnswer) return;
    const extraExample = `Here's another practical analogy: imagine you have a bicycle vs a jet engine — the basic concept remains unchanged, but each part adapts to the load it handles.`;
    setActiveAnswer({
      ...activeAnswer,
      extraExample: activeAnswer.extraExample ? activeAnswer.extraExample : extraExample,
    });
  };

  /**
   * Action: Summarize
   */
  const handleSummarize = () => {
    if (!activeAnswer) return;
    const summary = `TL;DR for ${activeAnswer.level} (${activeAnswer.mode}): ${activeAnswer.quickAnswer} In short, ${activeAnswer.keyPoints[0] || 'the core mechanism remains simple and universal.'}`;
    setActiveAnswer({
      ...activeAnswer,
      summary,
    });
  };

  /**
   * Action: Quiz Me
   */
  const handleToggleQuiz = () => {
    if (!isQuizOpen && (!activeQuizItems || activeQuizItems.length === 0) && activeAnswer) {
      setActiveQuizItems(generateQuizForAnswer(activeAnswer));
    }
    setIsQuizOpen(!isQuizOpen);
  };

  /**
   * Explore concept from Learning Path
   */
  const handleExploreConcept = (concept: LearningConcept) => {
    setCurrentQuestion(concept.suggestedQuestion);
    setCurrentLevel(concept.complexity);
    executeExplain(concept.suggestedQuestion, concept.complexity, currentMode, false);
    setCurrentTab('ask');
  };

  /**
   * Update Learning Concept Status (mastered / revisit)
   */
  const handleUpdateConceptStatus = (
    pathId: string,
    conceptId: string,
    newStatus: 'not_started' | 'in_progress' | 'mastered' | 'revisit'
  ) => {
    setLearningPaths((prev) =>
      prev.map((p) => {
        if (p.id !== pathId) return p;
        return {
          ...p,
          lastActiveAt: Date.now(),
          concepts: p.concepts.map((c) => {
            if (c.id !== conceptId) return c;
            return {
              ...c,
              status: newStatus,
              masteredAt: newStatus === 'mastered' ? Date.now() : undefined,
            };
          }),
        };
      })
    );
  };

  const handleAddCustomPath = (newPath: LearningPath) => {
    setLearningPaths((prev) => [newPath, ...prev]);
    setActivePathId(newPath.id);
  };

  const handleSelectRecent = (ans: StructuredAnswer) => {
    setActiveAnswer(ans);
    setCurrentQuestion(ans.question);
    setCurrentLevel(ans.level);
    setCurrentMode(ans.mode);
    setActiveQuizItems(generateQuizForAnswer(ans));
  };

  const handleDeleteHistorySingle = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  const handleResetAppData = () => {
    localStorage.removeItem('explainit_history');
    localStorage.removeItem('explainit_paths');
    localStorage.removeItem('explainit_settings');
    setHistory([]);
    setLearningPaths(DEFAULT_LEARNING_PATHS);
    setSettings(DEFAULT_SETTINGS);
    setActiveAnswer(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        currentMode={currentMode}
        currentLevel={currentLevel}
        historyCount={history.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ===================== TAB 1: HOME ===================== */}
        {currentTab === 'home' && (
          <div className="space-y-10 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-4 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold border border-blue-200 dark:border-blue-800 shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>ExplainIt AI</span>
                <span className="text-blue-300 dark:text-blue-700">•</span>
                <span className="font-medium">For Learners of All Ages</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Ask Anything.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                  Understand Everything.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Break down any topic in science, tech, math, or life into language tuned exactly to your knowledge level — from toddler to academic researcher.
              </p>
            </div>

            {/* Core Feature: Large Ask Box */}
            <div className="space-y-6">
              <AskInputBox
                question={currentQuestion}
                onChangeQuestion={setCurrentQuestion}
                onSubmit={() => handleAskQuestion()}
                isLoading={isLoading}
                placeholder="What do you want to understand?"
                autoFocus={true}
              />

              {/* Understanding Level Selector */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <LevelSelector
                  selectedLevel={currentLevel}
                  onSelectLevel={(lvl) => {
                    setCurrentLevel(lvl);
                    if (activeAnswer) {
                      handleChangeLevel(lvl);
                    }
                  }}
                  isRewriting={isRewriting}
                  label="Select Understanding Level"
                  size="md"
                />
              </div>

              {/* Modes Selector */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <ModeSelector
                  selectedMode={currentMode}
                  onSelectMode={(m) => {
                    setCurrentMode(m);
                    if (activeAnswer) {
                      executeExplain(activeAnswer.question, currentLevel, m, true);
                    }
                  }}
                  disabled={isLoading || isRewriting}
                />
              </div>
            </div>

            {/* If an active answer exists, display the Answer Card right here on Home */}
            {activeAnswer && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Latest Explanation
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAnswer(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Collapse
                  </button>
                </div>
                <AnswerCard
                  answer={activeAnswer}
                  onChangeLevel={handleChangeLevel}
                  onExplainSimpler={handleExplainSimpler}
                  onExplainDeeper={handleExplainDeeper}
                  onGiveExample={handleGiveExample}
                  onSummarize={handleSummarize}
                  onToggleQuiz={handleToggleQuiz}
                  isQuizOpen={isQuizOpen}
                  quizItems={activeQuizItems}
                  isRewriting={isRewriting}
                  speechRate={settings.voice.rate}
                  speechPitch={settings.voice.pitch}
                />
              </div>
            )}

            {/* Popular Topics Section */}
            <PopularTopics
              onSelectTopic={(topic) => {
                setCurrentQuestion(topic);
                executeExplain(topic, currentLevel, currentMode, false);
              }}
            />

            {/* Recent Questions Preview */}
            {history.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Recent Questions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('history')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all ({history.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {history.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectRecent(item)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span className="text-blue-600 dark:text-blue-400">{item.level}</span>
                        <span>{item.mode} Mode</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            <div className="pt-4">
              <CategoryCards
                onSelectCategoryPrompt={(prompt) => {
                  setCurrentQuestion(prompt);
                  executeExplain(prompt, currentLevel, currentMode, false);
                }}
              />
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ASK AI ===================== */}
        {currentTab === 'ask' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ask AI Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ask any question, rewrite across understanding levels, and take comprehension quizzes.
              </p>
            </div>

            <AskInputBox
              question={currentQuestion}
              onChangeQuestion={setCurrentQuestion}
              onSubmit={() => handleAskQuestion()}
              isLoading={isLoading}
              placeholder="What do you want to understand?"
              autoFocus={true}
            />

            {/* Active Answer Workspace */}
            {activeAnswer ? (
              <AnswerCard
                answer={activeAnswer}
                onChangeLevel={handleChangeLevel}
                onExplainSimpler={handleExplainSimpler}
                onExplainDeeper={handleExplainDeeper}
                onGiveExample={handleGiveExample}
                onSummarize={handleSummarize}
                onToggleQuiz={handleToggleQuiz}
                isQuizOpen={isQuizOpen}
                quizItems={activeQuizItems}
                isRewriting={isRewriting}
                speechRate={settings.voice.rate}
                speechPitch={settings.voice.pitch}
              />
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Ready to explain anything
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                    Type a question above or pick one of the popular topics to see a 4-part structured breakdown.
                  </p>
                </div>
                <PopularTopics
                  onSelectTopic={(t) => {
                    setCurrentQuestion(t);
                    executeExplain(t, currentLevel, currentMode, false);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: LEARN (PERSONALIZED LEARNING PATH) ===================== */}
        {currentTab === 'learn' && (
          <LearningPathView
            paths={learningPaths}
            activePathId={activePathId}
            onSelectPath={setActivePathId}
            onUpdateConceptStatus={handleUpdateConceptStatus}
            onExploreConcept={handleExploreConcept}
            onAddCustomPath={handleAddCustomPath}
          />
        )}

        {/* ===================== TAB 4: HISTORY ===================== */}
        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onSelectAnswer={(ans) => {
              setActiveAnswer(ans);
              setCurrentQuestion(ans.question);
              setCurrentLevel(ans.level);
              setCurrentMode(ans.mode);
              setActiveQuizItems(generateQuizForAnswer(ans));
              setCurrentTab('ask');
            }}
            onDeleteSingle={handleDeleteHistorySingle}
            onClearAll={handleClearAllHistory}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {/* ===================== TAB 5: SETTINGS ===================== */}
        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={(newPartial) => setSettings((prev) => ({ ...prev, ...newPartial }))}
            onResetData={handleResetAppData}
            hasApiKey={hasApiKey}
            engineName={engineName}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">ExplainIt AI</span>
            <span>—</span>
            <span>Ask Anything. Understand Everything.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Kid • Student • Standard • Simple</span>
            <span>•</span>
            <span>5 Knowledge Levels</span>
            <span>•</span>
            <span>Personalized Learning Paths</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
