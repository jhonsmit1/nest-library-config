import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Knex } from "knex";
import { AppConfigService } from "../../app/app-config.service";
import { DatabaseMetricsFacade } from "../../observability/database-metrics.facade";
export declare class AzureSqlService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly metrics;
    private readonly logger;
    private knexInstance;
    constructor(config: AppConfigService, metrics: DatabaseMetricsFacade);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getKnex(): Knex;
    raw<TResult = any>(query: string, bindings?: any): Promise<Knex.Raw<TResult>>;
    testConnection(): Promise<{
        success: boolean;
        error?: string;
        executionTime?: number;
    }>;
    private isConfigured;
}
