# Backend（Spring Boot）

## 目的

- このディレクトリ配下に Spring Boot アプリを作成します
- GitHub Actions で Docker イメージをビルドして ECR に push し、App Runner に反映します

## 前提（infra）

- `app-infra` 側で `${APP_NAME}-ecr`（ECRリポジトリ）がデプロイ済みであること
- `${APP_NAME}-be`（App Runner）は初回は後から作ってもOKですが、最終的には必要です

> 初回は「stub を ECR に push → infra で BE 作成（CREATE_BE_SERVICE=true）」が一番詰まりにくいです。

## 初期作成の方針

- `backend/Dockerfile.gradle` は `backend/` 直下に Gradle プロジェクトがある想定です
    - 例: `gradlew`, `gradle/`, `build.gradle` または `build.gradle.kts`, `settings.gradle*`, `src/`
- Spring Initializr で生成したプロジェクトを `backend/` 直下に配置してください（サブディレクトリに入れるとDockerfileのCOPYが合いません）

## ポート

- 8080 で待ち受ける前提です（Dockerfile/App Runnerともに 8080 を前提）

## Dockerfile について

- `Dockerfile.stub`:
    - 実習の最初に、BE未実装でもデプロイの流れだけ確認したいとき用
- `Dockerfile.gradle`:
    - Spring Boot の Gradle ビルド（`bootJar`）を実行して jar を起動します

## よくある注意

- `Dockerfile.gradle` は `./gradlew dependencies` をキャッシュ目的で先に叩くため、`gradlew` と `gradle/` が必要です
- テストをスキップしています（`-x test`）。実習でテストを回したい場合は Dockerfile を調整してください

## デプロイ（GitHub Actions）

- GitHub Actions の `Build & Push backend image, then deploy to App Runner` を手動実行します
- App Runner が存在する場合は `start-deployment` が実行されます。存在しない場合はスキップされます

---

## DB 接続方法（Spring Boot）

App Runner には以下の環境変数が自動設定されます:

| 環境変数             | 内容                     | 例                                                       |
|------------------|------------------------|---------------------------------------------------------|
| `DB_ENDPOINT`    | RDS のホスト名              | `my-app-postgres.xxxx.ap-northeast-1.rds.amazonaws.com` |
| `DB_NAME`        | データベース名                | `postgres`                                              |
| `DB_SECRET_JSON` | Secrets Manager の JSON | (下記参照)                                                  |

### `DB_SECRET_JSON` の構造

```json
{
  "username": "appuser",
  "password": "自動生成されたパスワード",
  "engine": "postgres",
  "host": "my-app-postgres.xxxx.ap-northeast-1.rds.amazonaws.com",
  "port": 5432,
  "dbname": "postgres",
  "dbInstanceIdentifier": "my-app-postgres"
}
```

### Spring Boot での設定例

`application.yml` (または `application.properties`) で環境変数を参照します:

```yaml
# src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://${DB_ENDPOINT}:5432/${DB_NAME}
    username: ${DB_USERNAME:appuser}
    password: ${DB_PASSWORD:}
```

ただし、`DB_SECRET_JSON` は JSON 文字列なので、アプリ起動時にパースが必要です。  
以下のいずれかの方法で対応してください:

#### 方法 A: 起動スクリプトでパースして環境変数に展開（推奨）

`Dockerfile.gradle` の ENTRYPOINT を以下のようにラップします:

```dockerfile
# Dockerfile.gradle の末尾を変更
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

```bash
#!/bin/sh
# entrypoint.sh
if [ -n "$DB_SECRET_JSON" ]; then
  export DB_USERNAME=$(echo "$DB_SECRET_JSON" | jq -r '.username')
  export DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r '.password')
fi
exec java -jar /app/app.jar "$@"
```

> `jq` を Dockerfile の base image に追加するか、`python3 -c "..."` で代用可能。

#### 方法 B: Spring Boot 内で JSON をパース

```java
// src/main/java/com/example/config/DataSourceConfig.java
@Configuration
public class DataSourceConfig {

    @Value("${DB_ENDPOINT:localhost}")
    private String dbEndpoint;

    @Value("${DB_NAME:postgres}")
    private String dbName;

    @Value("${DB_SECRET_JSON:}")
    private String dbSecretJson;

    @Bean
    public DataSource dataSource() throws Exception {
        var hikari = new HikariDataSource();
        hikari.setJdbcUrl("jdbc:postgresql://" + dbEndpoint + ":5432/" + dbName);

        if (!dbSecretJson.isEmpty()) {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var secret = mapper.readTree(dbSecretJson);
            hikari.setUsername(secret.get("username").asText());
            hikari.setPassword(secret.get("password").asText());
        }
        return hikari;
    }
}
```

### ローカル開発時

ローカルでは `application-local.yml` を作成し、直接指定します:

```yaml
# src/main/resources/application-local.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/postgres
    username: appuser
    password: localpassword
```

```bash
# ローカル実行
./gradlew bootRun --args='--spring.profiles.active=local'
```
