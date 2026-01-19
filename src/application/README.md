# Application Layer

アプリケーション層：ユースケースの実装。

## 責務

- ユースケース（アプリケーションロジック）の実装
- ドメイン層の呼び出し
- リポジトリ（インターフェース）の利用
- トランザクション管理

## ディレクトリ構成

```
application/
└── usecases/                    # ユースケース
    ├── TranscribeAudioUseCase.ts    # 音声文字起こし
    ├── PostToSlackUseCase.ts        # Slack 投稿
    └── ManageTranscriptUseCase.ts   # 文字起こし管理
```

## 依存ルール

- ✅ domain 層に依存
- ✅ リポジトリインターフェース経由で infrastructure 層を利用
- ❌ infrastructure 層の実装を直接参照しない
- ❌ presentation 層に依存しない
