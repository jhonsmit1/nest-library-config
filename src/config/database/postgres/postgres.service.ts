import {
    Injectable,
    Logger,
    OnModuleDestroy,
    Optional
} from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { AppConfigService } from "../../app/app-config.service";
import { DatabaseMetricsFacade } from "../../observability/database-metrics.facade";
import { DrizzleDb } from "./postgres.types";

@Injectable()
export class PostgresService implements OnModuleDestroy {
    private readonly logger = new Logger(PostgresService.name);

    private pool: Pool | null = null;
    private db: DrizzleDb<Record<string, unknown>> | null = null;

    constructor(
        private readonly config: AppConfigService,
        @Optional()
        private readonly metrics?: DatabaseMetricsFacade
    ) { }

    /* -------------------------------------------------------------------------- */
    /*                               Connection                                   */
    /* -------------------------------------------------------------------------- */

    async connect<TSchema extends Record<string, unknown>>(
        schema?: TSchema
    ): Promise<void> {
        if (this.db) {
            this.logger.warn("Postgres already connected. connect() ignored.");
            return;
        }

        const isTest = this.config.env === "test";

        this.pool = new Pool({
            user: isTest ? this.config.testDbUser : this.config.dbUser,
            host: isTest ? this.config.testDbHost : this.config.dbHost,
            database: isTest ? this.config.testDbName : this.config.dbName,
            password: isTest ? this.config.testDbPassword : this.config.dbPassword,
            port: Number(isTest ? this.config.testDbPort : this.config.dbPort),
            ssl: this.config.useSSL === "true" ? { rejectUnauthorized: false } : undefined,
            max: this.config.dbMaxConnections,
        });

        this.pool.on("connect", () => {
            this.logger.debug("Postgres pool: client connected");
        });

        this.pool.on("error", (error) => {
            this.logger.error("Postgres pool error", error);
        });

        this.db = drizzle(this.pool, { schema });

        if (this.config.runMigrations && this.config.env !== "production") {
            await migrate(this.db, { migrationsFolder: "drizzle" });
            this.logger.log("Postgres migrations executed");
        }

        this.logger.log("PostgreSQL connected");
    }

    async disconnect(): Promise<void> {
        if (!this.pool) return;

        await this.pool.end();
        this.pool = null;
        this.db = null;

        this.logger.log("PostgreSQL disconnected");
    }

    async onModuleDestroy() {
        await this.disconnect();
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
    /*                               Transactions                                  */
    /* -------------------------------------------------------------------------- */

    async withTransaction<T, TSchema extends Record<string, unknown> = Record<string, unknown>>(fn: (tx: DrizzleDb<TSchema>) => Promise<T>): Promise<T> {
        const db = this.getDb<TSchema>();
        const start = Date.now();
        try {
            const result = await db.transaction(fn);

            this.metrics?.recordPostgresQuery(
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
    /*                               Health checks                                */
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

            this.metrics?.recordPostgresQuery(
                "healthcheck",
                (Date.now() - start) / 1000,
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
