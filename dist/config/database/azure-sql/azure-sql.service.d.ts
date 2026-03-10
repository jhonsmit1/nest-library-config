import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Knex } from "knex";
import { AppConfigService } from "../../app/app-config.service";
import { DatabaseMetrics } from "../database.metrics";
import { DatabaseClient } from "../database.client";
export declare class AzureSqlService implements DatabaseClient, OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly metrics?;
    private readonly logger;
    private knexInstance;
    constructor(config: AppConfigService, metrics?: DatabaseMetrics | undefined);
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
    withTransaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T>;
    private isConfigured;
}
