import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  HelpCircle,
  FileText,
  Lightbulb,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Share2,
  Layers,
  GraduationCap,
} from 'lucide-react';
import type { StructuredAnswer, UnderstandingLevel, ExplanationMode, QuizItem } from '../types/index';
import { LevelSelector } from './LevelSelector';
import { QuizCard } from './QuizCard';
import { MODE_METADATA } from '../utils/explainLogic';
import { createSpeechController, SpeechController } from '../utils/speech';

interface AnswerCardProps {
  answer: StructuredAnswer;
  onChangeLevel: (newLevel: UnderstandingLevel) => void;
  onExplainSimpler: () => void;
  onExplainDeeper: () => void;
  onGiveExample: () => void;
  onSummarize: () => void;
  onToggleQuiz: () => void;
  isQuizOpen: boolean;
  quizItems?: QuizItem[];
  isRewriting?: boolean;
  onBookmarkToggle?: (answerId: string) => void;
  isBookmarked?: boolean;
  speechRate?: number;
  speechPitch?: number;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  onChangeLevel,
  onExplainSimpler,
  onExplainDeeper,
  onGiveExample,
  onSummarize,
  onToggleQuiz,
  isQuizOpen,
  quizItems,
  isRewriting = false,
  onBookmarkToggle,
  isBookmarked = false,
  speechRate = 1.0,
  speechPitch = 1.0,
}) => {
  const [copied, setCopied] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [speechController, setSpeechController] = useState<SpeechController | null>(null);

  const modeMeta = MODE_METADATA[answer.mode];

  // Initialize speech controller
  useEffect(() => {
    const ctrl = createSpeechController(speechRate, speechPitch);
    setSpeechController(ctrl);

    return () => {
      ctrl.stop();
    };
  }, [speechRate, speechPitch]);

  const handleReadAloudToggle = () => {
    if (!speechController) return;

    if (speechState === 'speaking') {
      speechController.pause();
      setSpeechState('paused');
    } else if (speechState === 'paused') {
      speechController.resume();
      setSpeechState('speaking');
    } else {
      // Build speech text from all 4 sections
      const speechText = `
        ${answer.question}.
        Quick Answer: ${answer.quickAnswer}.
        Easy Explanation: ${answer.easyExplanation}.
        Example: ${answer.example}.
        Key Points: ${answer.keyPoints.join('. ')}.
      `;

      speechController.speak(
        speechText,
        () => setSpeechState('idle'),
        () => setSpeechState('idle')
      );
      setSpeechState('speaking');
    }
  };

  const handleStopSpeech = () => {
    if (speechController) {
      speechController.stop();
      setSpeechState('idle');
    }
  };

  const handleCopy = () => {
    const textToCopy = `Question: ${answer.question}\nLevel: ${answer.level} (${answer.mode} Mode)\n\n1. Quick Answer:\n${answer.quickAnswer}\n\n2. Easy Explanation:\n${answer.easyExplanation}\n\n3. Example:\n${answer.example}\n\n4. Key Points:\n${answer.keyPoints.map((k) => `• ${k}`).join('\n')}\n\n— Explained with ExplainIt AI`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Top Meta Bar */}
      <div className="px-5 sm:px-7 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Mode Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${modeMeta.badgeClass}`}>
            <span>{modeMeta.emoji}</span>
            <span>{modeMeta.name}</span>
          </span>

          {/* Level Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {answer.level} Level
          </span>

          {answer.category && (
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400">
              {answer.category}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(answer.id)}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                isBookmarked
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this answer'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this answer'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Copy entire explanation"
            aria-label="Copy entire explanation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* The Question */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 block">
            Question
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {answer.question}
          </h2>
        </div>

        {/* Interactive Understanding Level Selector (Rewrites answer dynamically on level change) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <LevelSelector
            selectedLevel={answer.level}
            onSelectLevel={onChangeLevel}
            isRewriting={isRewriting}
            label="Adjust Understanding Level (Rewrites Answer)"
            size="sm"
          />
        </div>

        {/* 1. QUICK ANSWER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border-l-4 border-blue-600 dark:border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-blue-900 dark:text-blue-300">
              Quick Answer
            </h3>
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-semibold leading-relaxed">
            {answer.quickAnswer}
          </p>
        </div>

        {/* 2. EASY EXPLANATION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Easy Explanation
            </h3>
          </div>
          <div className="pl-0 sm:pl-8">
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {answer.easyExplanation}
            </p>
          </div>
        </div>

        {/* 3. EXAMPLE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-amber-900 dark:text-amber-300">
                Real-World Example
              </h3>
            </div>
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed pl-0 sm:pl-8 italic">
            "{answer.example}"
          </p>

          {answer.extraExample && (
            <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/60 pl-0 sm:pl-8">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                💡 Additional Example:
              </span>
              <p className="text-slate-800 dark:text-slate-200 text-sm italic">
                "{answer.extraExample}"
              </p>
            </div>
          )}
        </div>

        {/* 4. KEY POINTS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Key Points
            </h3>
          </div>
          <ul className="pl-0 sm:pl-8 space-y-2">
            {answer.keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BONUS: Formulas or Study Tips (Student Mode) */}
        {answer.formulasOrTips && answer.formulasOrTips.length > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
            <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Student Study Reference & Formulas</span>
            </div>
            <div className="space-y-1.5 pl-6 font-mono text-xs text-emerald-900 dark:text-emerald-200">
              {answer.formulasOrTips.map((tip, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-300/50 dark:border-emerald-700/50">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Summary Card (Triggered by 'Summarize') */}
        {answer.summary && (
          <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/80">
            <div className="flex items-center gap-2 mb-1 text-violet-800 dark:text-violet-300 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>Quick TL;DR Summary</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed pl-6">
              {answer.summary}
            </p>
          </div>
        )}

        {/* Interactive Quiz Checkpoint (Triggered by 'Quiz Me') */}
        {isQuizOpen && quizItems && quizItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <QuizCard
              items={quizItems}
              conceptTitle={answer.question}
              onClose={onToggleQuiz}
            />
          </div>
        )}
      </div>

      {/* REQUIRED CORE ACTION BUTTONS TOOLBAR */}
      {/* - Explain Simpler, - Explain Deeper, - Give an Example, - Summarize, - Quiz Me, - Read Aloud */}
      <div className="px-5 sm:px-7 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
          <span>Explore Next</span>
          {speechState !== 'idle' && (
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{speechState === 'speaking' ? 'Reading aloud...' : 'Audio paused'}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Explain Simpler */}
          <button
            type="button"
            disabled={isRewriting}
            onClick={onExplainSimpler}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-blue-400 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Explain Simpler</span>
          </button>

          {/* 2. Explain Deeper */}
          <button
            type="button"
            disabled={isRewriting}
            onClick={onExplainDeeper}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-blue-400 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Explain Deeper</span>
          </button>

          {/* 3. Give an Example */}
          <button
            type="button"
            disabled={isRewriting}
            onClick={onGiveExample}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Give an Example</span>
          </button>

          {/* 4. Summarize */}
          <button
            type="button"
            disabled={isRewriting}
            onClick={onSummarize}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-violet-400 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4 text-violet-500" />
            <span>Summarize</span>
          </button>

          {/* 5. Quiz Me */}
          <button
            type="button"
            onClick={onToggleQuiz}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs border ${
              isQuizOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-blue-400'
            }`}
          >
            <HelpCircle className={`w-4 h-4 ${isQuizOpen ? 'text-white' : 'text-blue-500'}`} />
            <span>{isQuizOpen ? 'Hide Quiz' : 'Quiz Me'}</span>
          </button>

          {/* 6. Read Aloud */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={handleReadAloudToggle}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs border ${
                speechState === 'speaking'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : speechState === 'paused'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-emerald-400'
              }`}
              title="Listen to explanation using text-to-speech"
            >
              {speechState === 'speaking' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : speechState === 'paused' ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>

            {speechState !== 'idle' && (
              <button
                type="button"
                onClick={handleStopSpeech}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Stop audio reading"
                aria-label="Stop audio reading"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
