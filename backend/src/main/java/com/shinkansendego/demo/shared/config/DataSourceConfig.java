package com.shinkansendego.demo.shared.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${DB_ENDPOINT:localhost}")
    private String dbEndpoint;

    @Value("${DB_NAME:postgres}")
    private String dbName;

    @Value("${DB_SECRET_JSON:}")
    private String dbSecretJson;

    @PostConstruct
    public DataSource dataSource() throws Exception {
        System.out.println("dataSourceConfi開始");
        System.out.println(dbSecretJson);
        var hikari = new HikariDataSource();
        hikari.setJdbcUrl("jdbc:postgresql://" + dbEndpoint + ":5432/" + dbName);

        if (!dbSecretJson.isEmpty()) {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var secret = mapper.readTree(dbSecretJson);
            hikari.setUsername(secret.get("username").asText());
            hikari.setPassword(secret.get("password").asText());
        }
        System.out.println(hikari.getUsername());
        System.out.println(hikari.getPassword());
        return hikari;
    }
}