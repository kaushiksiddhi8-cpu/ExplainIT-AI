import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Cpu,
  Atom,
  Dna,
} from 'lucide-react';
import type { LearningPath, LearningConcept, UnderstandingLevel } from '../types/index';
import { calculatePathProgress, orderConceptsByComplexity } from '../utils/explainLogic';
import { createCustomLearningPath } from '../utils/explainEngine';

interface LearningPathViewProps {
  paths: LearningPath[];
  activePathId: string;
  onSelectPath: (pathId: string) => void;
  onUpdateConceptStatus: (
    pathId: string,
    conceptId: string,
    newStatus: 'not_started' | 'in_progress' | 'mastered' | 'revisit'
  ) => void;
  onExploreConcept: (concept: LearningConcept) => void;
  onAddCustomPath: (path: LearningPath) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  paths,
  activePathId,
  onSelectPath,
  onUpdateConceptStatus,
  onExploreConcept,
  onAddCustomPath,
}) => {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [customSubtopics, setCustomSubtopics] = useState('');

  const currentPath = paths.find((p) => p.id === activePathId) || paths[0];
  const progress = currentPath ? calculatePathProgress(currentPath.concepts) : null;
  const sortedConcepts = currentPath ? orderConceptsByComplexity(currentPath.concepts) : [];

  const handleCreatePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    const subtopicList = customSubtopics
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const defaultSubs = subtopicList.length > 0 
      ? subtopicList 
      : ['Foundational Concepts', 'Core Mechanisms', 'Real-world Applications', 'Common Pitfalls', 'Advanced Theory'];

    const newPath = createCustomLearningPath(customTopic.trim(), defaultSubs);
    onAddCustomPath(newPath);
    setIsCreatingCustom(false);
    setCustomTopic('');
    setCustomSubtopics('');
  };

  const getStatusBadge = (status: LearningConcept['status']) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered</span>
          </span>
        );
      case 'revisit':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Revisit Soon</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Up Next
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Personalized Learning Journey</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Master Any Subject Step-by-Step
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Choose a broad topic and learn ordered by complexity — from foundational analogies to advanced mastery. Track what you've conquered and flag topics to revisit.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Path Selector Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Learning Track
          </h2>
          <button
            type="button"
            onClick={() => setIsCreatingCustom(!isCreatingCustom)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreatingCustom ? 'Cancel Custom Path' : 'Create Custom Path'}</span>
          </button>
        </div>

        {/* Custom Path Builder Card */}
        {isCreatingCustom && (
          <form
            onSubmit={handleCreatePath}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500/50 dark:border-blue-500/40 shadow-lg space-y-4"
          >
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                Design Your Custom Learning Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type any subject you want to master. We'll automatically order the concepts from simple to advanced.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Broad Subject (e.g. "Quantum Computing", "Psychology", "Climate Change")
                </label>
                <input
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Subject name..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Sub-Topics (comma-separated, or leave blank to auto-generate)
                </label>
                <input
                  type="text"
                  value={customSubtopics}
                  onChange={(e) => setCustomSubtopics(e.target.value)}
                  placeholder="e.g. Superposition, Qubits, Quantum Gates, Shor's Algorithm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                Generate Path
              </button>
            </div>
          </form>
        )}

        {/* Existing Track Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {paths.map((p) => {
            const isSelected = p.id === activePathId;
            const pStats = calculatePathProgress(p.concepts);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPath(p.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {p.concepts.length} Concepts
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {pStats.percentMastered}% Done
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {p.broadTopic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                {/* Progress bar in button */}
                <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pStats.percentMastered}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Path Visual Dashboard */}
      {currentPath && progress && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Active Learning Track
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentPath.broadTopic}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {currentPath.description}
              </p>
            </div>

            {/* Visual Progress Ring / Stats */}
            <div className="flex items-center gap-6">
              {/* Circular percentage visual indicator */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-700"
                    strokeDasharray={`${progress.percentMastered}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {progress.percentMastered}%
                  </span>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Mastered</span>
                </div>
              </div>

              {/* Status Breakdown Chips */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {progress.mastered} Concepts Mastered
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {progress.revisit} Need to Revisit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {progress.inProgress + progress.notStarted} Remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sequenced Concepts Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Curriculum Sequence (Ordered by Complexity)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step through concepts systematically. Explain each at its target level and test your knowledge.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sortedConcepts.map((concept, index) => {
                const isMastered = concept.status === 'mastered';
                const isRevisit = concept.status === 'revisit';

                return (
                  <div
                    key={concept.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isMastered
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : isRevisit
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Step Number & Title */}
                      <div className="flex items-start gap-3.5">
                        <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${
                          isMastered
                            ? 'bg-emerald-500 text-white'
                            : isRevisit
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {concept.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                              {concept.complexity} Level
                            </span>
                            {getStatusBadge(concept.status)}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                            {concept.description}
                          </p>

                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">Suggested prompt:</span>
                            <span className="italic">"{concept.suggestedQuestion}"</span>
                          </div>
                        </div>
                      </div>

                      {/* Concept Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Explore / Ask AI */}
                        <button
                          type="button"
                          onClick={() => onExploreConcept(concept)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Explore Concept</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Mastered */}
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateConceptStatus(
                              currentPath.id,
                              concept.id,
                              isMastered ? 'in_progress' : 'mastered'
                            )
                          }
                          className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                            isMastered
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-emerald-600 hover:border-emerald-400'
                          }`}
                          title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Mark to Revisit */}
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateConceptStatus(
                              currentPath.id,
                              concept.id,
                              isRevisit ? 'in_progress' : 'revisit'
                            )
                          }
                          className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                            isRevisit
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600 hover:border-amber-400'
                          }`}
                          title={isRevisit ? 'Marked to Revisit' : 'Mark to Revisit'}
                        >
                          <BookmarkCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
