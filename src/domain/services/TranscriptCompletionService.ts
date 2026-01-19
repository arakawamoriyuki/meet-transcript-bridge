/**
 * 文章完成判定サービス
 *
 * 文字起こしされたテキストが文章として完成しているかを判定する
 */
export class TranscriptCompletionService {
  /**
   * 日本語の句読点
   */
  private static readonly JAPANESE_PUNCTUATION = ['。', '！', '？', '…'];

  /**
   * 英語の句読点
   */
  private static readonly ENGLISH_PUNCTUATION = ['.', '!', '?'];

  /**
   * テキストが完成した文章かどうかを判定
   *
   * @param text - 判定するテキスト
   * @returns 完成していれば true
   */
  static isComplete(text: string): boolean {
    if (!text || text.trim().length === 0) {
      return false;
    }

    const trimmedText = text.trim();
    const lastChar = trimmedText[trimmedText.length - 1];

    // 日本語または英語の句読点で終わっているか
    return (
      this.JAPANESE_PUNCTUATION.includes(lastChar) ||
      this.ENGLISH_PUNCTUATION.includes(lastChar)
    );
  }

  /**
   * テキストを文章単位で分割
   *
   * @param text - 分割するテキスト
   * @returns 文章の配列
   */
  static splitIntoSentences(text: string): string[] {
    // 日本語と英語の句読点で分割
    const allPunctuation = [
      ...this.JAPANESE_PUNCTUATION,
      ...this.ENGLISH_PUNCTUATION,
    ];

    const sentences: string[] = [];
    let currentSentence = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      currentSentence += char;

      if (allPunctuation.includes(char)) {
        sentences.push(currentSentence.trim());
        currentSentence = '';
      }
    }

    // 残りのテキストを追加（未完成の文）
    if (currentSentence.trim().length > 0) {
      sentences.push(currentSentence.trim());
    }

    return sentences;
  }

  /**
   * バッファに保存されたテキストと新しいテキストを結合
   *
   * @param bufferedText - バッファに保存されたテキスト
   * @param newText - 新しいテキスト
   * @returns 結合されたテキスト
   */
  static mergeTexts(bufferedText: string, newText: string): string {
    if (!bufferedText) {
      return newText;
    }

    // 日本語の場合はスペース不要、英語の場合はスペースを入れる
    const needsSpace = /[a-zA-Z]$/.test(bufferedText) && /^[a-zA-Z]/.test(newText);

    return needsSpace ? `${bufferedText} ${newText}` : `${bufferedText}${newText}`;
  }
}
