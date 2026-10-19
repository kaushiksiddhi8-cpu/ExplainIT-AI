import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { POPULAR_QUESTIONS } from '../utils/explainEngine';

interface PopularTopicsProps {
  onSelectTopic: (topic: string) => void;
}

export const PopularTopics: React.FC<PopularTopicsProps> = ({ onSelectTopic }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
        <Flame className="w-3.5 h-3.5 text-amber-500" />
        <span>Popular Topics</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {POPULAR_QUESTIONS.map((topic, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectTopic(topic)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all shadow-2xs"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};
