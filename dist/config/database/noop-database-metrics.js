"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopDatabaseMetrics = void 0;
class NoopDatabaseMetrics {
    recordPostgresQuery() { }
    recordAzureSqlQuery() { }
}
exports.NoopDatabaseMetrics = NoopDatabaseMetrics;
