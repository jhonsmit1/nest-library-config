import { DatabaseMetrics } from "./database.metrics";
export declare class NoopDatabaseMetrics implements DatabaseMetrics {
    recordPostgresQuery(): void;
    recordAzureSqlQuery(): void;
}
