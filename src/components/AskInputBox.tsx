import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, ArrowRight, Sparkles, X, Loader2 } from 'lucide-react';
import { startVoiceRecognition } from '../utils/speech';

interface AskInputBoxProps {
  question: string;
  onChangeQuestion: (q: string) => void;
  onSubmit: (q?: string) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AskInputBox: React.FC<AskInputBoxProps> = ({
  question,
  onChangeQuestion,
  onSubmit,
  isLoading,
  placeholder = 'What do you want to understand?',
  autoFocus = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [micStatusMsg, setMicStatusMsg] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleToggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setMicStatusMsg(null);
      return;
    }

    setMicStatusMsg('Listening... Speak your question clearly.');
    setIsListening(true);

    const rec = startVoiceRecognition(
      (transcript) => {
        onChangeQuestion(transcript);
      },
      () => {
        setIsListening(false);
        setMicStatusMsg(null);
      },
      (errorMsg) => {
        setIsListening(false);
        setMicStatusMsg(errorMsg);
        setTimeout(() => setMicStatusMsg(null), 4000);
      }
    );

    if (rec) {
      recognitionRef.current = rec;
    } else {
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full relative">
      <div className={`relative bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all shadow-lg ${
        isListening
          ? 'border-red-500/80 ring-4 ring-red-500/10'
          : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:border-blue-400'
      }`}>
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>

            <textarea
              ref={textareaRef}
              rows={2}
              value={question}
              onChange={(e) => onChangeQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={placeholder}
              aria-label="What do you want to understand?"
              className="w-full resize-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg font-medium focus:outline-none leading-relaxed"
            />

            {question && (
              <button
                type="button"
                onClick={() => onChangeQuestion('')}
                aria-label="Clear question text"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Voice Listening Wave Indicator */}
          {isListening && (
            <div className="mt-2 py-1 px-3 bg-red-50 dark:bg-red-950/40 rounded-xl flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-medium animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Listening to your voice... Speak now</span>
              </div>
              {/* Sound wave bars */}
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-0.5 bg-red-500 rounded-full animate-voice-1" />
                <span className="w-0.5 bg-red-500 rounded-full animate-voice-2" />
                <span className="w-0.5 bg-red-500 rounded-full animate-voice-3" />
                <span className="w-0.5 bg-red-500 rounded-full animate-voice-4" />
                <span className="w-0.5 bg-red-500 rounded-full animate-voice-5" />
              </div>
            </div>
          )}

          {micStatusMsg && !isListening && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
              {micStatusMsg}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 animate-bounce" />
                    <span>Stop Mic</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Voice Input</span>
                  </>
                )}
              </button>

              <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500">
                Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">Enter ↵</kbd> to ask
              </span>
            </div>

            {/* Ask AI Submit Button */}
            <button
              type="button"
              disabled={isLoading || !question.trim()}
              onClick={() => onSubmit()}
              aria-label="Ask AI"
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                question.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:opacity-95 hover:scale-[1.02] shadow-blue-500/25 active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
