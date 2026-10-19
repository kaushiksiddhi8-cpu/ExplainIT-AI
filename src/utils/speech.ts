/**
 * Web Speech API wrapper for Text-To-Speech (TTS) and Speech-To-Text (STT)
 */

export interface SpeechController {
  speak: (text: string, onEnd?: () => void, onError?: (e: any) => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSpeaking: () => boolean;
  isPaused: () => boolean;
}

export function createSpeechController(
  rate: number = 1.0,
  pitch: number = 1.0,
  voiceURI?: string
): SpeechController {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  return {
    speak: (text: string, onEnd?: () => void, onError?: (e: any) => void) => {
      if (!synth) {
        console.warn('Speech synthesis not supported in this browser.');
        return;
      }

      synth.cancel(); // Stop any active speech

      // Clean markdown characters for clean speech
      const cleanText = text
        .replace(/[#*_`~[\]]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));

      if (voiceURI) {
        const voices = synth.getVoices();
        const matched = voices.find((v) => v.voiceURI === voiceURI);
        if (matched) utterance.voice = matched;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        if (onError) onError(e);
      };

      synth.speak(utterance);
    },

    pause: () => {
      if (synth && synth.speaking) synth.pause();
    },

    resume: () => {
      if (synth && synth.paused) synth.resume();
    },

    stop: () => {
      if (synth) synth.cancel();
    },

    isSpeaking: () => !!(synth && synth.speaking),
    isPaused: () => !!(synth && synth.paused),
  };
}

/**
 * Speech Recognition (Microphone) helper
 */
export function startVoiceRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void,
  onError: (errorMsg: string) => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Voice recognition is not supported in this browser. You can type your question directly.');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onError(event.error === 'not-allowed' ? 'Microphone access was denied. Please allow microphone permissions or type your question.' : `Microphone error: ${event.error}`);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (_) {}
      },
    };
  } catch (err: any) {
    onError(err?.message || 'Could not start microphone');
    return null;
  }
}
