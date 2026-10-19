import React from 'react';
import type { Category } from '../types/index';
import { CATEGORY_DATA } from '../utils/explainEngine';

interface CategoryCardsProps {
  onSelectCategoryPrompt: (prompt: string, category: Category) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategoryPrompt,
}) => {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click any question to instantly understand it at your preferred level
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORY_DATA.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-400 dark:hover:border-blue-500"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-2xl" role="img" aria-label={cat.name}>
                  {cat.emoji}
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            {/* Curated Questions */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Try asking:
              </span>
              {cat.sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectCategoryPrompt(q, cat.id)}
                  className="w-full text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-2 rounded-xl transition-all truncate block"
                  title={q}
                >
                  → {q}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
