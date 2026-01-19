# Meet Transcript Bridge

Google Meet の音声をリアルタイムで文字起こし・要約・翻訳し、Slack に投稿する Chrome 拡張機能。

## 技術スタック

- **言語**: TypeScript
- **拡張形式**: Chrome Extension (Manifest V3)
- **ビルド**: Vite
- **設計**: クリーンアーキテクチャ / DDD
- **音声認識**: OpenAI Whisper API
- **要約/翻訳**: OpenAI GPT API
- **通知**: Slack Incoming Webhook

## アーキテクチャ

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Google Meet    │────▶│   Chrome     │────▶│  OpenAI     │
│  (Tab Audio)    │     │   Extension  │     │  Whisper    │
│                 │  10秒チャンク       │     │             │
└─────────────────┘     └──────────────┘     └─────────────┘
                                                    │
                              ┌─────────────────────┘
                              ▼
                        ┌───────────┐
                        │  Buffer   │ ◀── 未完成の文を保持
                        └───────────┘
                              │
                              ▼ (文章が完成したタイミング)
┌─────────────────┐     ┌──────────────┐
│     Slack       │◀────│   GPT        │
│    Webhook      │     │  翻訳/要約    │
└─────────────────┘     └──────────────┘
```

## 内部処理フロー

### 音声キャプチャとバッファリング

音声の取得は REST API（Whisper）を使用するため、一定間隔のチャンク単位で処理する:

1. **音声キャプチャ**: Google Meet タブから音声を一定間隔（例: 10秒）で取得
2. **Whisper 文字起こし**: 各チャンクを Whisper API に送信してテキスト化
3. **バッファリング**: チャンク境界で文章が途切れた場合、未完成の文をバッファに保持
4. **文章完成判定**: 次のチャンクと結合し、文章として成立したかを判定
5. **リアルタイム投稿**: 完成した文章は即座に GPT で翻訳・要約し、Slack に投稿

### なぜバッファリングが必要か

- 10秒チャンクの境界は会話のタイミングと一致しない
- 「今日の会議では...」の途中でチャンクが切れる可能性がある
- バッファに保持し、次のチャンクで文章が完成したら投稿することで自然な文章を維持

### 備考: WebSocket（Realtime API）について

OpenAI Realtime API を使えばストリーミング処理も可能だが、料金体系が異なる。
まずは REST API（Whisper）ベースのチャンク方式で実装する。

## ディレクトリ構成

クリーンアーキテクチャ / DDD を採用し、レイヤーごとに責務を分離:

```
src/
├── domain/                 # ドメイン層（ビジネスロジック、外部依存なし）
│   ├── entities/           # エンティティ（Transcript, Meeting など）
│   ├── repositories/       # リポジトリインターフェース（実装は infrastructure）
│   └── services/           # ドメインサービス（文章完成判定など）
│
├── application/            # アプリケーション層（ユースケース）
│   └── usecases/           # TranscribeAudio, PostToSlack など
│
├── infrastructure/         # インフラ層（外部サービス・技術詳細）
│   ├── openai/             # Whisper / GPT クライアント
│   ├── slack/              # Webhook クライアント
│   ├── audio/              # 音声キャプチャ処理
│   └── storage/            # chrome.storage ラッパー
│
├── presentation/           # プレゼンテーション層（UI・Chrome 拡張エントリーポイント）
│   ├── background/         # Service Worker
│   ├── content/            # Content Script (Google Meet ページ用)
│   └── popup/              # 拡張機能ポップアップ UI
│
└── shared/                 # 共有ユーティリティ
    └── types/              # TypeScript 型定義
```

### レイヤー間の依存ルール

```
presentation → application → domain ← infrastructure
                    ↓
              infrastructure
```

- **domain**: 他のレイヤーに依存しない（純粋なビジネスロジック）
- **application**: domain を使用、infrastructure はインターフェース経由で注入
- **infrastructure**: domain のインターフェースを実装
- **presentation**: application のユースケースを呼び出す

## 開発コマンド

```bash
yarn install         # 依存関係インストール
yarn dev             # ビルド監視モード（popup/content scriptはHMR対応）
yarn build           # 本番ビルド
yarn test            # テスト実行
yarn lint            # ESLint 実行
yarn type-check      # TypeScript 型チェック
```

## API キーの管理

環境変数ではなく、**拡張機能の初回起動時にポップアップで入力**させる方式:

- `OPENAI_API_KEY`: OpenAI API キー
- `SLACK_WEBHOOK_URL`: Slack Incoming Webhook URL

入力された値は `chrome.storage.local` に保存し、以降は自動で読み込む。

## コーディング規約

- ESLint + Prettier を使用
- 関数・変数名は camelCase
- 型定義は明示的に記述
- コメントは日本語可

## なぜこのツールを作るのか

Google Meet の標準字幕機能は認識精度が低く、実用に耐えない。
OpenAI Whisper を使うことで、より高精度な文字起こしを実現する。

## 課題・調査事項

### 話者分離（Speaker Diarization）

**現状の課題:**
- `chrome.tabCapture` で取得できるのはタブ全体のミックス音声
- 単一の音声ストリームからは「誰が話しているか」の情報は取れない
- Whisper API 単体では話者分離をサポートしていない

**検討中の選択肢:**

| 方法 | メリット | デメリット |
|------|----------|------------|
| 話者分離なしで進める | シンプル、コスト低 | 誰の発言か分からない |
| AssemblyAI | 話者分離対応、高精度 | 追加コスト、別API |
| Deepgram | 話者分離対応、リアルタイム向き | 追加コスト、別API |
| Google Cloud Speech-to-Text | Speaker Diarization オプションあり | 追加コスト、設定複雑 |
| pyannote.audio + Whisper | オープンソース | サーバーサイド処理が必要 |

**調査が必要:**
- 各サービスの精度比較
- コスト試算（会議時間あたり）
- リアルタイム性の確保

### 音声チャンクの最適な長さ

- 短すぎる（5秒以下）: 文脈が少なく認識精度が落ちる可能性
- 長すぎる（30秒以上）: リアルタイム性が損なわれる、API タイムアウトリスク
- **要検証**: 10秒が最適か？

### 文章完成判定のロジック

- 句読点ベース？（「。」「？」「！」で区切る）
- 無音検出ベース？
- GPT に判定させる？（コスト増）
- **要検証**: 日本語と英語で異なるロジックが必要か

## 実装状況

### 完了した項目

#### Phase 1: 基本セットアップ
- [x] Chrome Extension の基本構成（Manifest V3）
  - manifest.json
  - popup.html（エントリーポイント）
- [x] Vite ビルド環境の構築
  - Chrome Extension 用のカスタムビルド設定
  - manifest.json と HTML の自動配置
- [x] TypeScript 設定
  - strict モード有効化
  - Vue ファイルの型定義サポート

#### Phase 1.5: モダンなフロントエンド環境
- [x] Vue 3 + Composition API の導入
- [x] Tailwind CSS の導入
- [x] Pinia による状態管理
  - `useAppStore`: アプリ設定管理用ストア
    - Chrome API 可用性チェック
    - 設定の読み込み・保存（OpenAI API キー、Slack Webhook URL）
- [x] VueUse の導入（便利な Vue hooks）
- [x] Vitest によるテスト環境
  - @testing-library/vue
  - happy-dom（高速な DOM シミュレーション）
  - Chrome API のモック
  - 20 個のテスト（すべて成功）

### 次のステップ

#### Phase 2: クリーンアーキテクチャのディレクトリ構造
- [ ] ディレクトリ構造の作成
  - `src/domain/entities/` - エンティティ（Transcript, Meeting など）
  - `src/domain/repositories/` - リポジトリインターフェース
  - `src/domain/services/` - ドメインサービス（文章完成判定など）
  - `src/application/usecases/` - ユースケース
  - `src/infrastructure/openai/` - Whisper / GPT クライアント
  - `src/infrastructure/slack/` - Webhook クライアント
  - `src/infrastructure/audio/` - 音声キャプチャ処理
  - `src/infrastructure/storage/` - chrome.storage ラッパー
  - `src/shared/types/` - 型定義
- [ ] 基本的な型定義の追加

#### Phase 3: 設定 UI
- [ ] ポップアップ UI の拡張（API キー入力フォーム）
- [ ] 設定保存・読み込み機能の実装

#### Phase 4: Content Script + Background
- [ ] Content Script の実装（Google Meet ページ検出）
- [ ] Background Service Worker の実装
- [ ] Content ↔ Background の通信実装

#### Phase 5: 音声キャプチャ
- [ ] `chrome.tabCapture` での音声キャプチャ実装
- [ ] 音声データのチャンク分割（10秒単位）

#### Phase 6: Whisper 連携
- [ ] Whisper API クライアント実装
- [ ] 音声 → テキスト変換の動作確認

#### Phase 7: バッファリング
- [ ] バッファリング・文章完成判定ロジック
- [ ] バッファ管理の実装

#### Phase 8: GPT + Slack
- [ ] GPT API クライアント（翻訳・要約）
- [ ] Slack Webhook 連携
- [ ] エンドツーエンドの動作確認

#### その他
- [ ] 話者分離の調査・実装（優先度: 中）
- [ ] エラーハンドリング・リトライ処理
- [ ] E2E テスト（Playwright）
