import React from 'react';
import type { ExplanationMode } from '../types/index';
import { MODES, MODE_METADATA } from '../utils/explainLogic';

interface ModeSelectorProps {
  selectedMode: ExplanationMode;
  onSelectMode: (mode: ExplanationMode) => void;
  variant?: 'grid' | 'pills';
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  variant = 'grid',
  disabled = false,
}) => {
  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Select mode">
        {MODES.map((mode) => {
          const meta = MODE_METADATA[mode];
          const isSelected = selectedMode === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectMode(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Explanation Mode
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Tailors tone, examples & depth
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Select mode">
        {MODES.map((mode) => {
          const meta = MODE_METADATA[mode];
          const isSelected = selectedMode === mode;

          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectMode(mode)}
              className={`relative p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-indigo-950/40 border-blue-500 dark:border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl" role="img" aria-label={mode}>
                    {meta.emoji}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {meta.name}
                </h3>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mb-1">
                  {meta.tagline}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {meta.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block">
                  Best for: {meta.audience}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
