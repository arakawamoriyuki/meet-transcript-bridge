import { describe, it, expect } from 'vitest';
import { TranscriptCompletionService } from './TranscriptCompletionService';

describe('TranscriptCompletionService', () => {
  describe('isComplete', () => {
    it('日本語の句読点で終わる文は完成している', () => {
      expect(TranscriptCompletionService.isComplete('こんにちは。')).toBe(true);
      expect(TranscriptCompletionService.isComplete('本当ですか？')).toBe(true);
      expect(TranscriptCompletionService.isComplete('すごい！')).toBe(true);
      expect(TranscriptCompletionService.isComplete('そうですね…')).toBe(true);
    });

    it('英語の句読点で終わる文は完成している', () => {
      expect(TranscriptCompletionService.isComplete('Hello world.')).toBe(true);
      expect(TranscriptCompletionService.isComplete('Are you sure?')).toBe(true);
      expect(TranscriptCompletionService.isComplete('Amazing!')).toBe(true);
    });

    it('句読点で終わらない文は未完成', () => {
      expect(TranscriptCompletionService.isComplete('こんにちは')).toBe(false);
      expect(TranscriptCompletionService.isComplete('今日の会議では')).toBe(false);
      expect(TranscriptCompletionService.isComplete('Hello world')).toBe(false);
    });

    it('空文字列は未完成', () => {
      expect(TranscriptCompletionService.isComplete('')).toBe(false);
      expect(TranscriptCompletionService.isComplete('   ')).toBe(false);
    });

    it('前後の空白を無視して判定', () => {
      expect(TranscriptCompletionService.isComplete('  こんにちは。  ')).toBe(true);
      expect(TranscriptCompletionService.isComplete('  こんにちは  ')).toBe(false);
    });
  });

  describe('splitIntoSentences', () => {
    it('日本語の文章を分割できる', () => {
      const text = 'こんにちは。今日はいい天気ですね。';
      const sentences = TranscriptCompletionService.splitIntoSentences(text);

      expect(sentences).toEqual(['こんにちは。', '今日はいい天気ですね。']);
    });

    it('英語の文章を分割できる', () => {
      const text = 'Hello world. How are you?';
      const sentences = TranscriptCompletionService.splitIntoSentences(text);

      expect(sentences).toEqual(['Hello world.', 'How are you?']);
    });

    it('未完成の文も配列に含まれる', () => {
      const text = 'こんにちは。今日は';
      const sentences = TranscriptCompletionService.splitIntoSentences(text);

      expect(sentences).toEqual(['こんにちは。', '今日は']);
    });

    it('複数の句読点に対応', () => {
      const text = 'こんにちは！元気ですか？そうですね…';
      const sentences = TranscriptCompletionService.splitIntoSentences(text);

      expect(sentences).toEqual(['こんにちは！', '元気ですか？', 'そうですね…']);
    });
  });

  describe('mergeTexts', () => {
    it('日本語テキストはスペースなしで結合', () => {
      const result = TranscriptCompletionService.mergeTexts('今日の', '会議では');
      expect(result).toBe('今日の会議では');
    });

    it('英語テキストはスペースありで結合', () => {
      const result = TranscriptCompletionService.mergeTexts('Hello', 'world');
      expect(result).toBe('Hello world');
    });

    it('日本語と英語の混在はスペースなしで結合', () => {
      const result = TranscriptCompletionService.mergeTexts('今日は', 'Hello');
      expect(result).toBe('今日はHello');
    });

    it('バッファが空の場合は新しいテキストをそのまま返す', () => {
      const result = TranscriptCompletionService.mergeTexts('', 'こんにちは');
      expect(result).toBe('こんにちは');
    });

    it('英語で終わり日本語で始まる場合はスペースなし', () => {
      const result = TranscriptCompletionService.mergeTexts('Hello', 'こんにちは');
      expect(result).toBe('Helloこんにちは');
    });
  });
});
