import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Knex } from "knex";
import { AppConfigService } from "../../app/app-config.service";
import { DatabaseMetrics } from "../database.metrics";
export declare class AzureSqlService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly metrics;
    private readonly logger;
    private knexInstance;
    constructor(config: AppConfigService, metrics: DatabaseMetrics);
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
