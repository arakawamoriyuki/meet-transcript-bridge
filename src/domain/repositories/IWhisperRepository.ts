import type { AudioChunk, WhisperResponse } from '@/shared/types';

/**
 * Whisper API リポジトリのインターフェース
 * Infrastructure 層で実装
 */
export interface IWhisperRepository {
  /**
   * 音声チャンクを文字起こし
   */
  transcribe(audioChunk: AudioChunk): Promise<WhisperResponse>;
}
