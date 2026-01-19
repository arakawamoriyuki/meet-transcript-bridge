/**
 * 共通型定義
 */

// API 設定
export interface ApiConfig {
  openaiApiKey: string;
  slackWebhookUrl: string;
}

// 文字起こしの状態
export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'error';

// 文字起こし結果
export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  isComplete: boolean; // 文章として完成しているか
}

// バッファ内の未完成文字起こし
export interface TranscriptBuffer {
  text: string;
  timestamp: number;
}

// 会議情報
export interface Meeting {
  id: string;
  url: string;
  startedAt: number;
  endedAt?: number;
}

// 音声チャンク
export interface AudioChunk {
  id: string;
  data: Blob;
  timestamp: number;
  duration: number; // 秒
}

// Whisper API のレスポンス
export interface WhisperResponse {
  text: string;
}

// GPT API のレスポンス
export interface GptResponse {
  translatedText?: string;
  summary?: string;
}

// エラー情報
export interface AppError {
  code: string;
  message: string;
  timestamp: number;
  details?: unknown;
}
