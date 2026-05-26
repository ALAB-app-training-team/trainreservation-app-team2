# Frontend（React）

## 目的

- このディレクトリ配下に React アプリを作成します
- GitHub Actions で S3/CloudFront へデプロイされる前提です

## 前提（infra）

- `app-infra` 側で `${APP_NAME}-fe` スタックがデプロイ済みであること（S3バケット名/CloudFront URLをOutputsから参照します）

## 初期作成（例: Vite + React + TypeScript）

```bash
npm create vite@latest . -- --template react-ts
npm install
npm run dev
npm run build
```

## デプロイ要件（GitHub Actions から参照されるもの）

- `package-lock.json` が存在すること（Actions の npm キャッシュ用）
- `npm run build` の成果物が `dist/` に出力されること（Viteのデフォルト）

## よくある注意

- ルート直下ではなく、この `frontend/` 配下で完結させてください（Actions が `working-directory: frontend` を前提にしています）

## デプロイ（GitHub Actions）

- GitHub Actions の `Build & Deploy Frontend to S3/CloudFront` を手動実行します
- 反映先は `${APP_NAME}-fe` の CloudFormation Outputs から自動で解決されます
