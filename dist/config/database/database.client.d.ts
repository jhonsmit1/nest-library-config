import { DrizzleDb } from "./postgres/postgres.types";
export interface DatabaseClient {
    getDb<TSchema extends Record<string, unknown>>(): DrizzleDb<TSchema>;
    withTransaction<T>(fn: (tx: DrizzleDb<any>) => Promise<T>): Promise<T>;
}
