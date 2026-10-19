import React from 'react';
import type { UnderstandingLevel } from '../types/index';
import { LEVELS } from '../utils/explainLogic';

interface LevelSelectorProps {
  selectedLevel: UnderstandingLevel;
  onSelectLevel: (level: UnderstandingLevel) => void;
  isRewriting?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LEVEL_CONFIG: Record<
  UnderstandingLevel,
  { shortDesc: string; audience: string; color: string; badge: string }
> = {
  'Very Simple': {
    shortDesc: 'ELI5 & Kids',
    audience: 'Ages 5-10',
    color: 'from-amber-500 to-orange-500',
    badge: '1',
  },
  'Simple': {
    shortDesc: 'Beginner',
    audience: 'Clear & Plain',
    color: 'from-emerald-500 to-teal-500',
    badge: '2',
  },
  'Normal': {
    shortDesc: 'Balanced',
    audience: 'Everyday Adults',
    color: 'from-blue-500 to-indigo-500',
    badge: '3',
  },
  'Detailed': {
    shortDesc: 'In-Depth',
    audience: 'High School / Pro',
    color: 'from-indigo-500 to-purple-500',
    badge: '4',
  },
  'Advanced': {
    shortDesc: 'Academic',
    audience: 'College / Expert',
    color: 'from-purple-500 to-pink-500',
    badge: '5',
  },
};

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  isRewriting = false,
  label = 'Understanding Level',
  size = 'md',
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>{label}</span>
            {isRewriting && (
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
                (Rewriting answer...)
              </span>
            )}
          </label>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {LEVEL_CONFIG[selectedLevel].shortDesc} • {LEVEL_CONFIG[selectedLevel].audience}
          </span>
        </div>
      )}

      {/* Level Buttons Bar */}
      <div 
        className="grid grid-cols-5 gap-1 p-1 sm:p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
        role="radiogroup"
        aria-label="Select understanding complexity level"
      >
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level;
          const cfg = LEVEL_CONFIG[level];

          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isRewriting}
              onClick={() => onSelectLevel(level)}
              className={`relative flex flex-col items-center justify-center text-center transition-all rounded-xl cursor-pointer ${
                size === 'sm' ? 'py-1.5 px-1 sm:px-2' : 'py-2 px-1 sm:px-2.5'
              } ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md ring-1 ring-slate-900/5 dark:ring-white/10 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              } ${isRewriting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {/* Level indicator dot / number */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cfg.badge}
                </span>
                <span
                  className={`font-semibold tracking-tight text-[11px] sm:text-xs md:text-sm ${
                    isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  <span className="hidden sm:inline">{level}</span>
                  <span className="sm:hidden">{level === 'Very Simple' ? 'V.Simple' : level}</span>
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                {cfg.shortDesc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
