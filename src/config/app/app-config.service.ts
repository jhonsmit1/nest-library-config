import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ZodType } from "zod";
import { APP_CONFIG_OPTIONS } from "./app-config.constants";
import { AppConfigModuleOptions } from "./app-config.interfaces";
import { EnvConfig } from "../env.schema";
import { Logger } from "@nestjs/common";


@Injectable()
export class AppConfigService {
    private readonly validatedConfig?: EnvConfig;
    private readonly cache = new Map<keyof EnvConfig, unknown>();
    private readonly logger = new Logger(AppConfigService.name);

    constructor(
        private readonly configService: ConfigService,
        @Inject(APP_CONFIG_OPTIONS)
        private readonly options: AppConfigModuleOptions,

    ) {
        if (this.options.schema) {
            this.validatedConfig = this.validateEnvironment(this.options.schema);
        }
    }

    private validateEnvironment(schema: ZodType<EnvConfig>): EnvConfig {
        const result = schema.safeParse(process.env);
        if (!result.success) {
            this.logger.error("Invalid environment configuration", result.error.format());
            throw new Error("Invalid environment configuration");
        }

        return result.data;
    }

    private resolveValue<K extends keyof EnvConfig>(
        key: K
    ): EnvConfig[K] | undefined {
        if (this.validatedConfig) {
            return this.validatedConfig[key];
        }

        return this.configService.get<EnvConfig[K]>(key);
    }

    get<K extends keyof EnvConfig>(key: K): EnvConfig[K] | undefined {
        if (this.options.cache && this.cache.has(key)) {
            return this.cache.get(key) as EnvConfig[K];
        }

        const value = this.resolveValue(key);

        if (this.options.cache) {
            this.cache.set(key, value as EnvConfig[K]);
        }

        return value;
    }

    getOrThrow<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
        const value = this.get(key);

        if (value === undefined) {
            this.logger.error(`Missing configuration key: ${key}`);
            throw new Error(`Configuration key "${key}" is missing`);
        }

        return value;
    }

    /* ===========================
       CORE
       =========================== */

    get env() {
        return this.getOrThrow("NODE_ENV");
    }

    get port() {
        return this.getOrThrow("PORT");
    }

    get corsAllowedOrigins() {
        return this.get("CORS_ALLOWED_ORIGINS") ?? [];
    }

    /* ===========================
   DATABASE
   =========================== */

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

    /* ===========================
       AZURE SQL
       =========================== */

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
        return this.get("AZURE_SQL_TRUST_SERVER_CERTIFICATE") ?? false;
    }
    /* ===========================
       TEST DB
       =========================== */

    get testDbHost() {
        return this.getOrThrow("TEST_DB_HOST");
    }

    get testDbPort() {
        return this.getOrThrow("TEST_DB_PORT");
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

    /* ===========================
   CACHE
   =========================== */

    get catalogsCacheRefreshIntervalMs() {
        return this.get("CATALOGS_CACHE_REFRESH_INTERVAL_MS") ?? 3600000;
    }


    /* ===========================
       LOGGER / OBS
       =========================== */
    get logLevel() {
        return this.getOrThrow("LOG_LEVEL");
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

    /* ===========================
       AUTH
       =========================== */

    get sicCognitoUserPoolId() {
        return this.getOrThrow("SIC_COGNITO_USER_POOL_ID");
    }

    get heliosWebCognitoUserPoolId() {
        return this.getOrThrow("HELIOS_WEB_COGNITO_USER_POOL_ID");
    }

    get jwtSecret() {
        return this.getOrThrow("JWT_SECRET");
    }

    get heliosApiKey() {
        return this.getOrThrow("HELIOS_API_KEY");
    }

}
