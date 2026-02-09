"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PostgresService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_1 = require("pg");
const drizzle_orm_1 = require("drizzle-orm");
const app_config_service_1 = require("src/config/app/app-config.service");
const database_metrics_facade_1 = require("src/config/observability/database-metrics.facade");
let PostgresService = PostgresService_1 = class PostgresService {
    config;
    metrics;
    logger = new common_1.Logger(PostgresService_1.name);
    pool = null;
    db = null;
    constructor(config, metrics) {
        this.config = config;
        this.metrics = metrics;
    }
    async connect(schema) {
        if (this.db) {
            this.logger.warn("Postgres already connected. connect() ignored.");
            return;
        }
        const isTest = this.config.env === "test";
        this.pool = new pg_1.Pool({
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
        this.db = (0, node_postgres_1.drizzle)(this.pool, { schema });
        if (this.config.runMigrations && this.config.env !== "production") {
            await (0, migrator_1.migrate)(this.db, { migrationsFolder: "drizzle" });
            this.logger.log("Postgres migrations executed");
        }
        this.logger.log("PostgreSQL connected");
    }
    async disconnect() {
        if (!this.pool)
            return;
        await this.pool.end();
        this.pool = null;
        this.db = null;
        this.logger.log("PostgreSQL disconnected");
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    getDb() {
        if (!this.db) {
            throw new Error("Postgres not connected");
        }
        return this.db;
    }
    isConnected() {
        return !!this.db && !!this.pool;
    }
    async withTransaction(fn) {
        const db = this.getDb();
        const start = Date.now();
        try {
            const result = await db.transaction(fn);
            this.metrics?.recordPostgresQuery("transaction", (Date.now() - start) / 1000, this.config.dbName);
            return result;
        }
        catch (error) {
            this.logger.error("Postgres transaction failed", error);
            throw error;
        }
    }
    async testConnection() {
        if (!this.isConnected()) {
            return { success: false, error: "Postgres not connected" };
        }
        const start = Date.now();
        try {
            await this.getDb().execute((0, drizzle_orm_1.sql) `SELECT current_database(), now();`);
            const duration = Date.now() - start;
            this.metrics?.recordPostgresQuery("healthcheck", (Date.now() - start) / 1000, this.config.dbName);
            return { success: true, duration };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.PostgresService = PostgresService;
exports.PostgresService = PostgresService = PostgresService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
        database_metrics_facade_1.DatabaseMetricsFacade])
], PostgresService);
