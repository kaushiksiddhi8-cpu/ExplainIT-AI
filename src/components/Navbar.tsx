import React from 'react';
import { Sparkles, Compass, History, Settings, MessageSquare, Sun, Moon, HelpCircle } from 'lucide-react';
import type { ExplanationMode, UnderstandingLevel } from '../types/index';
import { MODE_METADATA } from '../utils/explainLogic';

interface NavbarProps {
  currentTab: 'home' | 'ask' | 'learn' | 'history' | 'settings';
  onSelectTab: (tab: 'home' | 'ask' | 'learn' | 'history' | 'settings') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentMode: ExplanationMode;
  currentLevel: UnderstandingLevel;
  onOpenModePicker?: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  currentMode,
  currentLevel,
  historyCount,
}) => {
  const modeMeta = MODE_METADATA[currentMode];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          aria-label="ExplainIt AI Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                ExplainIt<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                v2.0
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
              Ask Anything. Understand Everything.
            </p>
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectTab('ask')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'ask'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          <button
            onClick={() => onSelectTab('learn')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
              currentTab === 'learn'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Learning Path</span>
            <span className="sm:hidden">Path</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1" />
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
              currentTab === 'settings'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
            title="Settings & Diagnostics"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>

        {/* Right Actions: Mode Indicator & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Active Mode & Level Badge */}
          <div className="hidden md:flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <span>{modeMeta.emoji}</span>
              <span>{currentMode}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {currentLevel}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
