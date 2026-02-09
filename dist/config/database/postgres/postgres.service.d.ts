import { OnModuleDestroy } from "@nestjs/common";
import { AppConfigService } from "src/config/app/app-config.service";
import { DatabaseMetricsFacade } from "src/config/observability/database-metrics.facade";
import { DrizzleDb } from "./postgres.types";
export declare class PostgresService implements OnModuleDestroy {
    private readonly config;
    private readonly metrics?;
    private readonly logger;
    private pool;
    private db;
    constructor(config: AppConfigService, metrics?: DatabaseMetricsFacade | undefined);
    connect<TSchema extends Record<string, unknown>>(schema?: TSchema): Promise<void>;
    disconnect(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getDb<TSchema extends Record<string, unknown> = Record<string, unknown>>(): DrizzleDb<TSchema>;
    isConnected(): boolean;
    withTransaction<T, TSchema extends Record<string, unknown> = Record<string, unknown>>(fn: (tx: DrizzleDb<TSchema>) => Promise<T>): Promise<T>;
    testConnection(): Promise<{
        success: boolean;
        duration?: number;
        error?: string;
    }>;
}
