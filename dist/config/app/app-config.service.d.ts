import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "../env.schema";
export declare class AppConfigService {
    private readonly config;
    constructor(config: ConfigService<EnvConfig>);
    get env(): string;
    get port(): string;
    get corsAllowedOrigins(): string[];
    get dbHost(): string;
    get dbPort(): string;
    get dbUser(): string;
    get dbPassword(): string;
    get dbName(): string;
    get dbMaxConnections(): number;
    get azureSqlServer(): string;
    get azureSqlDatabase(): string;
    get azureSqlUser(): string;
    get azureSqlPassword(): string;
    get azureSqlPort(): number;
    get azureSqlEncrypt(): boolean;
    get azureSqlTrustServerCertificate(): boolean;
    get useSSL(): string;
    get testDbHost(): string;
    get testDbPort(): string;
    get testDbUser(): string;
    get testDbPassword(): string;
    get testDbName(): string;
    get runMigrations(): boolean;
}
