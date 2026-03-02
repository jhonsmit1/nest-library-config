import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ZodSchema } from "zod";
import { APP_CONFIG_OPTIONS } from "./app-config.constants";
import { AppConfigModuleOptions } from "./app-config.interfaces";

@Injectable()
export class AppConfigService implements OnModuleInit {
    private validatedConfig?: Record<string, any>;
    private readonly cache = new Map<string, any>();

    constructor(
        private readonly configService: ConfigService,
        @Inject(APP_CONFIG_OPTIONS)
        private readonly options: AppConfigModuleOptions
    ) { }

    onModuleInit() {
        if (this.options.schema) {
            this.validateEnvironment(this.options.schema);
        }
    }

    private validateEnvironment(schema: ZodSchema<any>) {
        const result = schema.safeParse(process.env);

        if (!result.success) {
            console.error(result.error.format());
            throw new Error("Invalid environment configuration");
        }

        this.validatedConfig = result.data;
    }

    private resolveValue<T>(key: string): T | undefined {
        if (this.validatedConfig) {
            return this.validatedConfig[key] as T;
        }

        return this.configService.get<T>(key);
    }

    get<T = unknown>(key: string): T | undefined {
        if (this.options.cache && this.cache.has(key)) {
            return this.cache.get(key);
        }

        const value = this.resolveValue<T>(key);

        if (this.options.cache) {
            this.cache.set(key, value);
        }

        return value;
    }

    getOrThrow<T = unknown>(key: string): T {
        const value = this.get<T>(key);

        if (value === undefined) {
            throw new Error(`Configuration key "${key}" is missing`);
        }

        return value;
    }

    /* ===========================
       GETTERS TIPADOS (CLAVE)
       =========================== */

    get env(): string {
        return this.getOrThrow<string>("NODE_ENV");
    }

    get port(): number {
        return this.getOrThrow<number>("PORT");
    }

    get corsAllowedOrigins(): string[] {
        return this.get<string[]>("CORS_ALLOWED_ORIGINS") ?? [];
    }

    get dbHost(): string {
        return this.getOrThrow<string>("DB_HOST");
    }

    get dbPort(): number {
        return this.getOrThrow<number>("DB_PORT");
    }

    get dbUser(): string {
        return this.getOrThrow<string>("DB_USER");
    }

    get dbPassword(): string {
        return this.getOrThrow<string>("DB_PASSWORD");
    }

    get dbName(): string {
        return this.getOrThrow<string>("DB_NAME");
    }

    get dbMaxConnections(): number {
        return this.getOrThrow<number>("DB_MAX_CONNECTIONS");
    }

    get runMigrations(): boolean {
        return this.get<boolean>("RUN_MIGRATIONS") ?? false;
    }

    get useSSL(): boolean {
        return this.get<boolean>("USE_SSL") ?? false;
    }

    get azureSqlServer(): string {
        return this.getOrThrow<string>("AZURE_SQL_SERVER");
    }

    get azureSqlDatabase(): string {
        return this.getOrThrow<string>("AZURE_SQL_DATABASE");
    }

    get azureSqlUser(): string {
        return this.getOrThrow<string>("AZURE_SQL_USER");
    }

    get azureSqlPassword(): string {
        return this.getOrThrow<string>("AZURE_SQL_PASSWORD");
    }

    get azureSqlPort(): number {
        return Number(this.getOrThrow<string>("AZURE_SQL_PORT"));
    }

    get azureSqlEncrypt(): boolean {
        return this.get<string>("AZURE_SQL_ENCRYPT") === "true";
    }

    get azureSqlTrustServerCertificate(): boolean {
        return this.get<string>("AZURE_SQL_TRUST_SERVER_CERTIFICATE") === "true";
    }

    /* ===========================
   TEST DB GETTERS
   =========================== */

    get testDbHost(): string {
        return this.getOrThrow<string>("TEST_DB_HOST");
    }

    get testDbPort(): number {
        return Number(this.getOrThrow<string>("TEST_DB_PORT"));
    }

    get testDbUser(): string {
        return this.getOrThrow<string>("TEST_DB_USER");
    }

    get testDbPassword(): string {
        return this.getOrThrow<string>("TEST_DB_PASSWORD");
    }

    get testDbName(): string {
        return this.getOrThrow<string>("TEST_DB_NAME");
    }

}
