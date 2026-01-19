/**
 * Slack リポジトリのインターフェース
 * Infrastructure 層で実装
 */
export interface ISlackRepository {
  /**
   * Slack に文字起こし結果を投稿
   */
  postMessage(text: string): Promise<void>;

  /**
   * Slack Webhook URL が設定されているか確認
   */
  isConfigured(): boolean;
}
