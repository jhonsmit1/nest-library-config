import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AppConfigService } from "../../app/app-config.service";
import { DrizzleDb } from "./postgres.types";
import { DatabaseClient } from "../database.client";
import { DatabaseMetrics } from "../database.metrics";
export declare class PostgresService implements DatabaseClient, OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly metrics;
    private readonly schema?;
    private readonly logger;
    private pool;
    private db;
    constructor(config: AppConfigService, metrics: DatabaseMetrics, schema?: Record<string, unknown> | undefined);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    getDb<TSchema extends Record<string, unknown> = Record<string, unknown>>(): DrizzleDb<TSchema>;
    isConnected(): boolean;
    withTransaction<T, TSchema extends Record<string, unknown> = Record<string, unknown>>(fn: (tx: DrizzleDb<TSchema>) => Promise<T>): Promise<T>;
    testConnection(): Promise<{
        success: boolean;
        duration?: number;
        error?: string;
    }>;
}
