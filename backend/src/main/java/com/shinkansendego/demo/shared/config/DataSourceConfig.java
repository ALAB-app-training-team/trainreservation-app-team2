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