import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
    Inject,
} from "@nestjs/common";
import knex, { Knex } from "knex";
import { AppConfigService } from "../../app/app-config.service";
import { DatabaseMetrics } from "../database.metrics";
import { DATABASE_METRICS } from "../database.metrics.token";

@Injectable()
export class AzureSqlService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AzureSqlService.name);
    private knexInstance: Knex | null = null;

    constructor(
        private readonly config: AppConfigService,
        @Inject(DATABASE_METRICS)
        private readonly metrics: DatabaseMetrics
    ) { }

    /* -------------------------------------------------------------------------- */
    /*                               Lifecycle                                    */
    /* -------------------------------------------------------------------------- */

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }

    /* -------------------------------------------------------------------------- */
    /*                               Connection                                   */
    /* -------------------------------------------------------------------------- */

    async connect(): Promise<void> {
        if (this.knexInstance) return;

        if (!this.isConfigured()) {
            this.logger.warn(
                "Azure SQL not configured. Skipping Azure SQL connection."
            );
            return;
        }

        try {
            this.knexInstance = knex({
                client: "mssql",
                connection: {
                    server: this.config.azureSqlServer,
                    database: this.config.azureSqlDatabase,
                    user: this.config.azureSqlUser,
                    password: this.config.azureSqlPassword,
                    port: this.config.azureSqlPort,
                    options: {
                        encrypt: this.config.azureSqlEncrypt,
                        trustServerCertificate:
                            this.config.azureSqlTrustServerCertificate,
                        enableArithAbort: true,
                    },
                },
                pool: {
                    min: 2,
                    max: 10,
                    idleTimeoutMillis: 30000,
                },
            });

            await this.knexInstance.raw("SELECT 1");

            this.logger.log("Azure SQL connected successfully");
        } catch (error) {
            this.logger.error("Failed to connect to Azure SQL", error);
            this.knexInstance = null;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.knexInstance) return;

        try {
            await this.knexInstance.destroy();
            this.logger.log("Azure SQL connection closed");
        } catch (error) {
            this.logger.error("Error closing Azure SQL connection", error);
        } finally {
            this.knexInstance = null;
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               Public API                                   */
    /* -------------------------------------------------------------------------- */

    isConnected(): boolean {
        return this.knexInstance !== null;
    }

    getKnex(): Knex {
        if (!this.knexInstance) {
            throw new Error("Azure SQL not connected");
        }
        return this.knexInstance;
    }

    async raw<TResult = any>(
        query: string,
        bindings?: any
    ): Promise<Knex.Raw<TResult>> {
        return this.getKnex().raw<TResult>(query, bindings);
    }

    /* -------------------------------------------------------------------------- */
    /*                               Health check                                 */
    /* -------------------------------------------------------------------------- */

    async testConnection(): Promise<{
        success: boolean;
        error?: string;
        executionTime?: number;
    }> {
        if (!this.isConnected()) {
            return { success: false, error: "Azure SQL not connected" };
        }

        const start = Date.now();

        try {
            await this.getKnex().raw("SELECT 1");

            const executionTime = Date.now() - start;

            try {
                this.metrics.recordAzureSqlQuery(
                    "healthcheck",
                    executionTime / 1000,
                    this.config.azureSqlDatabase
                );
            } catch (metricsError) {
                this.logger.error("Failed to record Azure SQL metrics", metricsError);
            }

            return { success: true, executionTime };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                               Helpers                                      */
    /* -------------------------------------------------------------------------- */

    private isConfigured(): boolean {
        return !!(
            this.config.azureSqlServer &&
            this.config.azureSqlDatabase &&
            this.config.azureSqlUser &&
            this.config.azureSqlPassword
        );
    }
}
