import { DatabaseMetrics } from "./database.metrics";

export class NoopDatabaseMetrics implements DatabaseMetrics {
  recordPostgresQuery(): void {}
  recordAzureSqlQuery(): void {}
}
