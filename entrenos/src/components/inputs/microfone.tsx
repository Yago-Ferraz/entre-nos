import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechErrorEvent, SpeechResultsEvent, SpeechStartEvent } from '@react-native-voice/voice';

// Define o que o hook vai retornar
interface UseVoiceRecognitionState {
  isRecording: boolean;
  error: string | null;
  results: string[]; // Os resultados finais da transcrição
  partialResults: string[]; // Resultados parciais (enquanto fala)
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
}

/**
 * Hook customizado para gerenciar o reconhecimento de fala (Speech-to-Text)
 * usando @react-native-voice/voice.
 */
export const useVoiceRecognition = (): UseVoiceRecognitionState => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);

  // --- Funções de Callback (são chamadas pela biblioteca) ---

  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log('onSpeechStart:', e);
    setIsRecording(true);
    setError(null);
    setResults([]);
    setPartialResults([]);
  };

  const onSpeechEnd = () => {
    console.log('onSpeechEnd');
    setIsRecording(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError:', e);
    setError(e.error?.message || 'Erro desconhecido');
    setIsRecording(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults:', e);
    if (e.value) {
      setResults(e.value);
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults:', e);
    if (e.value) {
      setPartialResults(e.value);
    }
  };

  // --- Efeito para registrar e limpar os listeners ---

  useEffect(() => {
    // Registra os listeners
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults; // Para feedback ao vivo

    // Limpa os listeners quando o componente que usa o hook for desmontado
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []); // Array vazio, executa apenas uma vez

  // --- Funções expostas para o componente ---

  const startRecording = useCallback(async () => {
    setError(null);
    setResults([]);
    setPartialResults([]);
    setIsRecording(true);
    try {
      await Voice.start('pt-BR'); // Inicia em Português-BR
    } catch (e) {
      console.error('Erro ao iniciar gravação:', e);
      setError((e as Error).message);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Erro ao parar gravação:', e);
      setError((e as Error).message);
    }
  }, []);

  // Retorna o estado e as funções para o componente
  return {
    isRecording,
    error,
    results,
    partialResults,
    startRecording,
    stopRecording,
  };
};