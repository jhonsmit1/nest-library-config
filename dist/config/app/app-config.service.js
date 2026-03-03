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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_constants_1 = require("./app-config.constants");
let AppConfigService = class AppConfigService {
    configService;
    options;
    validatedConfig;
    cache = new Map();
    constructor(configService, options) {
        this.configService = configService;
        this.options = options;
        if (this.options.schema) {
            this.validatedConfig = this.validateEnvironment(this.options.schema);
        }
    }
    validateEnvironment(schema) {
        const result = schema.safeParse(process.env);
        if (!result.success) {
            console.error(result.error.format());
            throw new Error("Invalid environment configuration");
        }
        return result.data;
    }
    resolveValue(key) {
        if (this.validatedConfig) {
            return this.validatedConfig[key];
        }
        return this.configService.get(key);
    }
    get(key) {
        if (this.options.cache && this.cache.has(key)) {
            return this.cache.get(key);
        }
        const value = this.resolveValue(key);
        if (this.options.cache) {
            this.cache.set(key, value);
        }
        return value;
    }
    getOrThrow(key) {
        const value = this.get(key);
        if (value === undefined) {
            throw new Error(`Configuration key "${key}" is missing`);
        }
        return value;
    }
    get env() {
        return this.getOrThrow("NODE_ENV");
    }
    get port() {
        return this.getOrThrow("PORT");
    }
    get corsAllowedOrigins() {
        return this.get("CORS_ALLOWED_ORIGINS") ?? [];
    }
    get dbHost() {
        return this.getOrThrow("DB_HOST");
    }
    get dbPort() {
        return this.getOrThrow("DB_PORT");
    }
    get dbUser() {
        return this.getOrThrow("DB_USER");
    }
    get dbPassword() {
        return this.getOrThrow("DB_PASSWORD");
    }
    get dbName() {
        return this.getOrThrow("DB_NAME");
    }
    get dbMaxConnections() {
        return this.getOrThrow("DB_MAX_CONNECTIONS");
    }
    get runMigrations() {
        return this.get("RUN_MIGRATIONS") ?? false;
    }
    get useSSL() {
        return this.get("USE_SSL") ?? false;
    }
    get azureSqlServer() {
        return this.getOrThrow("AZURE_SQL_SERVER");
    }
    get azureSqlDatabase() {
        return this.getOrThrow("AZURE_SQL_DATABASE");
    }
    get azureSqlUser() {
        return this.getOrThrow("AZURE_SQL_USER");
    }
    get azureSqlPassword() {
        return this.getOrThrow("AZURE_SQL_PASSWORD");
    }
    get azureSqlPort() {
        return this.getOrThrow("AZURE_SQL_PORT");
    }
    get azureSqlEncrypt() {
        return this.getOrThrow("AZURE_SQL_ENCRYPT");
    }
    get azureSqlTrustServerCertificate() {
        return this.get("AZURE_SQL_TRUST_SERVER_CERTIFICATE") === "true";
    }
    get testDbHost() {
        return this.getOrThrow("TEST_DB_HOST");
    }
    get testDbPort() {
        return Number(this.getOrThrow("TEST_DB_PORT"));
    }
    get testDbUser() {
        return this.getOrThrow("TEST_DB_USER");
    }
    get testDbPassword() {
        return this.getOrThrow("TEST_DB_PASSWORD");
    }
    get testDbName() {
        return this.getOrThrow("TEST_DB_NAME");
    }
    get heliosApiKey() {
        return this.getOrThrow("HELIOS_API_KEY");
    }
    get lokiEndpoint() {
        return this.get("LOKI_ENDPOINT");
    }
    get lokiUsername() {
        return this.get("LOKI_USERNAME");
    }
    get lokiPassword() {
        return this.get("LOKI_PASSWORD");
    }
    get awsRegion() {
        return this.get("AWS_REGION");
    }
    get cloudwatchLogGroup() {
        return this.get("CLOUDWATCH_LOG_GROUP");
    }
    get cloudwatchLogStream() {
        return this.get("CLOUDWATCH_LOG_STREAM");
    }
    get logLevel() {
        return this.getOrThrow("LOG_LEVEL");
    }
    get sicCognitoUserPoolId() {
        return this.getOrThrow("SIC_COGNITO_USER_POOL_ID");
    }
    get heliosWebCognitoUserPoolId() {
        return this.getOrThrow("HELIOS_WEB_COGNITO_USER_POOL_ID");
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(app_config_constants_1.APP_CONFIG_OPTIONS)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], AppConfigService);
