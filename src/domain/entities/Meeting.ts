import type { Meeting as MeetingType } from '@/shared/types';

/**
 * 会議エンティティ
 */
export class Meeting {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly startedAt: number,
    public readonly endedAt?: number
  ) {}

  static create(url: string): Meeting {
    const id = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return new Meeting(id, url, Date.now());
  }

  end(): Meeting {
    return new Meeting(this.id, this.url, this.startedAt, Date.now());
  }

  isActive(): boolean {
    return this.endedAt === undefined;
  }

  getDuration(): number {
    const endTime = this.endedAt || Date.now();
    return endTime - this.startedAt;
  }

  toObject(): MeetingType {
    return {
      id: this.id,
      url: this.url,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
    };
  }
}
