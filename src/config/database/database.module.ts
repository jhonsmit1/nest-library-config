import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
import { PostgresService } from "./postgres/postgres.service";
import { AzureSqlService } from "./azure-sql/azure-sql.service";
import { AppConfigService } from "../app/app-config.service";
import { DATABASE_CLIENT } from "./database.tokens";
import { DATABASE_METRICS } from "./database.metrics.token";
import { NoopDatabaseMetrics } from "./noop-database-metrics";
import { DatabaseMetrics } from "./database.metrics";

@Global()
@Module({})
export class DatabaseModule {
    static forRoot<TSchema extends Record<string, unknown>>(
        options: DatabaseModuleOptions & { schema?: TSchema }
    ): DynamicModule {

        const providers: Provider[] = [
            {
                provide: DATABASE_METRICS,
                useClass: NoopDatabaseMetrics,
            },
        ];

        if (options.postgres) {
            providers.push(
                {
                    provide: PostgresService,
                    useFactory: (
                        config: AppConfigService,
                        metrics: DatabaseMetrics
                    ) => {
                        return new PostgresService(
                            config,
                            metrics,
                            options.schema
                        );
                    },
                    inject: [AppConfigService, DATABASE_METRICS],
                },
                {
                    provide: DATABASE_CLIENT,
                    useExisting: PostgresService,
                }
            );
        }

        if (options.azureSql) {
            providers.push(
                AzureSqlService,
                {
                    provide: DATABASE_CLIENT,
                    useExisting: AzureSqlService,
                }
            );
        }

        return {
            module: DatabaseModule,
            providers,
            exports: [DATABASE_CLIENT],
        };
    }
}
