'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useVoiceInput — wraps the Web Speech API (SpeechRecognition).
 *
 * Works natively in Google Chrome and Microsoft Edge.
 * In Brave, Firefox, and Safari, it returns isSupported = false.
 */
export default function useVoiceInput({ onResult, language = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const intentionalStopRef = useRef(false);

  // Check support once (must be in browser context and have SpeechRecognition)
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const clearError = useCallback(() => setError(null), []);

  const stopListening = useCallback(() => {
    intentionalStopRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice input is only supported in Chrome or Edge browser. Please switch browsers to use this feature.');
      return;
    }

    setError(null);
    setInterimTranscript('');
    intentionalStopRef.current = false;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;       // keep listening until explicitly stopped
    recognition.interimResults = true;   // get live partial results
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (finalChunk && onResult) {
        onResult(finalChunk);
      }
    };

    recognition.onerror = (event) => {
      // no-speech occurs when the user pauses speaking; we just ignore it
      if (event.error === 'no-speech') {
        return;
      }

      // network error is handled
      if (event.error === 'network') {
        setError("Network error: Google's speech recognition servers are unreachable. Make sure you are using Chrome or Edge with an active internet connection.");
        setIsListening(false);
        return;
      }

      const messages = {
        'not-allowed': 'Microphone access denied. Please click the lock icon in your address bar and allow mic access.',
        'audio-capture': 'No microphone detected on your device.',
        'aborted': null
      };

      const msg = messages[event.error] || `Voice input error: ${event.error}`;
      if (msg) setError(msg);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, language, onResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intentionalStopRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
    clearError,
    error,
  };
}
