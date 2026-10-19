import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';
import type { QuizItem } from '../types/index';
import { calculateQuizScore } from '../utils/explainLogic';

interface QuizCardProps {
  items: QuizItem[];
  conceptTitle?: string;
  onComplete?: (score: { correct: number; total: number; passed: boolean }) => void;
  onClose?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  items,
  conceptTitle,
  onComplete,
  onClose,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return; // locked once checked
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const allAnswered = items.every((q) => userAnswers[q.id] !== undefined);
  const scoreResult = calculateQuizScore(items, userAnswers);

  const handleSubmitQuiz = () => {
    setShowResults(true);
    if (onComplete) {
      onComplete({
        correct: scoreResult.correctCount,
        total: scoreResult.totalCount,
        passed: scoreResult.passed,
      });
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-200 dark:border-blue-900/60 p-5 sm:p-7 shadow-xl shadow-blue-500/5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            🎯
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Quiz Checkpoint
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {conceptTitle ? `Test your comprehension on "${conceptTitle}"` : 'Verify your understanding with 3 quick questions'}
            </p>
          </div>
        </div>

        {showResults && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            scoreResult.passed
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            <Award className="w-4 h-4" />
            <span>Score: {scoreResult.correctCount} / {scoreResult.totalCount} ({scoreResult.percentage}%)</span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {items.map((item, qIdx) => {
          const selectedOption = userAnswers[item.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === item.correctIndex;

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60"
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {item.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-0 sm:pl-8">
                {item.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === item.correctIndex;

                  let optionStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400';

                  if (showResults) {
                    if (isThisCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                    } else {
                      optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-500';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-semibold ring-1 ring-blue-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={showResults}
                      onClick={() => handleSelectOption(item.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {showResults && (
                        <span>
                          {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                          {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when results are shown */}
              {showResults && (
                <div className="mt-3 pl-0 sm:pl-8 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isCorrect ? '✨ Great job: ' : '💡 Explanation: '}
                  </span>
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {!showResults ? (
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Object.keys(userAnswers).length} of {items.length} answered
            </span>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmitQuiz}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                allAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Check Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Done
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
