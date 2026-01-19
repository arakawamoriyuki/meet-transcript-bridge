import type { GptResponse } from '@/shared/types';

/**
 * GPT API リポジトリのインターフェース
 * Infrastructure 層で実装
 */
export interface IGptRepository {
  /**
   * テキストを翻訳
   */
  translate(text: string, targetLanguage: string): Promise<string>;

  /**
   * テキストを要約
   */
  summarize(text: string): Promise<string>;

  /**
   * 翻訳と要約を同時に実行
   */
  translateAndSummarize(text: string, targetLanguage: string): Promise<GptResponse>;
}
