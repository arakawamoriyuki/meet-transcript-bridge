# Domain Layer

ドメイン層：ビジネスロジックの中核。外部依存なし。

## 責務

- ビジネスルールの実装
- エンティティの定義
- リポジトリインターフェースの定義（実装は infrastructure 層）
- ドメインサービスの実装

## ディレクトリ構成

```
domain/
├── entities/           # エンティティ
│   ├── Transcript.ts   # 文字起こしエンティティ
│   └── Meeting.ts      # 会議エンティティ
│
├── repositories/       # リポジトリインターフェース
│   ├── ITranscriptRepository.ts
│   ├── IAudioRepository.ts
│   ├── IWhisperRepository.ts
│   ├── IGptRepository.ts
│   └── ISlackRepository.ts
│
└── services/           # ドメインサービス
    └── TranscriptCompletionService.ts  # 文章完成判定
```

## 依存ルール

- ✅ 他のレイヤーに依存しない
- ✅ 外部ライブラリに依存しない（型定義のみ可）
- ❌ infrastructure 層の実装を直接参照しない
