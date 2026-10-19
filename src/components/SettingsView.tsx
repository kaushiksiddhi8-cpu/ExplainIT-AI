import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Sliders,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Info,
  Code,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { AppSettings, UnderstandingLevel, ExplanationMode } from '../types/index';
import { LEVELS, MODES } from '../utils/explainLogic';
import { createSpeechController } from '../utils/speech';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  hasApiKey: boolean;
  engineName: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  hasApiKey,
  engineName,
}) => {
  const [testingVoice, setTestingVoice] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleTestVoice = () => {
    setTestingVoice(true);
    const controller = createSpeechController(settings.voice.rate, settings.voice.pitch);
    controller.speak(
      'Hello! Welcome to ExplainIt AI. I can explain any topic at the exact understanding level you choose.',
      () => setTestingVoice(false),
      () => setTestingVoice(false)
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            App Settings & Preferences
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Personalize your default complexity, speech audio, and theme preferences.
        </p>
      </div>

      {/* Preferences Sections */}
      <div className="space-y-6">
        {/* 1. Appearance / Theme */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Visual Appearance
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onUpdateSettings({ theme: id as any })}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-2 transition-all ${
                  settings.theme === id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Default Understanding Level & Mode */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
            Default Explanation Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Default Understanding Level
              </label>
              <select
                value={settings.defaultLevel}
                onChange={(e) => onUpdateSettings({ defaultLevel: e.target.value as UnderstandingLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Default Explanation Mode
              </label>
              <select
                value={settings.defaultMode}
                onChange={(e) => onUpdateSettings({ defaultMode: e.target.value as ExplanationMode })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {m} Mode
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Text-to-Speech (Read Aloud) Audio Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Read Aloud (Voice Settings)
              </h2>
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              disabled={testingVoice}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{testingVoice ? 'Speaking Sample...' : 'Test Voice Audio'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Speech Speed (Rate)</span>
                <span className="text-blue-600 dark:text-blue-400">{settings.voice.rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.75"
                step="0.05"
                value={settings.voice.rate}
                onChange={(e) =>
                  onUpdateSettings({
                    voice: { ...settings.voice, rate: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.75x (Relaxed)</span>
                <span>1.0x (Normal)</span>
                <span>1.75x (Brisk)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Voice Pitch</span>
                <span className="text-blue-600 dark:text-blue-400">{settings.voice.pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={settings.voice.pitch}
                onChange={(e) =>
                  onUpdateSettings({
                    voice: { ...settings.voice, pitch: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Deep</span>
                <span>Default</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. AI Engine Diagnostics & Extensibility */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                AI Engine Architecture & Status
              </h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              hasApiKey
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{hasApiKey ? 'Live Gemini 3.8 Flash' : 'ExplainIt Resilient Engine'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ExplainIt AI is built on a resilient dual-layer architecture:
            it connects to Google Gemini 3.8 Flash server-side when an API key is available, and includes a full-featured, zero-cost internal knowledge reasoning engine so every query, complexity level, and quiz works smoothly even without any paid subscription or API key.
          </p>

          {/* Code guidance snippet */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2 text-slate-500 font-sans font-bold text-xs">
              <Code className="w-4 h-4 text-blue-500" />
              <span>Where to configure a free AI API in code:</span>
            </div>
            <pre className="overflow-x-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-700 dark:text-slate-300">
{`// server.ts -> Line 27
// 1. Configure GEMINI_API_KEY in .env or AI Studio Secrets panel.
// 2. Uses modern @google/genai SDK with model 'gemini-3.8-flash'.
// 3. For custom endpoints (e.g. Ollama, OpenRouter), modify /api/explain in server.ts.`}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero personal data tracking. No ads. No paid paywalls.</span>
          </div>
        </div>

        {/* 5. Data Reset */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Reset Application Cache & Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear saved questions, reset learning progress, and restore factory defaults.
            </p>
          </div>

          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setResetConfirm(false);
                }}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
