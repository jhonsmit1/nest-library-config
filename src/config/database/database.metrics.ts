export interface DatabaseMetrics {
    recordPostgresQuery(
        operation: string,
        durationSeconds: number,
        dbName?: string
    ): void;

    recordAzureSqlQuery(
        operation: string,
        durationSeconds: number,
        dbName?: string
    ): void;
}
