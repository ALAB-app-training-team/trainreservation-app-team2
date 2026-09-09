import type { Client as PgClient, QueryResultRow } from 'pg';
import { Client } from 'pg';

const CONNECTION = {
    host: process.env.TEST_DB_HOST ?? 'localhost',
    port: Number(process.env.TEST_DB_PORT ?? 5432),
    database: process.env.TEST_DB_NAME ?? 'postgres',
    user: process.env.TEST_DB_USER ?? 'appuser',
    password: process.env.TEST_DB_PASSWORD ?? 'localpassword',
};

/** 接続〜切断までを閉じ込めてSQLを実行する */
export async function withDb<T>(
    fn: (client: PgClient) => Promise<T>,
): Promise<T> {
    const client = new Client(CONNECTION);
    await client.connect();
    try {
        return await fn(client);
    } finally {
        await client.end();
    }
}

/** SELECT結果の行を取得する */
export async function selectRows<T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
): Promise<T[]> {
    return withDb(async (client) => {
        const result = await client.query<T>(sql, params);
        return result.rows;
    });
}

/** INSERT / UPDATE / DELETE を実行し、更新件数を返す */
export async function execute(
    sql: string,
    params: unknown[] = [],
): Promise<number> {
    return withDb(async (client) => {
        const result = await client.query(sql, params);
        return result.rowCount ?? 0;
    });
}
