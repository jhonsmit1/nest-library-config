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
var AzureSqlService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureSqlService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const app_config_service_1 = require("../../app/app-config.service");
const database_metrics_token_1 = require("../database.metrics.token");
let AzureSqlService = AzureSqlService_1 = class AzureSqlService {
    config;
    metrics;
    logger = new common_1.Logger(AzureSqlService_1.name);
    knexInstance = null;
    constructor(config, metrics) {
        this.config = config;
        this.metrics = metrics;
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async connect() {
        if (this.knexInstance)
            return;
        if (!this.isConfigured()) {
            this.logger.warn("Azure SQL not configured. Skipping Azure SQL connection.");
            return;
        }
        try {
            this.knexInstance = (0, knex_1.default)({
                client: "mssql",
                connection: {
                    server: this.config.azureSqlServer,
                    database: this.config.azureSqlDatabase,
                    user: this.config.azureSqlUser,
                    password: this.config.azureSqlPassword,
                    port: this.config.azureSqlPort,
                    options: {
                        encrypt: this.config.azureSqlEncrypt,
                        trustServerCertificate: this.config.azureSqlTrustServerCertificate,
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
        }
        catch (error) {
            this.logger.error("Failed to connect to Azure SQL", error);
            this.knexInstance = null;
        }
    }
    async disconnect() {
        if (!this.knexInstance)
            return;
        try {
            await this.knexInstance.destroy();
            this.logger.log("Azure SQL connection closed");
        }
        catch (error) {
            this.logger.error("Error closing Azure SQL connection", error);
        }
        finally {
            this.knexInstance = null;
        }
    }
    isConnected() {
        return this.knexInstance !== null;
    }
    getKnex() {
        if (!this.knexInstance) {
            throw new Error("Azure SQL not connected");
        }
        return this.knexInstance;
    }
    async raw(query, bindings) {
        return this.getKnex().raw(query, bindings);
    }
    async testConnection() {
        if (!this.isConnected()) {
            return { success: false, error: "Azure SQL not connected" };
        }
        const start = Date.now();
        try {
            await this.getKnex().raw("SELECT 1");
            const executionTime = Date.now() - start;
            try {
                this.metrics.recordAzureSqlQuery("healthcheck", executionTime / 1000, this.config.azureSqlDatabase);
            }
            catch (metricsError) {
                this.logger.error("Failed to record Azure SQL metrics", metricsError);
            }
            return { success: true, executionTime };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    isConfigured() {
        return !!(this.config.azureSqlServer &&
            this.config.azureSqlDatabase &&
            this.config.azureSqlUser &&
            this.config.azureSqlPassword);
    }
};
exports.AzureSqlService = AzureSqlService;
exports.AzureSqlService = AzureSqlService = AzureSqlService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(database_metrics_token_1.DATABASE_METRICS)),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService, Object])
], AzureSqlService);
