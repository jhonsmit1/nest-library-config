import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "../env.schema";

@Injectable()
export class AppConfigService {
    constructor(private readonly config: ConfigService<EnvConfig>) { }

    get env(): string {
        return (
            this.config.get<string>("NODE_ENV", { infer: true }) ||
            "development"
        );
    }

    get port(): string {
        return this.config.get<string>("PORT", { infer: true }) || "3000";
    }


    get corsAllowedOrigins(): string[] {
        const origins = this.config.get<string[]>("CORS_ALLOWED_ORIGINS", {
            infer: true,
        });
        return Array.isArray(origins) ? origins : [];
    }


    // Database
    get dbHost(): string {
        return this.config.get<string>("DB_HOST", { infer: true }) || "";
    }

    get dbPort(): string {
        return this.config.get<string>("DB_PORT", { infer: true }) || "5432";
    }

    get dbUser(): string {
        return this.config.get<string>("DB_USER", { infer: true }) || "";
    }

    get dbPassword(): string {
        return this.config.get<string>("DB_PASSWORD", { infer: true }) || "";
    }

    get dbName(): string {
        return this.config.get<string>("DB_NAME", { infer: true }) || "";
    }

    get dbMaxConnections(): number {
        return (
            this.config.get<number>("DB_MAX_CONNECTIONS", { infer: true }) ||
            20
        );
    }

    // Azure SQL Database
    get azureSqlServer(): string {
        return (
            this.config.get<string>("AZURE_SQL_SERVER", { infer: true }) || ""
        );
    }

    get azureSqlDatabase(): string {
        return (
            this.config.get<string>("AZURE_SQL_DATABASE", { infer: true }) ||
            ""
        );
    }

    get azureSqlUser(): string {
        return (
            this.config.get<string>("AZURE_SQL_USER", { infer: true }) || ""
        );
    }

    get azureSqlPassword(): string {
        return (
            this.config.get<string>("AZURE_SQL_PASSWORD", { infer: true }) ||
            ""
        );
    }

    get azureSqlPort(): number {
        const port = this.config.get<string>("AZURE_SQL_PORT", {
            infer: true,
        });
        return port ? parseInt(port, 10) : 1433;
    }

    get azureSqlEncrypt(): boolean {
        const encrypt = this.config.get<string>("AZURE_SQL_ENCRYPT", {
            infer: true,
        });
        return encrypt === "true" || encrypt === undefined;
    }

    get azureSqlTrustServerCertificate(): boolean {
        const trust = this.config.get<string>(
            "AZURE_SQL_TRUST_SERVER_CERTIFICATE",
            {
                infer: true,
            }
        );
        return trust === "true";
    }

    get useSSL(): string {
        return this.config.get<string>("USE_SSL", { infer: true }) || "";
    }

    // Test Database
    get testDbHost(): string {
        return (
            this.config.get<string>("TEST_DB_HOST", { infer: true }) || ""
        );
    }

    get testDbPort(): string {
        return (
            this.config.get<string>("TEST_DB_PORT", { infer: true }) || ""
        );
    }

    get testDbUser(): string {
        return (
            this.config.get<string>("TEST_DB_USER", { infer: true }) || ""
        );
    }

    get testDbPassword(): string {
        return (
            this.config.get<string>("TEST_DB_PASSWORD", { infer: true }) || ""
        );
    }

    get testDbName(): string {
        return (
            this.config.get<string>("TEST_DB_NAME", { infer: true }) || ""
        );
    }

    get runMigrations(): boolean {
        const value = this.config.get<string>("RUN_MIGRATIONS", {
            infer: true,
        });

        return value === "true";
    }

}
