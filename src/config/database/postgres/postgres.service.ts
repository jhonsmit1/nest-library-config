import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { AppConfigService } from "../../app/app-config.service";
import { DrizzleDb } from "./postgres.types";
import { DatabaseClient } from "../database.client";
import { DATABASE_METRICS } from "../database.metrics.token";
import { DatabaseMetrics } from "../database.metrics";

@Injectable()
export class PostgresService implements DatabaseClient, OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PostgresService.name);

    private pool: Pool | null = null;
    private db: DrizzleDb<Record<string, unknown>> | null = null;

    constructor(
        private readonly config: AppConfigService,
        @Inject(DATABASE_METRICS)
        private readonly metrics: DatabaseMetrics,
        /**
         * El schema es CONFIGURACION del modulo,
         * no algo que se pase dinamicamente en runtime
         */
        private readonly schema?: Record<string, unknown>
    ) { }

    /* -------------------------------------------------------------------------- */
    /*                               Lifecycle                                    */
    /* -------------------------------------------------------------------------- */

    async onModuleInit(): Promise<void> {
        await this.connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.disconnect();
    }

    /* -------------------------------------------------------------------------- */
    /*                               Connection                                   */
    /* -------------------------------------------------------------------------- */

    private async connect(): Promise<void> {
        if (this.db) {
            this.logger.warn("Postgres already connected. Skipping connect().");
            return;
        }

        const isTest = this.config.env === "test";

        try {
            this.pool = new Pool({
                user: isTest ? this.config.testDbUser : this.config.dbUser,
                host: isTest ? this.config.testDbHost : this.config.dbHost,
                database: isTest ? this.config.testDbName : this.config.dbName,
                password: isTest
                    ? this.config.testDbPassword
                    : this.config.dbPassword,
                port: Number(isTest ? this.config.testDbPort : this.config.dbPort),
                ssl:
                    this.config.useSSL === "true"
                        ? { rejectUnauthorized: false }
                        : undefined,
                max: this.config.dbMaxConnections,
            });

            this.pool.on("connect", () => {
                this.logger.debug("Postgres pool: client connected");
            });

            this.pool.on("error", (error) => {
                this.logger.error("Postgres pool error", error);
            });

            this.db = drizzle(this.pool, {
                schema: this.schema,
            });

            /**
             * Migrations: solo si explícitamente se permite
             * y nunca en producción
             */
            if (this.config.runMigrations && this.config.env !== "production") {
                await migrate(this.db, { migrationsFolder: "drizzle" });
                this.logger.log("Postgres migrations executed");
            }

            this.logger.log("PostgreSQL connected successfully");
        } catch (error) {
            this.logger.error("Failed to connect to PostgreSQL", error);
            this.pool = null;
            this.db = null;
            throw error; // fail fast
        }
    }

    private async disconnect(): Promise<void> {
        if (!this.pool) return;

        try {
            await this.pool.end();
            this.logger.log("PostgreSQL disconnected");
        } catch (error) {
            this.logger.error("Error disconnecting PostgreSQL", error);
        } finally {
            this.pool = null;
            this.db = null;
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               Public API                                   */
    /* -------------------------------------------------------------------------- */

    getDb<TSchema extends Record<string, unknown> = Record<string, unknown>>(): DrizzleDb<TSchema> {
        if (!this.db) {
            throw new Error("Postgres not connected");
        }
        return this.db as DrizzleDb<TSchema>;
    }

    isConnected(): boolean {
        return !!this.db && !!this.pool;
    }

    /* -------------------------------------------------------------------------- */
    /*                               Transactions                                 */
    /* -------------------------------------------------------------------------- */

    async withTransaction<
        T,
        TSchema extends Record<string, unknown> = Record<string, unknown>
    >(fn: (tx: DrizzleDb<TSchema>) => Promise<T>): Promise<T> {
        const db = this.getDb<TSchema>();
        const start = Date.now();

        try {
            const result = await db.transaction(fn);

            this.metrics.recordPostgresQuery(
                "transaction",
                (Date.now() - start) / 1000,
                this.config.dbName
            );

            return result;
        } catch (error) {
            this.logger.error("Postgres transaction failed", error);
            throw error;
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               Health check                                 */
    /* -------------------------------------------------------------------------- */

    async testConnection(): Promise<{
        success: boolean;
        duration?: number;
        error?: string;
    }> {
        if (!this.isConnected()) {
            return { success: false, error: "Postgres not connected" };
        }

        const start = Date.now();

        try {
            await this.getDb().execute(
                sql`SELECT current_database(), now();`
            );

            const duration = Date.now() - start;

            this.metrics.recordPostgresQuery(
                "healthcheck",
                duration / 1000,
                this.config.dbName
            );

            return { success: true, duration };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
