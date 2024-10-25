# Windows インストール手順

## 前提条件

- Windows 10以降
- Node.js 18.x以降がインストールされていること
- 最小4GB RAM
- ポート3000と4000が利用可能であること

## インストール手順

1. **Node.jsのインストール**
   ```
   https://nodejs.org/ から LTS バージョンをダウンロードしてインストール
   ```

2. **プロジェクトのセットアップ**
   ```bat
   # 1. プロジェクトフォルダに移動
   cd aico-admin

   # 2. 依存パッケージのインストール
   npm install
   ```

3. **環境設定**
   ```bat
   # 1. 環境設定ファイルのコピー
   copy .env.example .env

   # 2. .env.local ファイルの作成
   echo NEXT_PUBLIC_API_URL=http://localhost:3000/api > .env.local
   ```

4. **データベースの初期化**
   ```bat
   # データベースのマイグレーションとシードデータの投入
   npm run setup
   ```

5. **Windows Defender の除外設定**
   ```bat
   # PowerShellを管理者として実行し、以下のスクリプトを実行
   .\defender-setup.ps1
   ```

6. **ファイアウォールの設定**
   ```bat
   # コマンドプロンプトを管理者として実行し、以下のスクリプトを実行
   .\firewall-setup.bat
   ```

## アプリケーションの起動

### 開発モード
```bat
npm run dev
```
- フロントエンド: http://localhost:4000
- バックエンドAPI: http://localhost:3000

### 本番モード
```bat
# 1. アプリケーションのビルド
npm run build

# 2. Windows サービスとしてインストール
.\install-service.bat

# 3. サービスの開始
net start AicoAdmin
```

## フォルダ構造

```
aico-admin/
├── data/           # SQLiteデータベースファイル
├── logs/           # ログファイル
├── uploads/        # アップロードされたメディアファイル
├── src/            # ソースコード
├── server/         # サーバーサイドコード
└── scripts/        # 各種スクリプト
```

## トラブルシューティング

1. **ポートが使用中の場合**
   ```bat
   # 使用中のポートを確認
   netstat -ano | findstr :3000
   netstat -ano | findstr :4000

   # プロセスの終了（PIDは上記コマンドで確認したものを使用）
   taskkill /PID <PID> /F
   ```

2. **データベースエラーの場合**
   ```bat
   # データベースの再初期化
   del /F /Q data\aico.db
   npm run setup
   ```

3. **Windows Defenderの警告が出る場合**
   ```bat
   # defender-setup.ps1 を再実行
   powershell -ExecutionPolicy Bypass -File defender-setup.ps1
   ```

## バックアップ

1. **定期バックアップの設定**
   ```bat
   # タスクスケジューラに登録
   schtasks /create /tn "AicoAdminBackup" /tr "backup.bat" /sc daily /st 03:00
   ```

2. **手動バックアップの実行**
   ```bat
   .\backup.bat
   ```

## セキュリティ設定

1. **Windows Defender の除外設定の確認**
   ```powershell
   Get-MpPreference | Select-Object -Property ExclusionPath
   ```

2. **ファイアウォール設定の確認**
   ```bat
   netsh advfirewall firewall show rule name="Aico Admin (HTTP)"
   ```

## アンインストール

1. **サービスの停止と削除**
   ```bat
   net stop AicoAdmin
   sc delete AicoAdmin
   ```

2. **ファイアウォールルールの削除**
   ```bat
   netsh advfirewall firewall delete rule name="Aico Admin (HTTP)"
   ```

3. **アプリケーションの削除**
   ```bat
   # フォルダごと削除
   rd /s /q aico-admin
   ```