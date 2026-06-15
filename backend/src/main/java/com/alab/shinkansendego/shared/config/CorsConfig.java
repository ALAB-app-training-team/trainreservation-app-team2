package com.alab.shinkansendego.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS設定を適用するリソース
        registry.addMapping("/**")
                // アクセスを許可するオリジン
                .allowedOrigins("http://localhost:5173", "https://d220o4bv1ls3lr.cloudfront.net/")
                // アクセスを許可するHTTPメソッド
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                // アクセスを許可するHTTPヘッダ
                .allowedHeaders("*")
                // Javascriptからの参照を許可するヘッダ
                .exposedHeaders("Authorization")
                // クッキーなどの認証情報の送信を許可するか
                .allowCredentials(true)
                // プリフライトリクエストの結果を保持する時間
                .maxAge(3600);
    }
}
