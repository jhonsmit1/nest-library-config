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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    config;
    constructor(config) {
        this.config = config;
    }
    get env() {
        return (this.config.get("NODE_ENV", { infer: true }) ||
            "development");
    }
    get port() {
        return this.config.get("PORT", { infer: true }) || "3000";
    }
    get corsAllowedOrigins() {
        const origins = this.config.get("CORS_ALLOWED_ORIGINS", {
            infer: true,
        });
        return Array.isArray(origins) ? origins : [];
    }
    get dbHost() {
        return this.config.get("DB_HOST", { infer: true }) || "";
    }
    get dbPort() {
        return this.config.get("DB_PORT", { infer: true }) || "5432";
    }
    get dbUser() {
        return this.config.get("DB_USER", { infer: true }) || "";
    }
    get dbPassword() {
        return this.config.get("DB_PASSWORD", { infer: true }) || "";
    }
    get dbName() {
        return this.config.get("DB_NAME", { infer: true }) || "";
    }
    get dbMaxConnections() {
        return (this.config.get("DB_MAX_CONNECTIONS", { infer: true }) ||
            20);
    }
    get azureSqlServer() {
        return (this.config.get("AZURE_SQL_SERVER", { infer: true }) || "");
    }
    get azureSqlDatabase() {
        return (this.config.get("AZURE_SQL_DATABASE", { infer: true }) ||
            "");
    }
    get azureSqlUser() {
        return (this.config.get("AZURE_SQL_USER", { infer: true }) || "");
    }
    get azureSqlPassword() {
        return (this.config.get("AZURE_SQL_PASSWORD", { infer: true }) ||
            "");
    }
    get azureSqlPort() {
        const port = this.config.get("AZURE_SQL_PORT", {
            infer: true,
        });
        return port ? parseInt(port, 10) : 1433;
    }
    get azureSqlEncrypt() {
        const encrypt = this.config.get("AZURE_SQL_ENCRYPT", {
            infer: true,
        });
        return encrypt === "true" || encrypt === undefined;
    }
    get azureSqlTrustServerCertificate() {
        const trust = this.config.get("AZURE_SQL_TRUST_SERVER_CERTIFICATE", {
            infer: true,
        });
        return trust === "true";
    }
    get useSSL() {
        return this.config.get("USE_SSL", { infer: true }) || "";
    }
    get testDbHost() {
        return (this.config.get("TEST_DB_HOST", { infer: true }) || "");
    }
    get testDbPort() {
        return (this.config.get("TEST_DB_PORT", { infer: true }) || "");
    }
    get testDbUser() {
        return (this.config.get("TEST_DB_USER", { infer: true }) || "");
    }
    get testDbPassword() {
        return (this.config.get("TEST_DB_PASSWORD", { infer: true }) || "");
    }
    get testDbName() {
        return (this.config.get("TEST_DB_NAME", { infer: true }) || "");
    }
    get runMigrations() {
        const value = this.config.get("RUN_MIGRATIONS", {
            infer: true,
        });
        return value === "true";
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
