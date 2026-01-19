# Infrastructure Layer

インフラ層：外部サービスとの連携、技術的詳細の実装。

## 責務

- 外部 API との通信
- Chrome API の利用
- リポジトリインターフェースの実装
- データの永続化

## ディレクトリ構成

```
infrastructure/
├── openai/           # OpenAI API 連携
│   ├── WhisperClient.ts
│   └── GptClient.ts
│
├── slack/            # Slack Webhook 連携
│   └── SlackClient.ts
│
├── audio/            # 音声キャプチャ
│   └── AudioCaptureService.ts
│
└── storage/          # chrome.storage ラッパー
    └── ChromeStorageService.ts
```

## 依存ルール

- ✅ domain 層のインターフェースを実装
- ✅ 外部ライブラリを利用可能
- ❌ application 層に依存しない
- ❌ presentation 層に依存しない
