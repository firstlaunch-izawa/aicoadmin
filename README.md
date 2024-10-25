# Aico Admin Dashboard

## インストール手順（Windows）

1. Node.jsのインストール
   - [Node.js公式サイト](https://nodejs.org/)からLTSバージョンをダウンロード
   - インストーラーを実行（デフォルト設定でOK）

2. アプリケーションのセットアップ
   ```bash
   # 1. プロジェクトフォルダに移動
   cd AicoAdmin

   # 2. 依存パッケージのインストール
   npm install
   ```

3. アプリケーションの起動
   ```bash
   # 開発サーバーの起動
   npm run dev
   ```

4. 動作確認
   - ブラウザで http://localhost:3000/api/health にアクセス
   - `{"status":"healthy",...}` のようなレスポンスが表示されれば成功

## 動作要件
- Windows 10以降
- Node.js 18.x以降
- 最小4GB RAM
- ポート3000が利用可能であること