# アプリケーション用リポジトリ

- こちらは Github Actions でサービスをデプロイするためのプロジェクトです
  - 初期状態では自動デプロイ機能のみ設定しています
  - 以下の通り準備をすると、main ブランチが更新されるたびに最新のサービスがデプロイされます
- リポジトリを複製して、Github 上で変数を適宜設定することで同様の環境を構築可能です

> 補足: このリポジトリは「実習用テンプレ」です。初期状態では frontend / backend のプロジェクトは未作成のため、まずは各プロジェクトを作成してコミットする必要があります。

## 前提（先にinfraをデプロイ）

- 別リポジトリ（`app-infra`）で、少なくとも以下のスタックがデプロイ済みであること
    - `${APP_NAME}-fe`（S3/CloudFront）
    - `${APP_NAME}-ecr`（ECR）
    - `${APP_NAME}-be`（App Runner）※ 初回は後から作ってもOK

> このリポジトリの Actions は、CloudFormation の Outputs を参照してデプロイ先を特定します（`<APP_NAME>-fe`, `<APP_NAME>-be`）。

## AWS 上での設定

- `IAM` -> `ロール`を選択し、Github から AWS リソースに接続するための IAM ロールを作成します
    - ロール名 : `Github-OIDC-<サービス名>`
    - 許可ポリシー : `SD-Github-Actions-OIDC`(作成済みです)
  - 信頼関係(信頼ポリシーと書かれていることもあります) : 以下をコピペして一部書き換えてください
    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "arn:aws:iam::<AWSアカウント名>:oidc-provider/token.actions.githubusercontent.com"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringEquals": {
                        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                    },
                    "StringLike": {
                        "token.actions.githubusercontent.com:sub": "repo:<GitHubオーナー>/<GitHubリポジトリ名>:ref:refs/heads/main"
                    }
                }
            }
        ]
    }
    ```

### OIDC ロール名について（重要）

- このREADMEでは `Github-OIDC-<サービス名>` を推奨名として記載します。
- ワークフローは `role-to-assume` を直接書き換えるのではなく、GitHub Variables の `AWS_OIDC_ROLE_ARN` を参照します。
- そのため、実習メンバーは「Variables を設定する」だけで動かせます。

## Github リポジトリ上での設定

- `Settings` -> `Secrets and Variables`を選択し、`Actions`用の`Variables(変数)`を設定します
  - ※Github のサービスアップデートによって表記、アクセス順が変わることがあります。探してみてください
    - `AWS_ACCOUNT_ID` : AWS のアカウント ID
    - `AWS_REGION` : ECR・S3 などが構築されているリージョン(インフラ構築で変にいじらなければ基本`ap-northeast-1`になるはず)
    - `AWS_OIDC_ROLE_ARN` : OIDC ロールの ARN（例: `arn:aws:iam::<AWS_ACCOUNT_ID>:role/Github-OIDC-<サービス名>`）

### 推奨: APP_NAME を Variables に追加

- ワークフローは `workflow_dispatch` の inputs で `app_name` を受け取れますが、毎回入力すると間違えやすいです。
- `APP_NAME` を Variables に追加しておき、ワークフローのデフォルト値や入力に迷ったときの参照にしてください。

> NOTE: ECR リポジトリは infra 側（ECRスタック）で作成される前提です。存在しない場合、backend のワークフローは分かりやすいエラーで停止します。

## プロジェクト作成（実習スタート時）

### Frontend（React）

- `frontend` ディレクトリは初期状態では空です。Vite(React) などで作成し、`package-lock.json` までコミットしてください。
- 例（Vite + React + TypeScript）

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run build
```

詳細は [frontend/readme.md](frontend/readme.md) を参照してください。

### Backend（Spring Boot）

- `backend/Dockerfile.gradle` は `backend/` 直下に Gradle プロジェクト（`gradlew`, `build.gradle*`, `settings.gradle*`, `src/`）がある想定です。
- Spring Initializr で作ったプロジェクトを `backend/` 直下に配置してください。
- アプリは 8080 で待ち受ける前提です（App Runner の設定も 8080）。

詳細は [backend/readme.md](backend/readme.md) を参照してください。

## デプロイの流れ（全体像）

1. infra（別リポジトリ / app-infra）で VPC/DB/FE/ECR を構築
2. このリポジトリで frontend / backend を作成してコミット
3. GitHub Actions を手動実行（workflow_dispatch）して FE をS3に、BEをECR→App Runnerへ反映
4. 安定したら push トリガを有効化

## デプロイ手順（初回）

### 1) GitHub Variables を設定

- `AWS_ACCOUNT_ID`
- `AWS_REGION`
- `AWS_OIDC_ROLE_ARN`
- （推奨）`APP_NAME`

### 2) Backend イメージを ECR に push

- GitHub の Actions から `Build & Push backend image, then deploy to App Runner` を実行します
    - Spring Boot 未作成の間は `dockerfile=stub` でOK
    - Spring Boot 作成後は `dockerfile=gradle`

> App Runner サービス（`${APP_NAME}-be`）がまだ作られていない場合でも、ECR への push は可能です。その場合 `start-deployment` はスキップされます。

### 3) infra 側で Backend（App Runner）を作成

- 初回は infra 側で `${APP_NAME}-be` を作成します（`CREATE_BE_SERVICE=true`）

> これを先にやると、ECRにイメージが無い状態で App Runner が起動して詰まりやすいので、実習では「先に ECR へ stub を push」がおすすめです。

### 4) App Runner に反映（必要なら）

- `${APP_NAME}-be` 作成後にもう一度 backend workflow を実行すると `start-deployment` で反映されます
- ただし、BE作成時点で ECR に `:latest` が存在していれば、自動でpullされるので再実行が不要なケースもあります

### 5) Frontend を S3/CloudFront へデプロイ

- GitHub の Actions から `Build & Deploy Frontend to S3/CloudFront` を実行します

## 自動デプロイ（pushトリガ）

- 手動実行で安定してから、各ワークフローの `push:` コメントアウトを外してください
- `paths` はファイル名と一致している必要があります（例: backendは `backend-build-deploy.yml`）

## 参考（任意）

- CI（lint/test）を追加したい場合は `.github/workflows/ci.yml` を追加してください。

### CI 設計のヒント

- トリガ
  - `pull_request`（レビュー時に必ず回す）
  - `push`（`main` のみ）
- 権限
  - CI はAWSアクセス不要のことが多いので `permissions: { contents: read }` でOK
- 実習向けの工夫
  - `frontend/` や `backend/` が未作成の期間はCIを通したいので、`hashFiles()` で「ある時だけ」実行する
  - Node/Java/Gradle のキャッシュを入れて待ち時間を短縮する

### 例: `.github/workflows/ci.yml`

```yaml
name: CI

on:
    pull_request:
    push:
        branches: [main]

permissions:
    contents: read

concurrency:
    group: ci-${{ github.ref }}
    cancel-in-progress: true

jobs:
    frontend:
        name: Frontend (lint/test/build)
        runs-on: ubuntu-latest
        if: ${{ hashFiles('frontend/package-lock.json') != '' }}
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
                with:
                    node-version: '20'
                    cache: npm
                    cache-dependency-path: frontend/package-lock.json
            - name: Install
                working-directory: frontend
                run: npm ci
            - name: Lint (optional)
                working-directory: frontend
                run: npm run lint --if-present
            - name: Test (optional)
                working-directory: frontend
                run: npm test --if-present
            - name: Build
                working-directory: frontend
                run: npm run build

    backend:
        name: Backend (test/build)
        runs-on: ubuntu-latest
        if: ${{ hashFiles('backend/gradlew') != '' }}
        steps:
            - uses: actions/checkout@v4
            - name: Set up Java
                uses: actions/setup-java@v4
                with:
                    distribution: temurin
                    java-version: '21'
            - name: Setup Gradle
                uses: gradle/gradle-build-action@v3
            - name: Test
                working-directory: backend
                run: ./gradlew --no-daemon test
            - name: Build
                working-directory: backend
                run: ./gradlew --no-daemon build
```

> NOTE: Spring Initializr直後は `test` が落ちることもあるので、最初は `./gradlew build -x test` から始めて、後でテストを有効化してもOKです。
