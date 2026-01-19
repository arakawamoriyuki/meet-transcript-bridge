import type { AudioChunk } from '@/shared/types';

/**
 * 音声リポジトリのインターフェース
 * Infrastructure 層で実装
 */
export interface IAudioRepository {
  /**
   * Google Meet から音声をキャプチャ
   */
  captureAudio(tabId: number): Promise<MediaStream>;

  /**
   * 音声ストリームをチャンクに分割
   */
  splitIntoChunks(stream: MediaStream, chunkDuration: number): AsyncGenerator<AudioChunk>;

  /**
   * 音声キャプチャを停止
   */
  stopCapture(): void;
}
