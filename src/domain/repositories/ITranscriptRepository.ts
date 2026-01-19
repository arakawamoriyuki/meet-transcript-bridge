import type { Transcript } from '@/domain/entities/Transcript';

/**
 * 文字起こしリポジトリのインターフェース
 * Infrastructure 層で実装
 */
export interface ITranscriptRepository {
  /**
   * 文字起こし結果を保存
   */
  save(transcript: Transcript): Promise<void>;

  /**
   * 指定した会議の文字起こし一覧を取得
   */
  findByMeetingId(meetingId: string): Promise<Transcript[]>;

  /**
   * すべての文字起こしを削除
   */
  clear(): Promise<void>;
}
