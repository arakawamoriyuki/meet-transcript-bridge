import type { TranscriptSegment } from '@/shared/types';

/**
 * 文字起こしエンティティ
 */
export class Transcript {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly timestamp: number,
    public readonly isComplete: boolean = false
  ) {}

  static create(text: string, timestamp: number = Date.now()): Transcript {
    const id = `transcript-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    return new Transcript(id, text, timestamp, false);
  }

  markAsComplete(): Transcript {
    return new Transcript(this.id, this.text, this.timestamp, true);
  }

  append(additionalText: string): Transcript {
    return new Transcript(
      this.id,
      this.text + additionalText,
      this.timestamp,
      this.isComplete
    );
  }

  toSegment(): TranscriptSegment {
    return {
      id: this.id,
      text: this.text,
      timestamp: this.timestamp,
      isComplete: this.isComplete,
    };
  }
}
